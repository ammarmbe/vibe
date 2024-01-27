"use client";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

export default function Button() {
	const { pending } = useFormStatus();
	const [prevPendingState, setPrevPendingState] = useState(false);
	const client = useQueryClient();

	// Revalidate feed after posting
	useEffect(() => {
		if (prevPendingState && !pending) {
			setTimeout(() => {
				client.invalidateQueries({ queryKey: ["homeFeed"] });
			}, 300);
		}

		setPrevPendingState(pending);
	}, [pending, prevPendingState, client]);

	return (
		<button
			type="submit"
			disabled={pending}
			className="border disabled:cursor-wait disabled:!opacity-50 rounded-sm text-sm px-1.5 py-0.5 hover:bg-accent hover:border-ring transition-colors absolute top-[6px] right-[6px]"
		>
			Post
		</button>
	);
}
