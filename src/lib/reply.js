import { readFileSync } from "fs";
import { join as pathJoin } from "path";

const DEFAULT_MESSAGE = "_Maaf saya belum paham yang kamu maksud_\n\nSilahkan kirim balasan sesuai pilihan berikut:\n*!! Halo/Hai admin*\n*!! List Harga*\n*!! Format Pesan*\n -Rekening\n\nJika butuh informasi lebih lanjut, silahkan hubungi admin di *6289892700001* atau klik *wa.me/6289892700001*\n\n";

const MESSAGE_TEMPLATE = {
  "list harga": "Pilih list harga yang ingin kamu lihat:\n*!! List harga buah*\n*!! List harga sayur*",
  "list harga buah": "Halo Sobat Sehat Huta~💕\n\nBerikut list harga buahnya\n\n<<<<>>>>🥑🍋🥝BUAH BUAHAN🥭🍍🍊 \n\n*Alpukat Mentega 16500/kg\n*Apel Merah 60.000/kg\n*Apel Fuji 35.000/kg\n*Apel Hijau 49.000/kg\n*Belimbing 15.000/kg (po)\n*Bengkoang 12.000/Kg\n*Bit 24.000/Kg (po)\n*Jambu biji Merah 25.000/Kg (po)\n*Jambu klutuk 11.000/Kg\n*Jambu Air Putih 13.500/kg ( kosong )\n*Jeruk Kasturi 16.500/kg\n*Jeruk Manis 30.000/Kg\n*Jeruk Lemon Lokal 13.500/kg\n*Jeruk Nipis 14.500/kg\n*Jeruk Peras 13.000/kg\n*Jeruk Wogam 55.000/kg\n*Labu Kuning 7000/kg\n*Labu Jepang/Kabocay 24.000/Kg\n*Lemon RRC 53.000/Kg\n*Melon 16.500/Kg\n*Mangga Golek 33.500/kg (po)\n*Mangga Harum Manis 40.000/kg (po)\n*Naga 32.000/kg \n*Nanas 13.000/buah\n*Pepaya California 13.000/kg\n*Pepaya Kampung 11.000/kg\n*Pear Century 30.000/kg\n*Pisang Ambon 26.000/Sisir\n*Pisang Barangan 26.000/sisir\n*Pisang Barangan Merah 30.000/sisir\n*Pisang Kepok 25.000/sisir\n*Semangka 10.000/kg\n*Semangka kuning Non-Biji 11500/kg\n*Semangka Merah non-biji 25000/buah (+/- 2.3kg)\n*Strawberry 17.500/pack\n*Ubi Kayu 6.000/kg\n*Ubi Cilembu 16.000/Kg\n*Ubi Madu 16.000/kg\n*Ubi Ungu 16.000/kg\n*Ubi Taiwan 16.000/kg\n*Terong Belanda 2.000/100gr",
  "list harga sayur": `Halo Sobat Sehat Huta~💕\n\nBerikut list harga sayurnya\n\n<<<<>>>>🥬🍆🥦SAYUR🍆🥕🥬 \n \n*Bayam 4.000/ikat\n*Poeling/Bayam Jepanng 2.600/100gr (po)\n*Bayam merah 5.000/ikat\n*Brokoli 2.500/100gr\n*Buncis 1.700/100gr\n*Buncis Baby 2.750/100gr\n*Bunga Kol 2.600/100gr\n*Daun Bawang Prei 2.600/100gr\n*Daun Bawang 4.000/100gr\n*Daun Pandan 2.000/paket\n*Daun Jeruk 2.000/paket\n*Daun Salam 2.000/paket\n*Daun Kunyit 2.000/paket\n*Daun Mint 4.000/100gr\n*Daun Ubi 3.000/ikat\n*Daun pisang 1500/lembar\n*Edamame 6.500/100gr (po)\n*Gambas 12.000/kg \n*Genjer 3.000/ikat\n*Jagung Besar 1.000/100gr\n*Jagung Kecil 2.600/100gr\n*Kacang Kapri/Arcis 4.600/100gr\n*Kacang Panjang 1.500/100gr\n*Kangkung 3.500/ikat\n*Kailan 4.500/100gr (po)\n*Kemangi 2.000/ikat\n*Kentang Besar 1.400/100gr\n*Kentang Sedang 1.300/100gr\n*Kentang Kecil 1.100/100gr\n*kentang Merah 1.700/100gr\n*Kincung 3.000/buah\n*Kol  800/100gr\n*Labu Jipang Besar 2.700/buah\n*Labu Jipang Kecil 1.200/100gr\n*Lobak 2.000/100gr\n*Lettuce 3.400/100gr\n*Melinjo 2.600/100gr\n*Pak Choi 1.200/100gr\n*Pakis 3.000/ikat\n*Paprika Hijau 7.000/100gr\n*Paprika Merah 8.000/100gr\n*Pare 1.200/ons\n*Petai 6.500/papan\n*Rimbang 2.750/100gr\n*Sawi Pahit 1.300/100gr\n*Sawi Manis 1.500/100gr\n*Sawi Putih 1.500/100gr\n*Sayur parit 5.000/ikat\n*Daun sop/seledri 2.500/100gr\n*Selada 2.000/100gr\n*Selada Romaine 3.000/100gr\n*Tauge 1.200/100gr\n*Tauge Petik 2.000/100gr\n*Terong ungu 2.000/100gr \n*Timun 1.500/100gr\n*Timun Jepang 3000/100gr (po)\n*Tomat Super 1.800/100gr\n*Tomat Cherry 16000/pack\n*Wortel 1000/100gr`,
  "format pesan": "Silahkan kirim Format Pemesanan berikut:\n\n!! Saya mau pesan\n\nNama :\nNo. HP :\nAlamat :\nList Pesanan :\n\n Pesan dari H-1, diantar mulai pukul 09.00 WIB",
  "rekening": "Mandiri 1050010501256 A.n. HENNY PANDIANGAN\nBCA 0221808737 A.n. HENNY PANDIANGAN\nOVO 0898 2700 001\n",
}

// regex match 
// (hai / halo admin)
const greetingText = /^(Halo|Hai)(\s+huta|\s+huta fresh market)(\s+|)$/gi;
// list match
// (info huta / tentang huta)
const aboutTextList = [/info( tentang | profil | )huta(| fresh market)/gi, /(tentang|profil) huta/gi];

const generateMessage = (msg, phoneNumberOrGroupID) => {
  if (msg.match(greetingText)) {
    return "Halo Sobat Sehat Huta~💕 \n\nYuks belanja stok untuk kebutuhan pokoknya di Huta Fresh Market ajah✨😉 \n\nSilahkan pilih menu dibawah: \n*!! List Harga*\n*!! Format Pesan*\n*!! Rekening*\n\nContohnya ingin melihat list harga, maka ketik:\n\n*!! List Harga*";
  } else if (aboutTextList.some(aboutText => msg.match(aboutText))) {
    return "Halo Sobat Sehat Huta~\n\nHuta Fresh Market adalah Platform belanja kebutuhan harian online dengan\nbeberapa produk seperti sayuran, buah segar, rempah-rempah, bahan pokok, dan snack.\nHuta memberikan pelayanan yang maksimal dengan\nmemastikan kualitas produk yang masih segar karena\ndiambil langsung dari petani.\nJadi, Sobat Sehat Huta tidak perlu repot lagi untuk belanja kebutuhan sehari-hari^^";
  } else {
    return MESSAGE_TEMPLATE[msg.toLowerCase()] || DEFAULT_MESSAGE;
  }
}

const getAttachment = (msg, phoneNumberOrGroupID) => {
  const attachment = [];

  if (aboutTextList.some(aboutText => msg.match(aboutText))) {
    // load file
    const sampleDir = pathJoin(process.cwd(), 'src/sample');
    const logoBase64 = Buffer.from(readFileSync(`${sampleDir}/Huta Fresh Market -bg putih.png`)).toString("base64");
    const pdfProfileBase64 = Buffer.from(readFileSync(`${sampleDir}/Proposal B2B Huta -sample -resized.pdf`)).toString("base64");
    const posblocVidBase64 = Buffer.from(readFileSync(`${sampleDir}/Huta Fresh Market di Posbloc -resized.mp4`)).toString("base64");

    attachment.push(...[
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
    ])
  }

  return attachment.length > 0 ? attachment : undefined;
}

export const getReply = (msg, phoneNumberOrGroupID) => {

  const generatedMsg = generateMessage(msg, phoneNumberOrGroupID);

  const attachment = getAttachment(msg, phoneNumberOrGroupID);

  return { message: generatedMsg, attachment }
}