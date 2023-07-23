"use client";
import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@clerk/nextjs";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../Spinner";
import { Notification } from "@/lib/types";
import NotificationCard from "./NotificationCard";
import { client } from "@/lib/ReactQueryProvider";

export default function NotificationButton() {
  const { userId } = useAuth();
  const [unread, setUnread] = useState(false);

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["notifications", userId],
    queryFn: async ({ pageParam }) =>
      await (
        await fetch(`/api/notifications?notificationId=${pageParam}`)
      ).json(),
    // eslint-disable-next-line no-unused-vars
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length == 11) {
        return lastPage[lastPage.length - 1].id;
      } else {
        return undefined;
      }
    },
    enabled: Boolean(userId),
  });

  const readNotifications = useMutation({
    mutationFn: async () =>
      await fetch(`/api/notifications/read`, { method: "POST" }),
    onSuccess: () => {
      setTimeout(() => {
        setUnread(false);

        client.setQueryData(["notifications", userId], (oldData: any) => {
          return {
            pages: oldData.pages.map((page: any) => {
              return page.map((notification: Notification) => {
                return { ...notification, read: true };
              });
            }),
          };
        });
      }, 1000);
    },
  });

  useEffect(() => {
    if (
      data?.pages
        .flatMap((page) => page)
        .some((notification) => !notification.read)
    ) {
      setUnread(true);
    }
  }, [data]);

  return (
    <Popover>
      <PopoverTrigger
        className={`hover:bg-accent border hover:border-ring ${
          !unread && `after:content-none`
        } rounded-md relative after:-top-[3px] after:-right-[3px] after:bg-main after:absolute after:rounded-full after:aspect-square after:p-1.5 shadow-sm h-[34px] w-[34px] flex items-center justify-center after:transition-all transition-colors`}
        onClick={() => {
          unread && readNotifications.mutate();
        }}
        name="Notifications"
      >
        <Bell size={16} color="grey" />
      </PopoverTrigger>
      <PopoverContent className="p-0">
        {data && data?.pages[0].length > 0 ? (
          <>
            {isLoading ? (
              <div className="w-full h-[300px] flex p-2.5 items-center justify-center">
                <Spinner size="xl" />
              </div>
            ) : (
              <InfiniteScroll
                dataLength={data.pages.flatMap((page) => page).length}
                hasMore={hasNextPage || false}
                loader={
                  <div className="flex w-full justify-center">
                    <Spinner size="md" />
                  </div>
                }
                endMessage={
                  <p className="text-foreground/30 text-center text-sm">
                    No more notifications
                  </p>
                }
                next={fetchNextPage}
                height={300}
                className="flex flex-col p-2.5 gap-2.5"
              >
                {data.pages.map((page) => {
                  return page.map((notification: Notification) => {
                    return (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                      />
                    );
                  });
                })}
              </InfiniteScroll>
            )}
          </>
        ) : (
          <p className="text-foreground/30 text-center p-2.5 text-sm">
            No notifications yet...
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
