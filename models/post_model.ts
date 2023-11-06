import mongoose from "mongoose";

const post_schema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Post", post_schema);
