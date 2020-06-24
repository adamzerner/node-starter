const dotEnv = require("dotenv");
const connectToDb = require("./connect-to-db");

dotEnv.config();
connectToDb(() => {
  console.log("connected");
});
