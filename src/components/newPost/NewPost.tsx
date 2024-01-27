import { auth } from "@clerk/nextjs";
import React from "react";
import Textarea from "./Textarea";
import Button from "./PostButton";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export default async function NewPost() {
	const { userId } = auth();

	async function NewPost(data: FormData) {
		"use server";
		const content = data.get("content") as string;
		if (content === "" || content.length > 512) return;
		const nanoId = nanoid(12);

		if (userId)
			await db.execute(
				"INSERT INTO posts (userId, content, nanoId) VALUES (:userId, :content, :nanoId)",
				{
					userId,
					content,
					nanoId,
				},
			);
	}

	if (userId) {
		return (
			<form action={NewPost} className="relative flex mb-2.5">
				<Textarea />
				<Button />
			</form>
		);
	}
	return null;
}
