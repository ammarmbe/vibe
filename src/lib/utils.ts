import { QueryClient } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import { cache } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function updateInputSize(input: HTMLElement | null) {
	if (input == null) return;
	input.style.height = "0px";
	input.style.height = `${input.scrollHeight}px`;
}

const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
