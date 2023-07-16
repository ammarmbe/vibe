"use client";
import { SignOutButton } from "@clerk/nextjs";
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
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function Page() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [showUsernameTaken, setShowUsernameTaken] = useState(false);
  const { push } = useRouter();

  const usernameMutation = useMutation({
    mutationFn: async () =>
      await axios.post(`/api/user/username?username=${username}&bio=${bio}`),
    onError(error: AxiosError) {
      if (error.response?.status === 409) {
        setShowUsernameTaken(true);
      }
    },
    onSuccess() {
      push("/");
    },
  });

  return (
    <main className="flex items-center justify-center w-full h-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (username === "") return;
          usernameMutation.mutate();
        }}
        className="flex gap-2.5 flex-col"
      >
        <Card>
          <CardHeader>
            <CardTitle>Add your details</CardTitle>
            <CardDescription>
              You'll be able to change these later.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Username</Label>
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setShowUsernameTaken(false);
                  }}
                  className="border focus:border-ring outline-none rounded-sm px-2 py-1"
                />
                <p
                  className={`text-sm text-danger ${
                    !showUsernameTaken && "hidden"
                  }`}
                >
                  Username already exists.
                </p>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Bio</Label>
                <textarea
                  placeholder="Bio"
                  name="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="border !h-fit focus:border-ring outline-none rounded-sm px-2 py-1 resize-none"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="w-full flex items-end justify-between">
            <SignOutButton>
              <button
                type="button"
                className="rounded-md border text-danger hover:bg-danger/5 border-danger/30 hover:border-danger/50 py-1.5 px-2.5"
              >
                Sign out
              </button>
            </SignOutButton>
            <button
              type="submit"
              className="rounded-md border border-main/20 hover:bg-main/5 hover:border-main/50 text-main py-1.5 px-2.5"
            >
              Submit
            </button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
