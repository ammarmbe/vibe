"use client";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const client = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000,
		},
	},
});

export default function ReactQueryProvider({
	children,
}: React.PropsWithChildren) {
	return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
