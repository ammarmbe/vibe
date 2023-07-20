"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import type { User } from "@/lib/types";
import Spinner from "@/components/Spinner";

export default function Page() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [showUsernameTaken, setShowUsernameTaken] = useState(false);
  const [usernameTooLong, setUsernameTooLong] = useState(false);
  const [bioTooLong, setBioTooLong] = useState(false);
  const [invalidUsername, setInvalidUsername] = useState(false);
  const { push } = useRouter();
  const { user } = useUser();

  const usernameMutation = useMutation({
    mutationFn: async () => {
      const status = (
        await fetch(
          `/api/user/username?username=${username}&bio=${bio}&userId=${user?.id}`,
          { method: "POST" }
        )
      ).status;

      if (status == 409) {
        throw new Error("Username already exists");
      } else return;
    },
    onError(error: Error) {
      if (error.message === "Username already exists") {
        setShowUsernameTaken(true);
      }
    },
    onSuccess: async () => {
      await user?.update({
        unsafeMetadata: { username: username },
      });

      push("/");
    },
  });

  const { data } = useQuery({
    queryKey: ["user", user?.username],
    queryFn: async () =>
      (await (
        await fetch(`/api/user?username=${user?.unsafeMetadata.username}`)
      ).json()) as User,
    enabled: Boolean(user),
  });

  useEffect(() => {
    if (data && data.username) {
      setUsername(data.username);
    }

    if (data && data.bio) {
      setBio(data.bio);
    }
  }, [data]);

  return !data || !user ? (
    <main className="flex items-center justify-center w-full h-full">
      <Spinner size="xl" />
    </main>
  ) : (
    <main className="flex items-center justify-center w-full h-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (username === "" || username.length > 16 || bio.length > 250)
            return;
          usernameMutation.mutate();
        }}
        className="flex gap-2.5 flex-col"
      >
        <Card className="w-[360px]">
          <CardHeader>
            <CardTitle>Update your details</CardTitle>
            <CardDescription>
              You&apos;re signed in as{" "}
              <a
                className="hover:underline"
                href={`/user/${user?.unsafeMetadata.username}`}
              >
                {user?.fullName}
              </a>
              .
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
                    setShowUsernameTaken(false);
                    if (e.target.value.length > 16) setUsernameTooLong(true);
                    else setUsernameTooLong(false);
                  }}
                  className="border dark:bg-ring/10 dark:focus:border-foreground/25 focus:border-ring outline-none rounded-sm px-2 py-1"
                />
                <p
                  className={`text-sm text-danger ${
                    !showUsernameTaken && "hidden"
                  }`}
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
                  Username can only include alphanumeric characters (a-z, 0-9)
                  and underscores.
                </p>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  placeholder="Bio"
                  id="bio"
                  autoComplete="off"
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
            <button
              type="button"
              onClick={() => push("/")}
              className="rounded-md border text-danger hover:bg-danger/5 border-danger/50 hover:border-danger/50 transition-colors py-1.5 px-2.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md border border-main/20 hover:bg-main/10 transition-colors dark:border-main/50 hover:border-main/50 text-main py-1.5 px-2.5"
            >
              Save
            </button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
