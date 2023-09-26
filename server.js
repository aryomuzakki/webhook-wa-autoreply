const express = require("express");
const { readFileSync } = require("fs");

const app = express();

const port = process.env.PORT || 5000;

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
    return res.status(400).json({ success: false, reason: "Bad Request" })
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

  // reply format, attachment is optional
  // const reply = {
  //   "message": "Halo juga",
  //   "attachment": [ 
  //     {
  //       "data": "base 64 data from image/media",
  //       "caption": "caption media",
  //       "filename": "nama file.jpg"
  //     }
  //   ]
  // }

  // load file
  const logoBase64 = Buffer.from(readFileSync("./public/sample/Huta Fresh Market -bg putih.png")).toString("base64");
  const pdfProfileBase64 = Buffer.from(readFileSync("./public/sample/Proposal B2B Huta -sample -resized.pdf")).toString("base64");
  const posblocVidBase64 = Buffer.from(readFileSync("./public/sample/Huta Fresh Market di Posbloc -resized.mp4")).toString("base64");

  const reply = {}

  // regex match 
  // (hai / halo admin)
  const greetingText = /^(Halo|Hai)(\s+|)(\s+admin|)(\s+|)$/gi;
  // list match
  // (info huta / tentang huta)
  const aboutTextList = [/info( tentang | profil | )huta(| fresh market)/gi, /(tentang|profil) huta/gi];

  if (message.match(greetingText)) {
    reply.message = "Halo Sobat Sehat Huta~💕 \n\nYuks belanja stok untuk kebutuhan pokoknya di Huta Fresh Market ajah✨😉 \n\nSilahkan pilih menu dibawah: \n- List Harga\n- Format Pesan\n- Rekening"
  } else if (aboutTextList.some(aboutText => message.match(aboutText))) {
    reply.message = "Halo Sobat Sehat Huta~\n\nHuta Fresh Market adalah Platform belanja kebutuhan harian online dengan\nbeberapa produk seperti sayuran, buah segar, rempah-rempah, bahan pokok, dan snack.\nHuta memberikan pelayanan yang maksimal dengan\nmemastikan kualitas produk yang masih segar karena\ndiambil langsung dari petani.\nJadi, Sobat Sehat Huta tidak perlu repot lagi untuk belanja kebutuhan sehari-hari^^"
    const attachment = [
      {
        data: logoBase64,
        caption: "Berikut Logo Huta Fresh Market",
        filename: "Logo Huta Fresh Market.png",
      },
      {
        data: pdfProfileBase64,
        caption: "Silahkan dilihat Company Profile Huta Fresh Market berikut",
        filename: "Huta Fresh Market Profile.pdf",
      },
      {
        data: posblocVidBase64,
        caption: "Salah satu outlet kami ada di Posbloc Medan. Mari berkunjung~",
        filename: "Huta Fresh Market di Posbloc Medan.mp4",
      },
    ]
    reply.attachment = attachment;
  } else {
    reply.message = "_Ini adalah pesan otomatis_\n\nSilahkan balas dengan pilihan menu dibawah:\n- List Harga\n- Format Pesan\n -Rekening\n\nButuh informasi lebih lanjut? Hubungi admin di *wa.me/6289892700001*\n\n"
  }

  return res.json(reply);
}

app.get("/api/webhook/sebaran-wa/autoreply", autoreply);
app.post("/api/webhook/sebaran-wa/autoreply", autoreply);

app.listen(port, () => {
  console.log("Server started");
})