import { connect } from "@planetscale/database"

const config = {
  host: 'aws.connect.psdb.cloud',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
}

export const db = connect(config)