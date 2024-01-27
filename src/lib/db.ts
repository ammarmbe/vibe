import { connect } from "@planetscale/database";

const config = {
	host: "aws.connect.psdb.cloud",
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
};

export const db = connect(config);
