import { getReply } from "@/lib/reply";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  if (params.slug.join("/") === "sebaran-wa/autoreply") {
    return autoreply({
      req: request,
      from: request.nextUrl.searchParams.get("from"),
      message: request.nextUrl.searchParams.get("message"),
    })
  }
  return NextResponse.json({ message: "nothing to see here, go away" })
}

export async function POST(request, { params }) {
  if (params.slug.join("/") === "sebaran-wa/autoreply") {
    const reqBody = await request.json();

    return autoreply({
      req: request,
      from: reqBody.from,
      message: reqBody.message,
    })
  }
  return NextResponse.json({ message: "nothing to see here, go away" })
}

const autoreply = ({ req, from, message }) => {

  if (!from || !message) {
    return NextResponse.json({ success: false, message: "Bad Request! 'from' or 'message' is required in query or body" }, { status: 400 });
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
    return NextResponse.json({ message: "A message from a group", groupID });
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

  // prevent self message reply // not working :(
  const senderPhoneNumber = process.env.BOT_PHONE_NUMBER || "";

  if (senderPhoneNumber.split(",").includes(phoneNumber)) {
    console.log("this is a self send message")
    return NextResponse.json({ message: "A self send message" });
  }

  // remove prefix
  const incomingPrefixes = process.env.INCOMING_PREFIXES.split(",");
  const prefix = incomingPrefixes.find(prx => message.startsWith(prx));
  if (!prefix) {
    console.log("no prefix match list: ", incomingPrefixes);
    return NextResponse.json({ message: "No prefix match" });
  }
  const cleanMessage = message.replace(prefix, "").trim();

  // get reply
  const reply = getReply(cleanMessage);

  return NextResponse.json({ data: reply });
}