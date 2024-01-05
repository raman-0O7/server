import { model, Schema } from "mongoose";

const courseSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minLength: [5, "Title should be more than 5 characters"],
    maxLenght: [50, "Title should be less than 50 characters"]
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minLength: [20, "Description should be more than 20 characters"],
    maxLenght: [200, "Description should be less than 200 characters"]
  },
  thumbnail: {
    public_id: {
      type: String
    },
    secure_url: {
      type: String
    }
  },
  lectures: [
    {
      titile: String,
      description: String,
      thumbnail: {
        public_id: {
          type: String
        },
        secure_url: {
          type: String
        }
      },

    }
  ],
  numberOfLectures: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: Date,
    required: true


  }

}, { timestamps: true });

const courseModel = new model("Course", courseSchema);
export default courseModel;
