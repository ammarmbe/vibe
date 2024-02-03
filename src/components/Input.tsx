"use client";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import he from "he";
import {
	Dispatch,
	RefObject,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from "react";
import ContentEditable from "react-contenteditable";
import sanitize from "sanitize-html";
import Spinner from "./Spinner";
import { UseMutationResult, useQuery } from "@tanstack/react-query";
import { updateInputSize } from "@/lib/utils";

function getCaretOffset(element: HTMLElement) {
	let caretOffset = 0;
	const selection = window.getSelection();

	if (selection && selection.rangeCount > 0) {
		const range = selection.getRangeAt(0);
		const preCaretRange = range.cloneRange();
		preCaretRange.selectNodeContents(element);
		preCaretRange.setEnd(range.endContainer, range.endOffset);
		caretOffset = preCaretRange.toString().length;
	}

	return caretOffset;
}

export default function Input({
	value,
	setValue,
	inputRef,
	setInputFocus,
	postMutation,
	className,
	relativeParent,
}: {
	value: {
		sanitized: string;
		unsanitized: string;
		mention: boolean;
		selected: boolean;
	}[];
	setValue: Dispatch<
		SetStateAction<
			{
				sanitized: string;
				unsanitized: string;
				mention: boolean;
				selected: boolean;
			}[]
		>
	>;
	inputRef: RefObject<HTMLElement>;
	setInputFocus?: Dispatch<SetStateAction<boolean>>;
	// biome-ignore lint/suspicious/noExplicitAny:
	postMutation: UseMutationResult<any, any, any, any>;
	className?: string;
	relativeParent?: string;
}) {
	const [mentionModalOpen, setMentionModalOpen] = useState(false);
	const [caretPosition, setCaretPosition] = useState({ left: 0, top: 0 });

	const handleSelectionChange = useCallback(() => {
		// get the caret x and y position
		const selection = window.getSelection();
		if (selection && selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			const rect = range.getBoundingClientRect();

			let left = rect.left;
			let top = rect.top;

			if (relativeParent) {
				// get the relative parent using querySelector
				const relativeParentElement = document.querySelector(relativeParent);

				// get the relative parent's x and y position
				const relativeParentRect =
					relativeParentElement?.getBoundingClientRect();

				// subtract the relative parent's x and y position from the caret's x and y position
				left = rect.left - (relativeParentRect?.left ?? 0);
				top = rect.top - (relativeParentRect?.top ?? 0);
			}
			setCaretPosition({ left: left, top: top });
		}

		// set selected = true for the word that the caret is in
		let position = getCaretOffset(inputRef.current as HTMLElement);
		const words = value.map((v) => v.sanitized);
		const newValue = [...value];

		for (let i = 0; i < words.length; i++) {
			if (words[i].length < position) {
				position -= words[i].length + 1;
			} else {
				for (const word of newValue) {
					word.selected = false;
				}
				newValue[i].selected = true;
				break;
			}
		}

		position = getCaretOffset(inputRef.current as HTMLElement);

		// check if the caret is at the end of the selected word and if it starts with @ then open the mention modal
		if (
			newValue
				.slice(0, newValue.findIndex((v) => v.selected) + 1)
				.map((v) => v.sanitized)
				.join(" ").length === position &&
			newValue.find((v) => v.selected)?.sanitized.startsWith("@") &&
			!newValue.find((v) => v.selected)?.unsanitized.includes("<a")
		) {
			setMentionModalOpen(true);
		} else {
			setMentionModalOpen(false);
		}

		setValue(newValue);
	}, [value]);

	useEffect(() => {
		document.addEventListener("selectionchange", handleSelectionChange);
		document.addEventListener("resize", handleSelectionChange);
		updateInputSize(inputRef.current);

		return () => {
			document.removeEventListener("selectionchange", handleSelectionChange);
			document.removeEventListener("resize", handleSelectionChange);
		};
	}, [value]);

	const { data, isLoading } = useQuery({
		queryKey: ["user", value.find((v) => v.selected)?.sanitized.slice(1)],
		queryFn: async () => {
			const res = await fetch(
				`/api/users?value=${value.find((v) => v.selected)?.sanitized.slice(1)}`,
			);
			return res.json() as Promise<
				{ id: number; name: string; username: string; image: string }[]
			>;
		},
		enabled: !!value.find((v) => v.selected),
	});

	return (
		<div className="row-span-3 order-1 break-words w-full min-w-0">
			{!value.map((v) => v.sanitized).join(" ").length ? (
				<p
					className={`absolute w-fit select-none pointer-events-none text-foreground/20 ${
						className ?? ""
					}`}
				>
					What's on your mind?
				</p>
			) : null}
			<ContentEditable
				className={`overflow-auto min-h-[1.5rem] ${
					className ?? "w-full bg-transparent outline-none break-words"
				}`}
				html={value.map((v) => v.unsanitized).join(" ")}
				tagName="p"
				id="textarea"
				innerRef={inputRef}
				disabled={postMutation.isLoading}
				onPaste={(e) => {
					e.preventDefault();

					const text = e.clipboardData.getData("text/plain");
					document.execCommand("insertHTML", false, text);
				}}
				onFocus={() => {
					setInputFocus?.(true);
				}}
				onBlur={() => {
					setInputFocus?.(false);
				}}
				onChange={(e) => {
					const words = e.target.value.replaceAll(/&nbsp;/g, " ").split(" ");

					// if word starts has <, join it with all the following words until it has >
					for (let i = 0; i < words.length; i++) {
						if (words[i].includes("<")) {
							if (words[i].includes(">")) continue;
							const j = i + 1;
							while (!words[j].includes(">")) {
								words[i] += ` ${words[j]}`;
								words.splice(j, 1);
							}
							words[i] += ` ${words[j]}`;
							words.splice(j, 1);
						}
					}

					const newValue = words.map((word) => {
						const sanitized = he.decode(
							sanitize(word, {
								allowedTags: [],
								allowedAttributes: {},
							}),
						);

						return {
							sanitized,
							unsanitized: word,
							mention: word.includes("<a"),
							selected: false,
						};
					});

					handleSelectionChange();
					setValue(newValue);
				}}
			/>
			<Popover open={mentionModalOpen} onOpenChange={setMentionModalOpen}>
				<PopoverTrigger
					className="fixed invisible pointer-events-none"
					style={{
						left: caretPosition.left,
						top: caretPosition.top,
					}}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
					key={caretPosition.left + caretPosition.top}
				>
					a
				</PopoverTrigger>
				<PopoverContent
					side="bottom"
					className="relative px-0 py-1 w-[200px]"
					onOpenAutoFocus={(e) => e.preventDefault()}
					onCloseAutoFocus={(e) => e.preventDefault()}
					onClick={(e) => e.preventDefault()}
				>
					<svg
						width="9"
						height="4"
						viewBox="0 0 9 4"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="absolute top-[-4px] left-[50%] transform translate-x-[-50%]"
					>
						<title>arrow</title>
						<path d="M4.49999 0L9 4H0L4.49999 0Z" className="fill-border" />
						<path
							d="M4.49996 1.32813L7.50001 4H1.50001L4.49996 1.32813Z"
							className="fill-popover"
						/>
					</svg>
					{isLoading ? (
						<div className="p-3 flex justify-center items-center">
							<Spinner size="md" />
						</div>
					) : data?.length ? (
						<div>
							{data.map((user) => (
								<button
									aria-label="Mention user"
									type="button"
									key={user.id}
									onClick={(e) => {
										e.preventDefault();

										// add link
										const newValue = [...value];
										const selectedWord = newValue.findIndex((v) => v.selected);

										newValue.splice(selectedWord, 1, {
											sanitized: `@${user.username}`,
											unsanitized: `<a class="bg-accent" contenteditable="false" href="/user/${user.username}">@${user.username}</a>`,
											mention: true,
											selected: false,
										});

										// add space after the link
										newValue.splice(selectedWord + 1, 0, {
											sanitized: "",
											unsanitized: "",
											mention: false,
											selected: false,
										});

										setMentionModalOpen(false);
										setValue(newValue);
									}}
									className="block w-full text-left px-2.5 py-1.5 hover:bg-accent hover:bg-opacity-10 transition-colors pointer-events-auto"
								>
									<div className="flex items-center">
										<img
											src={user.image}
											alt=""
											className="w-6 h-6 rounded-full"
										/>
										<div className="ml-2">
											<p className="text-sm leading-tight font-medium">
												{user.name}
											</p>
											<p className="text-xs leading-tight text-muted-foreground">
												@{user.username}
											</p>
										</div>
									</div>
								</button>
							))}
						</div>
					) : (
						<p className="text-accent text-xs text-center py-1">
							No users found...
						</p>
					)}
				</PopoverContent>
			</Popover>
		</div>
	);
}
