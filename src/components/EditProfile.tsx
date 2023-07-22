import { SignOutButton, useUser } from "@clerk/nextjs";
import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DialogClose } from "@radix-ui/react-dialog";
import { User } from "@/lib/types";
import { client } from "@/lib/ReactQueryProvider";
import { useRouter } from "next/navigation";

export default function EditProfile({ newUser }: { newUser: boolean }) {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [usernameTooLong, setUsernameTooLong] = useState(false);
  const [bioTooLong, setBioTooLong] = useState(false);
  const [invalidUsername, setInvalidUsername] = useState(false);
  const { user } = useUser();
  const { push } = useRouter();

  const usernameMutation = useMutation({
    mutationFn: async () => {
      const status = (
        await fetch(`/api/user/username?username=${username}&bio=${bio}`, {
          method: "POST",
        })
      ).status;

      if (status == 409) {
        throw new Error("Username already exists");
      } else return;
    },
    onError(error: Error) {
      if (error.message === "Username already exists") {
        setUsernameTaken(true);
      }
    },
    onSuccess: async () => {
      await user?.update({
        unsafeMetadata: { username: username },
      });

      !newUser &&
        client.setQueryData(
          ["user", user?.unsafeMetadata.username],
          (oldData: User | undefined) => {
            if (oldData) {
              return {
                ...oldData,
                username: username,
                bio: bio,
              };
            }
          }
        );

      newUser && push("/");
    },
  });

  const { data } = useQuery({
    queryKey: ["user", user?.username],
    queryFn: async () =>
      (await (
        await fetch(`/api/user?username=${user?.unsafeMetadata.username}`)
      ).json()) as User,
    enabled: !newUser,
  });

  useEffect(() => {
    if (data && data.username) {
      setUsername(data.username);
    }

    if (data && data.bio) {
      setBio(data.bio);
    }
  }, [data]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (username === "" || username.length > 16 || bio.length > 250) return;
        usernameMutation.mutate();
      }}
      className="flex gap-2.5 flex-col w-fit"
    >
      <Card className={`w-[360px] ${!newUser && `bg-background`}`}>
        <CardHeader>
          <CardTitle>
            {newUser ? `Add your details` : `Update your details`}
          </CardTitle>
          <CardDescription>
            {newUser ? (
              "You'll be able to change these later."
            ) : (
              <>
                You&apos;re signed in as{" "}
                <a
                  className="hover:underline"
                  href={`/user/${user?.unsafeMetadata.username}`}
                >
                  {user?.fullName}
                </a>
                .
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <input
                type="text"
                placeholder="Username"
                id="username"
                required={true}
                value={username}
                autoComplete="off"
                onChange={(e) => {
                  if (!e.target.value.match(/^\w*$/g)) {
                    setInvalidUsername(true);
                    return;
                  } else setInvalidUsername(false);

                  setUsername(e.target.value.toLocaleLowerCase());
                  setUsernameTaken(false);
                  if (e.target.value.length > 16) setUsernameTooLong(true);
                  else setUsernameTooLong(false);
                }}
                className="border dark:bg-ring/10 dark:focus:border-foreground/25 focus:border-ring outline-none rounded-sm px-2 py-1"
              />
              <p
                className={`text-sm text-danger ${!usernameTaken && "hidden"}`}
              >
                Username already exists.
              </p>
              <p
                className={`text-sm text-danger ${
                  !usernameTooLong && "hidden"
                }`}
              >
                Username can&apos;t be longer than 16 characters.
              </p>
              <p
                className={`text-sm text-danger ${
                  !invalidUsername && "hidden"
                }`}
              >
                Username can only include alphanumeric characters (a-z, 0-9) and
                underscores.
              </p>
            </div>

            <div className="flex flex-col relative space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                placeholder="Bio"
                autoComplete="off"
                id="bio"
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  if (e.target.value.length > 250) setBioTooLong(true);
                  else setBioTooLong(false);
                }}
                rows={3}
                className="border !h-fit dark:focus:border-foreground/25 dark:bg-ring/10 focus:border-ring outline-none rounded-sm px-2 py-1 resize-none"
              />
              <p className={`text-sm text-danger ${!bioTooLong && "hidden"}`}>
                Your bio can&apos;t be longer than 250 characters.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="w-full flex items-end justify-between">
          {newUser ? (
            <>
              <SignOutButton>
                <button
                  type="button"
                  className="rounded-md border transition-colors text-danger hover:bg-danger/5 hover:border-danger/50 py-1.5 px-2.5"
                >
                  Sign out
                </button>
              </SignOutButton>
              <button
                type="submit"
                onClick={() => usernameMutation.mutate()}
                className="rounded-md border transition-colors hover:bg-main/10 hover:border-main/50 text-main py-1.5 px-2.5"
              >
                Submit
              </button>
            </>
          ) : (
            <>
              <DialogClose
                type="button"
                className="rounded-md border text-danger hover:bg-danger/5 hover:border-danger/50 transition-colors py-1.5 px-2.5"
              >
                Cancel
              </DialogClose>
              <DialogClose
                type="submit"
                className="rounded-md border hover:bg-main/10 transition-colors hover:border-main/50 text-main py-1.5 px-2.5"
              >
                Save
              </DialogClose>
            </>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
