import mongoose from "mongoose";

const post_schema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Post", post_schema);
