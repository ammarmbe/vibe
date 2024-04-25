# Vibe 🚀

Vibe is a social media web app created using Next.js 14, Neon's serverless driver, and Clerk. <br> Deployed at: [vibe.ambe.dev](https://vibe.ambe.dev/).

![vibe](https://github.com/ammarmbe/vibe/assets/117791580/abeaff9b-621e-4c25-b82b-45dd996dfed2)

## Features

- **User registration and login:** users can create an account and login to the website.
- **Creating, reading, updating, and deleting posts:** users can create posts, read posts from other users, edit or delete their own posts, **and mention others in their posts (new)**.
- **Comments and likes:** users can like and comment on posts, **and add reactions (new)**.
- **Profile page:** users can see their own and others' profile page.
- **Following other users:** users can follow others and see their posts in the "Following" feed.
- **Notifications:** users get notified when someone likes their post or follows them.
- **Responsive design**: the website is built with a beautiful mobile first design, which also works on larger desktop monitors.

## Tech Stack

Next.js, Neon's serverless driver (PostgreSQL), Clerk, React Query, TailwindCSS. <br> _Shadcn/ui is used for the popover and dialog components and the CSS variables._

Deployed on Vercel and Neon.

## Database Schema

```sql
CREATE TABLE follower_relation (
    follower character varying(200) NOT NULL,
    following character varying(200) NOT NULL
);

CREATE TABLE likes (
    userid character varying(200) NOT NULL,
    postid integer NOT NULL,
    type character varying(10)
);

CREATE TABLE notifications (
    id SERIAL NOT NULL,
    type character varying(200) NOT NULL,
    notifier character varying(200) NOT NULL,
    notified character varying(200) NOT NULL,
    read boolean DEFAULT false NOT NULL,
    createdat timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    postid integer
);

CREATE TABLE posts (
    id SERIAL NOT NULL,
    userid character varying(200) NOT NULL,
    parentnanoid character varying(12),
    nanoid character varying(12) NOT NULL,
    createdat timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    edited boolean DEFAULT false NOT NULL,
    content text NOT NULL
);

CREATE TABLE reposts (
    userid character varying(200) NOT NULL,
    postid integer NOT NULL,
    createdat timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE subscriptions (
    userid character varying(200) NOT NULL,
    subscription json NOT NULL
);



CREATE TABLE users (
    id character varying(200) NOT NULL,
    name character varying(250) NOT NULL,
    bio character varying(250),
    username character varying(32),
    email character varying(250) NOT NULL,
    image character varying(250) NOT NULL
);
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
