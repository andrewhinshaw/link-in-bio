import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: String,
  email: String,
  accesToken: String,
  tokens: [String],
});

let User; 

try {
  User = mongoose.model("users");
} catch (err) {
  User = mongoose.model("users", UserSchema);
}

export default User;