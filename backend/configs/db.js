import mongoose from "mongoose";

const connect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.error(err);
        throw err;
    }
};

mongoose.connection.on("disconnected", () => {
    console.error("Mongo Database DISCONNECTED!".red);
});
mongoose.connection.on("connected", () => {
    console.log("Connected".green, "to", "Mongo Database!".cyan.underline);
});

export default connect;
