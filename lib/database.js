import mongoose from 'mongoose';

const connect = async () => {
  mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) console.log("Error connecting to MongoDB", err);
      else console.log("Connected to MongoDB");
    }
  )
}

export default connect;