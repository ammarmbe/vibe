import { client } from "@/lib/ReactQueryProvider";
import { Post } from "@/lib/types";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useMutation } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

// Textarea code
function updateTextAreaSize(textarea?: HTMLTextAreaElement) {
  if (textarea == null) return;
  textarea.style.height = "0";
  textarea.style.height = `${textarea.scrollHeight + 2}px`;
}

export default function OptionsButton({
  post,
  parentNanoId,
  postPage,
}: {
  post: Post;
  parentNanoId?: string;
  postPage?: boolean;
}) {
  const [border, setBorder] = useState<"delete" | "edit" | "">("");

  // Textarea code
  const [inputValue, setInputValue] = useState(post.content);
  const textareaRef = useRef<HTMLTextAreaElement>();
  const deleteRef = useRef<HTMLButtonElement>(null);

  const inputRef = useCallback((textarea: HTMLTextAreaElement) => {
    updateTextAreaSize(textarea);
    textareaRef.current = textarea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textareaRef.current);
  }, [inputValue]);

  function resetTextarea(opened: boolean) {
    opened && setInputValue(post.content);
  }

  const deleteMuatation = useMutation({
    mutationFn: async () => {
      await fetch(`/api/post?postId=${post.postId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      if (postPage) {
        window.location.reload();
        return;
      }

      function updater(oldData: any) {
        if (oldData)
          return {
            pages: oldData.pages.map((page: any) => {
              return page.filter(
                (oldPost: Post) => oldPost.postId != post.postId
              );
            }),
          };
      }

      client.setQueryData(["homeFeed"], updater);
      client.setQueryData(["comments"], updater);
      client.setQueryData(["userPosts", post.userId], updater);
      parentNanoId &&
        client.setQueryData(["post", parentNanoId], (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              comments: parseInt(oldData.comments) - 1,
            };
          }
        });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      await fetch(`/api/post?postId=${post.postId}&content=${inputValue}`, {
        method: "PUT",
      });
    },
    onSuccess: () => {
      function updater(oldData: any) {
        if (oldData)
          return {
            pages: oldData.pages.map((page: any) => {
              return page.map((oldPost: Post) => {
                if (oldPost.postId == post.postId) {
                  return {
                    ...oldPost,
                    content: inputValue,
                    edited: "1",
                  };
                } else {
                  return oldPost;
                }
              });
            }),
          };
      }

      client.setQueryData(["homeFeed"], updater);
      client.setQueryData(["comments"], updater);
      client.setQueryData(["userPosts", post.userId], updater);
      postPage &&
        client.setQueryData(["post", post.nanoId], (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              content: inputValue,
              edited: "1",
            };
          }
        });
    },
  });

  return (
    <Popover>
      <PopoverTrigger className="h-full border hover:border-ring hover:bg-accent rounded-sm transition-colors aspect-square flex items-center justify-center">
        <MoreHorizontal size={18} />
      </PopoverTrigger>
      <PopoverContent
        align={"end"}
        side={"top"}
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
            className="border-b-0 text-sm text-center rounded-t-sm transition-colors hover:bg-accent hover:border-ring border p-2"
          >
            Edit
          </DialogTrigger>
          <DialogContent className="p-5 !rounded-md">
            <div className="gap-1.5 flex">
              <a className="flex-none h-fit" href={`/user/${post.username}`}>
                <Image
                  src={post.image}
                  width={33}
                  height={33}
                  className="rounded-full"
                  alt={`${post.name}'s profile picture}`}
                />
              </a>
              <div className="flex flex-col flex-grow">
                <h2 className={`leading-tight font-medium`}>
                  <a href={`/user/${post.username}`}>{post.name}</a>
                </h2>
                <a
                  className={`hover:underline text-foreground/70 leading-none w-fit`}
                  href={`/user/${post.username.toLocaleLowerCase()}`}
                >
                  @{post.username}
                </a>
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  name="edit-content"
                  onFocus={() => {
                    textareaRef.current?.setSelectionRange(
                      post.content.length,
                      post.content.length
                    );
                  }}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  className={`mt-2.5 mb-4 bg-transparent max-h-36 resize-none outline-none`}
                />
              </div>
            </div>
            <DialogFooter className="!justify-between w-full flex !flex-row">
              <DialogClose className="hover:bg-accent text-sm self-left rounded-sm w-fit transition-colors hover:border-ring border px-2.5 py-1.5">
                Cancel
              </DialogClose>
              <div className="flex items-center gap-2.5">
                <p
                  className={`transition-colors text-xs text-foreground/60 ${
                    inputValue.length < 412 && `hidden`
                  } ${
                    inputValue.length > 481 &&
                    inputValue.length < 513 &&
                    `!text-yellow-500/90`
                  } ${inputValue.length > 512 && `!text-danger`}`}
                >
                  {512 - inputValue.length}
                </p>
                <DialogClose
                  onClick={() => {
                    inputValue.length < 513 &&
                      inputValue != post.content &&
                      inputValue.length > 0 &&
                      updateMutation.mutate();

                    inputValue.length == 0 && deleteRef.current?.click();
                  }}
                  className="text-main hover:bg-main/10 hover:border-main/50 text-sm rounded-sm w-fit transition-colors border px-2.5 py-1.5"
                >
                  Save
                </DialogClose>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div
          className={`border-b border-dashed transition-all ${
            border == "delete" && `border-danger/50 !border-solid`
          } ${border == "edit" && `border-ring !border-solid`}`}
        ></div>
        <Dialog>
          <DialogTrigger
            onMouseEnter={() => setBorder("delete")}
            onMouseLeave={() => setBorder("")}
            ref={deleteRef}
            className="text-danger hover:bg-danger/5 text-sm rounded-b-sm border-t-0 transition-colors hover:border-danger/50 border p-2"
          >
            Delete
          </DialogTrigger>
          <DialogContent className="p-5 max-w-[300px] !rounded-md">
            <DialogHeader className="!text-left">
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
