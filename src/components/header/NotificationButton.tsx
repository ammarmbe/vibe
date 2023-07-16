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
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../Spinner";
import { Notification } from "@/lib/types";
import NotificationCard from "../NotificationCard";
import { client } from "@/lib/reactQueryProvider";

export default function NotificationButton() {
  const { userId } = useAuth();
  const [unread, setUnread] = useState(false);

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["notifications", userId],
    queryFn: async ({ pageParam }) =>
      (await axios.get(`/api/notifications?notificationId=${pageParam}`)).data,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length == 11) {
        return lastPage[lastPage.length - 1].postId;
      } else {
        return undefined;
      }
    },
    cacheTime: 0,
    enabled: !!userId,
  });

  const readNotifications = useMutation({
    mutationFn: async () => await axios.post(`/api/notifications/read`),
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

  if (isLoading) return <></>;

  return (
    <Popover>
      <PopoverTrigger
        className={`hover:bg-accent border hover:border-ring ${
          !unread && `after:content-none`
        } rounded-md relative after:-top-[3px] after:-right-[3px] after:bg-main after:absolute after:rounded-full after:aspect-square after:p-1.5 shadow-sm h-[34px] w-[34px] flex items-center justify-center after:transition-all`}
        onClick={() => {
          readNotifications.mutate();
        }}
      >
        <Bell size={16} color="#4c4c4c" />
      </PopoverTrigger>
      <PopoverContent className="p-2.5">
        {data && data?.pages[0].length > 0 ? (
          <>
            <InfiniteScroll
              dataLength={data.pages.flatMap((page) => page).length}
              hasMore={hasNextPage || false}
              loader={
                <div className="flex w-full justify-center">
                  <Spinner size="md" />
                </div>
              }
              endMessage={
                <p className="text-ring/70 text-center text-sm">
                  No more notifications
                </p>
              }
              next={fetchNextPage}
              className="flex flex-col gap-2.5 max-h-[300px]"
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
          </>
        ) : (
          <p className="text-ring/70 text-center text-sm">
            No notifications yet...
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
