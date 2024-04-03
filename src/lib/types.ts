export type Post = {
  postid: string;
  nanoid: string;
  content: string;
  createdat: string;
  parentnanoid: string | null;

  name: string;
  username: string;
  image: string;
  userid: string;

  likecount: string;
  crycount: string;
  laughcount: string;
  heartcount: string;
  surprisecount: string;
  commentcount: string;
  userlikestatus: "like" | "cry" | "laugh" | "heart" | "surprise" | null;
  userrepoststatus: string;

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
  followedbyuser: string;
  followsuser: string;
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
  createdat: string;
  notifier: string;
  postid: string;
  notifierimage: string;
  notifierusername: string;
  notifiername: string;
  content: string;
  read: string;
  nanoid: string;
  deleted: string;
};

export interface Repost extends Post {
  repostername: string;
  reposterusername: string;
  repostcreatedat: string;
}
