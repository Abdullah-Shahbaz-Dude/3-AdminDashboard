const mongoose = require("mongoose");
const Workbook = require("../model/Alex/WorksheetsSchema");
require("dotenv").config({ path: "../.env" });

const workbooks = [
  {
    _id: new mongoose.Types.ObjectId("64f8a1c9e8b7a2a1f3d90001"),
    title: "Workbook 1",
    description: "Introduction to topic",
    link: new mongoose.Types.ObjectId(),
    questions: [
      {
        question:
          "Think of a recent conversation where you were trying to listen. What helped you stay focused?",
        answerType: "text",
      },
      {
        question:
          "Were there moments when your attention drifted why do you think that happened?",
        answerType: "text",
      },
      {
        question:
          "Did you interrupt or zone out? What did you notice about your behaviour?",
        answerType: "text",
      },
      {
        question:
          "Were you more focused on what you wanted to say than what the other person was saying?",
        answerType: "text",
      },
      {
        question:
          "Did you seek reassurance during the conversation (e.g., 'Am I making sense?')?",
        answerType: "text",
      },
      {
        question:
          "How did the other person respond overall — did they feel heard?",
        answerType: "text",
      },
      {
        question:
          "What one skill or mindset would you like to practise in future conversations?",
        answerType: "text",
      },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId("64f8a1c9e8b7a2a1f3d90002"),
    title: "Workbook 2",
    description: "Introduction to topic",
    link: new mongoose.Types.ObjectId(),
    questions: [
      { question: "What is your name?", answerType: "text" },
      { question: "What is your age?", answerType: "number" },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId("64f8a1c9e8b7a2a1f3d90003"),
    title: "Workbook 3",
    description: "Introduction to topic",
    link: new mongoose.Types.ObjectId(),
    questions: [
      { question: "What is your name?", answerType: "text" },
      { question: "What is your age?", answerType: "number" },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId("64f8a1c9e8b7a2a1f3d90004"),
    title: "Workbook 4",
    description: "Introduction to topic",
    link: new mongoose.Types.ObjectId(),
    questions: [
      { question: "What is your name?", answerType: "text" },
      { question: "What is your age?", answerType: "number" },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId("64f8a1c9e8b7a2a1f3d90005"),
    title: "Workbook 5",
    description: "Introduction to topic",
    link: new mongoose.Types.ObjectId(),
    questions: [
      { question: "What is your name?", answerType: "text" },
      { question: "What is your age?", answerType: "number" },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId("64f8a1c9e8b7a2a1f3d90006"),
    title: "Workbook 6",
    description: "Introduction to topic",
    link: new mongoose.Types.ObjectId(),
    questions: [
      { question: "What is your name?", answerType: "text" },
      { question: "What is your age?", answerType: "number" },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId("64f8a1c9e8b7a2a1f3d90007"),
    title: "Workbook 7",
    description: "Introduction to topic",
    link: new mongoose.Types.ObjectId(),
    questions: [
      { question: "What is your name?", answerType: "text" },
      { question: "What is your age?", answerType: "number" },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId("64f8a1c9e8b7a2a1f3d90008"),
    title: "Workbook 8",
    description: "Introduction to topic",
    link: new mongoose.Types.ObjectId(),
    questions: [
      { question: "What is your name?", answerType: "text" },
      { question: "What is your age?", answerType: "number" },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId("64f8a1c9e8b7a2a1f3d90009"),
    title: "Workbook 9",
    description: "Introduction to topic",
    link: new mongoose.Types.ObjectId(),
    questions: [
      { question: "What is your name?", answerType: "text" },
      { question: "What is your age?", answerType: "number" },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId("64f8a1c9e8b7a2a1f3d9000a"),
    title: "Workbook 10",
    description: "Introduction to topic",
    link: new mongoose.Types.ObjectId(),
    questions: [
      { question: "What is your name?", answerType: "text" },
      { question: "What is your age?", answerType: "number" },
    ],
  },
  // ... repeat for all 29 workbooks
];
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    await Workbook.deleteMany();
    await Workbook.insertMany(workbooks);
    console.log("Workbooks added!");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seed();
