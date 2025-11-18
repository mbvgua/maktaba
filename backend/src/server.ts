import dotenvx from "@dotenvx/dotenvx";

import app from "./app";

dotenvx.config();

const port = process.env.PORT;

// display which port server is working on
app.listen(port, () => {
  console.log(`[server]: server running at http://localhost:${port}...`);
});
