import mongoose from "mongoose";

const connect = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

mongoose.connection.on("disconnected", () => {
  console.error("Database DISCONNECTED!");
});
mongoose.connection.on("connected", () => {
  console.log("Connected to Database!");
});

export default connect;
