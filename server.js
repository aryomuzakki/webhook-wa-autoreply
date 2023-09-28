require("dotenv").config()
const express = require("express");
const { readFileSync } = require("fs");
const cors = require("cors");
const { getReply } = require("./src/reply");
const app = express();

const port = process.env.PORT || 5000;

// cors
app.use(cors({
  origin: "https://web.whatsapp.com",
}))

const autoreply = (req, res) => {

  let from = "";
  let message = "";

  if (req.method === "GET") {
    from = req.query.from;
    message = req.query.message;
  }
  if (req.method === "POST") {
    from = req.body.from;
    message = req.body.message;
  }

  if (!from || !message) {
    return res.status(400).json({ success: false, message: "Bad Request" })
  }

  const [isChat, phoneNumber] = from.includes("@c.us") ? [true, from.split("@")[0]] : [false, undefined]
  const [isGroup, groupID] = from.includes("@g.us") ? [true, from.split("@")[0]] : [false, undefined]
  // const [phoneNumber, source] = from.split("@");
  // const [isChat, isGroup] = source.startsWith("c") ? [true, false] : source.startsWith("g") ? [false, true] : [false, false];

  console.log(`new incoming message ${isGroup ? "from group" : ""}: `)
  console.log({ timestamp: { miliseconds: Date.now(), iso: new Date().toISOString() } })
  console.log({ from, message })

  if (isGroup) {
    console.log({ isGroup, groupID })
    return res.json({ success: true, groupID });
  }

  console.log({ phoneNumber })

  // json response format, attachment is optional
  // "data": {
  //   "message": "Halo juga",
  //   "attachment": [ 
  //     {
  //       "data": "base 64 data from image/media",
  //       "caption": "caption media",
  //       "filename": "nama file.jpg"
  //     }
  //   ]
  // }

  // prevent self message reply
  const senderPhoneNumber = process.env.SENDER_PHONE_NUMBER || "";

  if (senderPhoneNumber.split(",").includes(phoneNumber)) {
    console.log("this is a self send message")
    return res.json({ success: true, message: "A self send message" });
  }

  const reply = getReply(message);

  return res.json({ data: reply });
}

app.get("/api/webhook/sebaran-wa/autoreply", autoreply);
app.post("/api/webhook/sebaran-wa/autoreply", autoreply);

app.listen(port, () => {
  console.log("Server started");
})