import mongoose from "mongoose";

/**
 * mongoose.set("strictQuery", false); sets Mongoose's query strictness to false.
 * This means that Mongoose will not return an error if you try to query for a
 * non-existent field. Instead, it will simply return an empty result.
 * With strict query set to true, Mongoose will return an error if you try to
 * query for a non-existent field.
 */
mongoose.set("strictQuery", false);

const connectToDB = async () => {
  try {
      const { connection } = await mongoose.connect(
          process.env.MONGO_URI
    );

    if (connection) {
      console.log(`Connected to MongoDB: ${connection.host}`.cyan.underline);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
    }
    
//     process.exit(0): Indicates a successful termination. It's a way of saying "everything went fine."
// process.exit(1): Indicates that there was an issue, and the process is exiting due to an error. It's a common convention to use non-zero exit codes for errors.
};

export default connectToDB;
