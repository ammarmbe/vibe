"use client";
import { SignOutButton, useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Page() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [usernameTooLong, setUsernameTooLong] = useState(false);
  const [bioTooLong, setBioTooLong] = useState(false);
  const [invalidUsername, setInvalidUsername] = useState(false);
  const { push } = useRouter();
  const { user } = useUser();

  if (user && user.unsafeMetadata.username) {
    push("/edit-user");
  }

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

      push("/");
    },
  });

  return (
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
            <CardTitle>Add your details</CardTitle>
            <CardDescription>
              You&apos;ll be able to change these later.
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
                  className={`text-sm text-danger ${
                    !usernameTaken && "hidden"
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
              className="rounded-md border transition-colors hover:bg-main/10 hover:border-main/50 text-main py-1.5 px-2.5"
            >
              Submit
            </button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
