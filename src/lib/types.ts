export type Post = {
  postId: string;
  nanoId: string;
  content: string;
  createdAt: string;
  parentId: string | null;

  name: string;
  username: string;
  image: string;
  userId: string;

  likes: string;
  comments: string;
  likedByUser: string;
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
