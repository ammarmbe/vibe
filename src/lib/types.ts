export type Post = {
  postId: number;
  nanoId: string;
  content: string;
  createdAt: number;

  name: string;
  username: string;
  image: string;
  userId: string;

  likes: number;
  comments: number;
  likedByUser: number;
};
