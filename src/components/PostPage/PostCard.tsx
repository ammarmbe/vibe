import { Post, Repost } from "@/lib/types";
import Image from "next/image";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Heart, MessageCircle, Pencil, Repeat2 } from "lucide-react";
import Link from "@/components/Link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  HoverCardPortal,
} from "../ui/hover-card";
import dynamic from "next/dynamic";
import { auth, useAuth } from "@clerk/nextjs";
const UserCard = dynamic(() => import("../PostCard/UserCard"), {
  ssr: false,
});
const ShareButton = dynamic(() => import("../PostCard/ShareButton"), {
  ssr: false,
});
const LikeButton = dynamic(() => import("../PostCard/LikeButton"), {
  ssr: false,
});
const OptionsButton = dynamic(() => import("../PostCard/OptionsButton"), {
  ssr: false,
});
dayjs.extend(relativeTime);

export default function PostCard({ post }: { post: Post | Repost }) {
  let userid: string | undefined | null;

  if (typeof window === "undefined") {
    userid = auth().userId;
  } else {
    userid = useAuth().userId;
  }

  const commentOrComments =
    parseInt(post.commentcount) === 1 ? "Comment" : "Comments";

  return (
    <div
      className={
        post.postid === "0" ? "opacity-50 pointer-events-none" : undefined
      }
    >
      {"repostername" in post ? (
        <div className="bg-border rounded-t-md p-1 px-2 text-xs -mb-2 pb-[calc(0.75rem-1px)] flex items-center gap-1">
          <Repeat2
            size={14}
            strokeWidth={2}
            className="text-muted-foreground"
          />
          <p className="text-muted-foreground">
            <Link
              href={`/user/${post.reposterusername}`}
              className="font-semibold"
            >
              {post.repostername}
            </Link>{" "}
            reposted this
          </p>
        </div>
      ) : null}
      <article
        className={`rounded-md bg-background p-2.5 gap-1.5 flex shadow-sm z-10 relative border ${post.parentnanoid ? "rounded-t-none border-t-0" : ""}`}
      >
        <Link className="flex-none h-fit" href={`/user/${post.username}`}>
          <Image
            src={post.image}
            width={32}
            height={32}
            className="rounded-full"
            alt={`${post.name}'s profile picture}`}
          />
        </Link>
        <HoverCard>
          <div className="flex flex-col flex-grow w-[calc(100%-39px)]">
            <div className="grid grid-cols-[1fr,auto] grid-rows-[auto,auto]">
              <HoverCardTrigger
                className="p-0 m-0 w-fit h-fit leading-tight"
                asChild
              >
                <div>
                  <Link href={`/user/${post.username}`}>
                    <span className="leading-tight font-medium self-baseline block text-lg truncate">
                      {post.name}
                    </span>
                    <span className="hover:underline text-muted-foreground w-fit leading-tight block">
                      @{post.username}
                    </span>
                  </Link>
                </div>
              </HoverCardTrigger>
              <time
                dateTime={dayjs(
                  new Date(parseInt(post.createdat) * 1000),
                ).format("YYYY-MM-DD HH:MM")}
                className="text-sm leading-tight text-muted-foreground self-baseline"
              >
                {dayjs(new Date(parseInt(post.createdat) * 1000)).fromNow()}
              </time>
            </div>
            <HoverCardPortal>
              <HoverCardContent className="p-2.5 h-fit w-fit z-20 relative">
                <UserCard username={post.username} />
              </HoverCardContent>
            </HoverCardPortal>
            <p
              className="mt-2.5 break-words w-full mb-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <div className="flex justify-between w-full gap-1">
              <div className="flex gap-1.5 items-center flex-wrap-reverse w-fit">
                {userid ? (
                  <LikeButton
                    likecount={parseInt(post.likecount)}
                    crycount={parseInt(post.crycount)}
                    heartcount={parseInt(post.heartcount)}
                    laughcount={parseInt(post.laughcount)}
                    surprisecount={parseInt(post.surprisecount)}
                    userlikestatus={post.userlikestatus}
                    postid={post.postid}
                    userid={post.userid}
                  />
                ) : (
                  <Link
                    href="/sign-up"
                    aria-label="like"
                    className="text-xs px-2 gap-1 leading-[1.3] py-1 border transition-colors rounded-md h-full select-none order-1 items-end flex justify-center hover:bg-main/10 hover:border-main/50 dark:text-[#f5315c] text-main"
                  >
                    <div className="h-4 w-4 flex items-center justify-center">
                      <Heart size={14} />
                    </div>
                    <span className="h-fit">
                      {parseInt(post.likecount)}{" "}
                      {parseInt(post.likecount) === 1 ? "like" : "likes"}
                    </span>
                  </Link>
                )}
                <Link
                  href={`/post/${post.nanoid}`}
                  className="text-xs px-2 py-1 border rounded-md transition-colors hover:border-ring hover:bg-accent items-end flex gap-1 justify-center order-2 leading-[1.3] h-fit"
                >
                  <div className="h-4 w-4 flex items-center justify-center">
                    <MessageCircle size={14} />
                  </div>
                  <span className="h-fit">
                    {post.commentcount} {commentOrComments}
                  </span>
                </Link>
              </div>
              <div className="flex gap-1.5 flex-none items-center justify-end h-fit self-end">
                {parseInt(post.edited) === 1 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="px-0.5 cursor-auto">
                        <Pencil size={14} className="text-[#666666]" />
                      </TooltipTrigger>
                      <TooltipContent className="text-xs px-2">
                        <p>This post has been edited</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <ShareButton post={post} />
                {userid === post.userid && <OptionsButton post={post} />}
              </div>
            </div>
          </div>
        </HoverCard>
      </article>
    </div>
  );
}
