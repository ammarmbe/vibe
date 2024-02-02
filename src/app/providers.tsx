"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/nextjs";

export default function Providers({ children }: React.PropsWithChildren) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
					},
				},
			}),
	);

	return (
		<ClerkProvider
			appearance={{ variables: { colorPrimary: "#cd002b" } }}
			publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
		>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</ClerkProvider>
	);
}
