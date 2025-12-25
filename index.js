const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true }
});

const PREFIX = '.';
const startTime = Date.now();

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
  console.log('Scan le QR code');
});

client.on('ready', () => {
  console.log('🕷️ DarkBot connecté');
});

client.on('message', async msg => {
  const text = msg.body.trim();

  if (!text.startsWith(PREFIX) && text !== 'menu') return;

  // MENU
  if (text === 'menu' || text === `${PREFIX}menu`) {
    return msg.reply(
`╭⛓️🕸️ DARK BOT SYSTEM 🕸️⛓️
│ Prefix : .
│ Status : Online
╰━━━━━━━━━━━━━━━╯

🕸️ GENERAL
.ping
.alive
.time
.date
.owner
.echo

🕸️ FUN
.joke
.quote
.fact
.random

🕸️ GROUP
.tagall
.groupinfo`
    );
  }

  // PING
  if (text === `${PREFIX}ping`) {
    return msg.reply('🏓 Pong');
  }

  // ALIVE
  if (text === `${PREFIX}alive`) {
    const s = Math.floor((Date.now() - startTime) / 1000);
    return msg.reply(`🟢 DarkBot en ligne\n⏱️ ${s}s`);
  }

  // TIME
  if (text === `${PREFIX}time`) {
    return msg.reply(`🕒 Heure : ${new Date().toLocaleTimeString()}`);
  }

  // DATE
  if (text === `${PREFIX}date`) {
    return msg.reply(`📅 Date : ${new Date().toLocaleDateString()}`);
  }

  // OWNER
  if (text === `${PREFIX}owner`) {
    return msg.reply('👤 Owner : Dark Émeraude');
  }

  // ECHO
  if (text.startsWith(`${PREFIX}echo `)) {
    return msg.reply(text.slice(6));
  }

  // FUN
  if (text === `${PREFIX}joke`) {
    return msg.reply('😂 Pourquoi les devs aiment le café ? Pour éviter les bugs.');
  }

  if (text === `${PREFIX}quote`) {
    return msg.reply('💬 Le succès est la somme de petits efforts répétés.');
  }

  if (text === `${PREFIX}fact`) {
    return msg.reply('📌 WhatsApp a été créé en 2009.');
  }

  if (text === `${PREFIX}random`) {
    return msg.reply(`🎲 ${Math.floor(Math.random() * 100)}`);
  }

  // GROUP INFO
  if (text === `${PREFIX}groupinfo`) {
    if (!msg.from.endsWith('@g.us')) return msg.reply('❌ Groupe uniquement');
    return msg.reply(`👥 Groupe ID : ${msg.from}`);
  }

  // TAGALL
  if (text === `${PREFIX}tagall`) {
    if (!msg.from.endsWith('@g.us')) return msg.reply('❌ Groupe uniquement');
    const chat = await msg.getChat();
    let mentions = [];
    let text = '📢 TAG ALL\n\n';
    for (let p of chat.participants) {
      mentions.push(p.id._serialized);
      text += `@${p.id.user} `;
    }
    return chat.sendMessage(text, { mentions });
  }
});

client.initialize();
