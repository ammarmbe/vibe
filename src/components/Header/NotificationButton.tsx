"use client";
import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@clerk/nextjs";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../Spinner";
import { Notification } from "@/lib/types";
import NotificationCard from "./NotificationCard";
import { registerServiceWorker, saveSubscription } from "@/lib/utils";

export default function NotificationButton() {
  const { userId } = useAuth();
  const [unread, setUnread] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam = 2147483647 }) => {
      const res = await fetch(`/api/notifications?notificationId=${pageParam}`);
      return await res.json();
    },
    getNextPageParam: (lastPage, _pages) => {
      if (lastPage?.length >= 11) {
        return lastPage[lastPage.length - 1].id;
      }
      return undefined;
    },
    enabled: Boolean(userId),
  });

  const readNotifications = useMutation({
    mutationFn: async () =>
      await fetch("/api/notifications/read", { method: "POST" }),
    onMutate: () => {
      setTimeout(() => {
        setUnread(false);

        queryClient.setQueryData(
          ["notifications"],
          (oldData: { pages: Notification[][] | undefined } | undefined) => {
            return {
              pages: oldData?.pages?.map((page) => {
                return page.map((notification) => {
                  return { ...notification, read: "true" };
                });
              }),
            };
          },
        );
      }, 1000);
    },
    onError: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  useEffect(() => {
    if (
      data?.pages
        .flatMap((page) => page)
        .some((notification) => !notification?.read)
    ) {
      setUnread(true);
    }
  }, [data]);

  const notificationsSupported =
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window;

  if (notificationsSupported) {
    useEffect(() => {
      if (userId) {
        subscribe(userId);
      }
    }, [userId]);
  }

  return (
    <Popover>
      <PopoverTrigger
        className={`hover:bg-accent border hover:border-ring ${
          !unread && "after:content-none"
        } rounded-md relative after:-top-[3px] after:-right-[3px] after:bg-main after:absolute after:rounded-full after:aspect-square after:p-1.5 shadow-sm h-[34px] w-[34px] flex items-center justify-center after:transition-all transition-colors`}
        onClick={() => {
          unread && readNotifications.mutate();
        }}
        aria-label="Notifications"
      >
        <Bell size={16} color="grey" />
      </PopoverTrigger>
      <PopoverContent className="p-0 overflow-hidden relative h-[300px]">
        {data?.pages[0] && data?.pages[0].length > 0 ? (
          <>
            {isLoading ? (
              <div className="flex p-2.5 items-center justify-center inset-0 absolute">
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
                className="flex flex-col p-2.5 gap-2.5 overflow-auto inset-0 absolute"
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

const subscribe = async (userid: string | null | undefined) => {
  if (!userid) return;

  // check if a service worker is already registered
  let swRegistration = await navigator.serviceWorker.getRegistration();

  if (!swRegistration) {
    swRegistration = await registerServiceWorker();
  }

  await window?.Notification.requestPermission();

  try {
    const options = {
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      userVisibleOnly: true,
    };
    const subscription = await swRegistration.pushManager.subscribe(options);

    await saveSubscription(subscription, userid);
  } catch (err) {}
};
