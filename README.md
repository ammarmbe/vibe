# Vibe 2.0 🚀

Vibe is a social media web app created using Next.js 13, PlanetScale's databasejs, and Clerk. Deployed at: [vibe.ammare.live](https://vibe.ammare.live/).

## Features

- **User registration and login:** users can create an account and login to the website.
- **Creating, reading, updating, and deleting posts:** users can create posts, read posts from other users, and edit or delete their own posts.
- **Comments and likes:** users can like and comment on posts.
- **Profile page:** users can see their own and others' profile page.
- **Following other users:** users can follow others and see their posts in the "Following" feed.
- **Notifications:** users get notified when someone likes their post or follows them.
- **Responsive design**: the website is built with a beautiful mobile first design, which also works on larger desktop monitors.

## Tech Stack

Next.js, PlanetScale's databasejs (MySQL), Clerk, React Query, TailwindCSS. <br> _Shadcn/ui is used for the popover and dialog components and the CSS variables._

Deployed on Vercel and PlanetScale.

## Database Schema (MySQL)

```sql
CREATE TABLE `posts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` varchar(200) NOT NULL,
  `content` varchar(512) NOT NULL,
  `parentNanoId` varchar(12) DEFAULT NULL,
  `nanoId` varchar(12) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `edited` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `posts_userId_idx` (`userId`),
  KEY `posts_parentNanoId_idx` (`parentNanoId`),
  KEY `posts_createdAt_idx` (`createdAt`),
  KEY `posts_nanoId_idx` (`nanoId`)
);

CREATE TABLE `likes` (
  `userId` varchar(200) NOT NULL,
  `postId` int NOT NULL,
  PRIMARY KEY (`userId`,`postId`),
  KEY `likes_postId_idx` (`postId`),
  KEY `likes_userId_idx` (`userId`)
);

CREATE TABLE `users` (
  `id` varchar(200) NOT NULL,
  `name` varchar(250) NOT NULL,
  `bio` varchar(250) DEFAULT NULL,
  `username` varchar(16) DEFAULT NULL,
  `email` varchar(250) NOT NULL,
  `image` varchar(250) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `users_username_idx` (`username`)
);

CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(200) NOT NULL,
  `notifier` varchar(200) NOT NULL,
  `notified` varchar(200) NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `postId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `postId` (`postId`,`type`,`notifier`),
  KEY `notifications_notified_idx` (`notified`)
);

CREATE TABLE `follower_relation` (
  `follower` varchar(200) NOT NULL,
  `following` varchar(200) NOT NULL,
  PRIMARY KEY (`follower`,`following`),
  KEY `follower_relation_follower_idx` (`follower`),
  KEY `follower_relation_following_idx` (`following`)
);
```
