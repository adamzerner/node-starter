const mongoose = require("mongoose");

module.exports = (cb) => {
  return mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(cb)
    .catch((e) => {
      console.error("Initial database connection error: ", e);
    })
    .then(() => {
      mongoose.connection.on("error", (err) => {
        console.error(
          "Database connection error after initial successful connection: ",
          err
        );
      });
    });
};
