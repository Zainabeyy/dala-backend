import "dotenv/config";
import express from "express";
import cors from "cors";
import { transporter } from "./mailer.js";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json()); // to read JSON body

app.get("/", (req, res) => {
  res.send("Contact API running");
});

app.post("/contact", async (req, res) => {
  const { name, email, inquiry } = req.body;

  if (!name || !email || !inquiry) {
    return res.status(400).json({ message: "All fields required" });
  }
  console.log("Sending email to:", process.env.RECEIVER_EMAIL);

  try {
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: `New Message from ${name}`,
      html: `
        <h3>New Inquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${inquiry}</p>
      `,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:5000");
});

export default app;