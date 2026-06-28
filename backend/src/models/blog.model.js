import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    title: { type: String, required: true },
    tone: { type: String },
    language: { type: String },

    content: { type: String }, 

    images: [
      {
        url: String,
        smallUrl: String,
        thumbUrl: String,
        prompt: String,
        source: String,
        index: Number,
        photographer: String,
        photographerUrl: String,
        unsplashUrl: String,
        downloadLocation: String
      }
    ],

  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
