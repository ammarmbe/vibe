export type Post = {
  postId: number;
  nanoId: string;
  content: string;
  createdAt: number;
  parentId: number | null;

  name: string;
  username: string;
  image: string;
  userId: string;

  likes: number;
  comments: number;
  likedByUser: number;
};

export type User = {
  id: string;
  name: string;
  bio: string;
  username: string;
  email: string;
  image: string;
};
