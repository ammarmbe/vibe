"use client";
import { Post } from "@/lib/types";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, PencilIcon, Trash2 } from "lucide-react";
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import Image from "next/image";
import Input from "../Input";
import sanitize from "sanitize-html";

export default function OptionsButton({ post }: { post: Post }) {
  const [border, setBorder] = useState<"delete" | "edit" | "">("");
  const queryClient = useQueryClient();

  const [value, setValue] = useState<
    {
      sanitized: string;
      unsanitized: string;
      mention: boolean;
      selected: boolean;
    }[]
  >(
    post.content.split(" ").map((v) => ({
      sanitized: sanitize(v, {
        allowedTags: [],
      }),
      unsanitized: v,
      mention: false,
      selected: false,
    })),
  );

  const deleteRef = useRef<HTMLButtonElement>(null);

  const inputRef = useRef<HTMLElement>(null);

  function resetTextarea(opened: boolean) {
    opened &&
      setValue(
        post.content.split(" ").map((v) => ({
          sanitized: sanitize(v, {
            allowedTags: [],
          }),
          unsanitized: v,
          mention: false,
          selected: false,
        })),
      );
  }

  const deleteMuatation = useMutation({
    mutationFn: async () => {
      await fetch(`/api/post?postid=${post.postid}`, {
        method: "DELETE",
      });
    },
    onMutate: () => {
      function updater(oldData: { pages: Post[][] } | undefined) {
        if (oldData)
          return {
            pages: oldData.pages.map((page) => {
              return page.filter((oldPost) => oldPost.postid !== post.postid);
            }),
          };
      }

      queryClient.setQueryData(["homeFeed", "Home"], updater);
      queryClient.setQueryData(["comments", post.parentnanoid], updater);
      queryClient.setQueryData(["userPosts", post.userid], updater);

      queryClient.setQueryData(
        ["postPage", post.parentnanoid],
        (oldData: Post | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              commentcount: (parseInt(oldData.commentcount) - 1).toString(),
            };
          }
        },
      );

      queryClient.setQueryData(["postPage", post.nanoid], () => {
        return {
          postid: post.postid,
          deleted: "1",
          nanoid: post.nanoid,
        };
      });
    },
    onError: () => {
      queryClient.invalidateQueries(["homeFeed", "Home"]);
      queryClient.invalidateQueries(["comments", post.parentnanoid]);
      queryClient.invalidateQueries(["userPosts", post.userid]);
      queryClient.invalidateQueries(["postPage", post.parentnanoid]);
      queryClient.invalidateQueries(["postPage", post.nanoid]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/post", {
        method: "PUT",
        body: JSON.stringify({
          postid: post.postid,
          content: value
            .map((v) => v.unsanitized)
            .join(" ")
            .trim(),
        }),
      });
    },
    onMutate: () => {
      function updater(oldData: { pages: Post[][] } | undefined) {
        if (oldData)
          return {
            pages: oldData.pages.map((page) => {
              return page.map((oldPost) => {
                if (oldPost.postid === post.postid) {
                  return {
                    ...oldPost,
                    content: value
                      .map((v) => v.unsanitized)
                      .join(" ")
                      .trim(),
                    edited: "1",
                  };
                }
                return oldPost;
              });
            }),
          };
      }

      queryClient.setQueryData(["homeFeed", "Home"], updater);
      queryClient.setQueryData(["comments", post.parentnanoid], updater);
      queryClient.setQueryData(["userPosts", post.userid], updater);

      queryClient.setQueryData(
        ["post", post.nanoid],
        (oldData: Post | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              content: value
                .map((v) => v.unsanitized)
                .join(" ")
                .trim(),
              edited: "1",
            };
          }
        },
      );
    },
    onError: () => {
      queryClient.invalidateQueries(["homeFeed", "Home"]);
      queryClient.invalidateQueries(["comments", post.parentnanoid]);
      queryClient.invalidateQueries(["userPosts", post.userid]);
      queryClient.invalidateQueries(["post", post.nanoid]);
    },
  });

  return (
    <Popover>
      <PopoverTrigger
        aria-label="More options"
        className="border p-1 hover:border-ring h-fit hover:bg-accent rounded-sm transition-colors flex items-center justify-center"
      >
        <MoreHorizontal size={16} />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="top"
        className="flex flex-col shadow-sm p-0 border-0 w-[100px]"
      >
        <Dialog onOpenChange={(e) => resetTextarea(e)}>
          <DialogTrigger
            onMouseEnter={() => {
              setBorder("edit");
            }}
            onMouseLeave={() => {
              setBorder("");
            }}
            className="border-b-0 text-sm text-center rounded-t-sm transition-colors hover:bg-accent hover:border-ring border p-2 disabeld:cursor-not-allowed disabled:text-foreground/50 disabled:hover:bg-accent/10 flex items-end justify-center gap-1.5 leading-[1.3]"
          >
            <div className="h-5 w-5 flex items-center justify-center">
              <PencilIcon size={14} />
            </div>
            <span className="h-fit">Edit</span>
          </DialogTrigger>
          <DialogContent className="p-5 !rounded-md" id="editMenu">
            <div className="gap-1.5 flex">
              <div className="flex-none h-fit">
                <Image
                  src={post.image}
                  width={32}
                  height={32}
                  className="rounded-full"
                  alt={`${post.name}'s profile picture}`}
                />
              </div>
              <div className="grid grid-rows-[auto,auto,auto] flex-grow w-full">
                <h2 className="leading-tight font-medium">{post.name}</h2>
                <h3 className="text-muted-foreground leading-tight w-fit">
                  @{post.username}
                </h3>
                <Input
                  inputRef={inputRef}
                  postMutation={updateMutation}
                  setValue={setValue}
                  value={value}
                  className={
                    "mt-2.5 mb-4 bg-transparent max-h-36 resize-none outline-none"
                  }
                  relativeParent="#editMenu"
                />
              </div>
            </div>
            <DialogFooter className="!justify-between w-full flex !flex-row">
              <DialogClose className="hover:bg-accent text-sm self-left rounded-sm w-fit transition-colors hover:border-ring border px-2.5 py-1.5">
                Cancel
              </DialogClose>
              <div className="flex items-center gap-2.5">
                <p
                  className={`transition-colors text-xs text-right p-1 w-[43px] ${(() => {
                    if (value.map((v) => v.sanitized).join(" ").length < 412)
                      return "hidden";
                    if (value.map((v) => v.sanitized).join(" ").length < 481)
                      return "text-muted-foreground";
                    if (value.map((v) => v.sanitized).join(" ").length < 512)
                      return "text-yellow-500/90";
                    return "text-danger";
                  })()}`}
                >
                  {512 - value.map((v) => v.sanitized).join(" ").length}
                </p>
                <DialogClose
                  disabled={
                    value.map((v) => v.sanitized).join(" ").length > 512 ||
                    updateMutation.isLoading
                  }
                  onClick={() => {
                    updateMutation.mutate();

                    value.map((v) => v.sanitized).join(" ").length === 0 &&
                      deleteRef.current?.click();
                  }}
                  className="text-main hover:bg-main/10 hover:border-main/50 text-sm rounded-sm w-fit transition-colors border px-2.5 py-1.5 disabled:opacity-70 disabled:hover:border-main/30 disabled:hover:bg-main/5"
                >
                  Save
                </DialogClose>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div
          className={`border-b border-dashed transition-all ${
            border === "delete" && "border-danger/50 !border-solid"
          } ${border === "edit" && "border-ring !border-solid"}`}
        />
        <Dialog>
          <DialogTrigger
            onMouseEnter={() => setBorder("delete")}
            onMouseLeave={() => setBorder("")}
            ref={deleteRef}
            className="text-danger hover:bg-danger/5 text-sm rounded-b-sm border-t-0 transition-colors hover:border-danger/50 border p-2 flex items-end justify-center gap-1.5 leading-[1.3]"
          >
            <div className="h-5 w-5 flex items-center justify-center">
              <Trash2 size={14} />
            </div>
            <span className="h-fit">Delete</span>
          </DialogTrigger>
          <DialogContent className="p-5 max-w-[300px] !rounded-md">
            <DialogHeader className="!text-left space-y-2">
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                post.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="!justify-between w-full flex !flex-row">
              <DialogClose className="hover:bg-accent text-sm self-left rounded-sm w-fit transition-colors hover:border-ring border px-2.5 py-1.5">
                Cancel
              </DialogClose>
              <DialogClose
                onClick={() => deleteMuatation.mutate()}
                className="text-danger hover:bg-danger/5 text-sm rounded-sm w-fit transition-colors hover:border-danger/50 border px-2.5 py-1.5"
              >
                Delete
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PopoverContent>
    </Popover>
  );
}
