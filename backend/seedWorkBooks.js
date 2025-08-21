const mongoose = require("mongoose");
const WorkBook = require("./model/Alex/WorksheetsSchema");

console.log("Starting DB connection...");

mongoose
  .connect(
    "mongodb+srv://shahbazabdullah72:Ga753PeEzsRbRm7E@cluster0.w0oklxs.mongodb.net/test"
  )
  .then(() => {
    console.log("mongo is connected");
  })
  .catch((err) => {
    console.log("not connected to Database", err);
  });

const workbookData = [
  {
    title: "NUmber 1",
    questions: [
      { question: "Do you feel overwhelmed?", answer: "" },
      { question: "How often do you relax?", answer: "" },
    ],
  },
  {
    title: "number 2",
    questions: [
      { question: "Do you feel overwhelmed?", answer: "" },
      { question: "How often do you relax?", answer: "" },
    ],
  },
];

async function seedData() {
  console.log("🟡 Seeding started...");
  try {
    const deleteResult = await WorkBook.deleteMany();
    console.log(`🗑️ Deleted: ${deleteResult.deletedCount} old records`);

    const insertResult = await WorkBook.insertMany(workbookData);
    console.log(`✅ Inserted: ${insertResult.length} workbooks`);

    console.log("✅ Workbooks seeded successfully!");
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
  } finally {
    mongoose.connection.close();
  }
}

seedData();
