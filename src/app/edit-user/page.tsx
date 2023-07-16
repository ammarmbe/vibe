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
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import type { User } from "@/lib/types";
import Spinner from "@/components/Spinner";

export default function Page() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [showUsernameTaken, setShowUsernameTaken] = useState(false);
  const { push } = useRouter();
  const { user } = useUser();

  const usernameMutation = useMutation({
    mutationFn: async () =>
      await axios.post(
        `/api/user/username?username=${username}&bio=${bio}&userId=${user?.id}`
      ),
    onError(error: AxiosError) {
      if (error.response?.status === 409) {
        setShowUsernameTaken(true);
      }
    },
    onSuccess() {
      push("/");
    },
  });

  const { data } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: async () =>
      (await axios.get(`/api/user?userId=${user?.id}`)).data as User,
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
          if (username === "") return;
          usernameMutation.mutate();
        }}
        className="flex gap-2.5 flex-col"
      >
        <Card className="max-w-[300px]">
          <CardHeader>
            <CardTitle>Update your details</CardTitle>
            <CardDescription>
              You're signed in as{" "}
              <a className="hover:underline" href={`/user/${user?.id}`}>
                {user?.fullName}
              </a>
              .
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
                  className="border dark:bg-ring/10 focus:border-ring outline-none rounded-sm px-2 py-1"
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
                  className="border !h-fit dark:bg-ring/10 focus:border-ring outline-none rounded-sm px-2 py-1 resize-none"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="w-full flex items-end justify-end">
            <button
              type="submit"
              className="rounded-md border border-main/20 hover:bg-main/10 dark:border-main/30 hover:border-main/50 text-main py-1.5 px-2.5"
            >
              Save
            </button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
