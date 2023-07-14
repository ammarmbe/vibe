// Code from CodevoWeb
"use client";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const client = new QueryClient();

function ReactQueryProvider({ children }: React.PropsWithChildren) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default ReactQueryProvider;
