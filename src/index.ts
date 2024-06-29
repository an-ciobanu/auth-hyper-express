/*
	File for the entr point in the application
*/
import dotenv from "dotenv";

import createApp from "./app";
import connectDB from "./config/database";

// Setting up the config for the process envs
dotenv.config();

async function main() {
  //We await the app function
  const app = await createApp();

  //We connect to the database
  connectDB();
  const PORT = process.env.PORT || "3000";

  //We start the application
  await app.listen(PORT);
  console.log(`Server running on port:${PORT}`);
}

main();
