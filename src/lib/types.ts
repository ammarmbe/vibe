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
	userRepostStatus: string;

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
	followsUser: string;
};

export type Notification = {
	id: string;
	type:
		| "likedPost.surprise"
		| "likedPost.laugh"
		| "likedPost.heart"
		| "likedPost.cry"
		| "likedPost.like"
		| "commentedOnPost"
		| "followedUser"
		| "mentioned.post"
		| "mentioned.comment"
		| "reposted";
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

export interface Repost extends Post {
	reposterName: string;
	reposterUsername: string;
	repostCreatedAt: string;
}
