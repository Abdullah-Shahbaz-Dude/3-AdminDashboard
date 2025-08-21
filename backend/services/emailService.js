const nodemailer = require("nodemailer");
const Workbook = require("../model/Alex/WorksheetsSchema");

async function sendWorkbookEmail(workbookId, answers, userName) {
  const workbook = await Workbook.findById(workbookId);
  const workbookTitle = workbook ? workbook.title : "Unknown workbook";

  let transporter;
  if (process.env.NODE_ENV === "production") {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS,
      },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }

  const htmlContent = `
    <h3>Workbook Submission from ${userName}</h3>
    <p>Workbook: ${workbookTitle} (ID: ${workbookId})</p>
    <ul>
      ${answers
        .map(
          (a) =>
            `<li><strong>Q${+a.questionIndex + 1}:</strong> ${a.answer}</li>`
        )
        .join("")}
    </ul>
  `;

  const info = await transporter.sendMail({
    from:
      process.env.NODE_ENV === "production"
        ? process.env.ADMIN_EMAIL
        : '"Workbook App Test" <no-reply@example.com>',
    to:
      process.env.NODE_ENV === "production"
        ? process.env.ADMIN_EMAIL
        : "admin@example.com",
    subject: `New Workbook Submission - ${userName}`,
    html: htmlContent,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  }
}

module.exports = sendWorkbookEmail;
