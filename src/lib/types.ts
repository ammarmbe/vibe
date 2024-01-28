export type Post = {
	postId: string;
	nanoId: string;
	content: string;
	createdAt: string;
	parentNanoId: string | null;

	name: string;
	username: string;
	image: string;
	userId: string;

	likeCount: string;
	cryCount: string;
	laughCount: string;
	heartCount: string;
	surpriseCount: string;
	commentCount: string;
	userLikeStatus: "like" | "cry" | "laugh" | "heart" | "surprise" | null;

	deleted: string;
	edited: string;
};

export type User = {
	id: string;
	name: string;
	bio: string;
	username: string;
	image: string;
	followers: string;
	followedByUser: string;
};

export type Notification = {
	id: string;
	type:
		| "likedPost.surprise"
		| "likedPost.laugh"
		| "likedPost.cry"
		| "likedPost.like"
		| "commentedOnPost"
		| "followedUser";
	createdAt: string;
	notifier: string;
	postId: string;
	notifierImage: string;
	notifierUsername: string;
	notifierName: string;
	content: string;
	read: string;
	nanoId: string;
	deleted: string;
};
