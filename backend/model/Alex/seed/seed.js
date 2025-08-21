const mongoose = require("mongoose");
const Question = require("../../../model/Alex/WorksheetsSchema");

const MONGO_URI =
  "mongodb+srv://shahbazabdullah72:Ga753PeEzsRbRm7E@cluster0.w0oklxs.mongodb.net/UserId";

const questions = [
  {
    title: "What motivates you every day?",
    description: "Write a few lines about your source of motivation.",
  },
  {
    title: "Describe your biggest challenge.",
    description: "How did you overcome it?",
  },
  {
    title: "What is your goal for this year?",
    description: "Share your personal or professional goal.",
  },
  // Add more questions as needed
];

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    await Question.deleteMany(); // Optional: clear old questions
    await Question.insertMany(questions);

    console.log("Questions seeded successfully");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Error seeding questions:", err);
  });
