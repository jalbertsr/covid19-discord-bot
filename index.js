require("dotenv").config();
const { BOT_TOKEN, CHANNEL_ID } = process.env
const Discord = require("discord.js");
const CronJob = require("cron").CronJob;

const { fetchGloablData } = require("./apiService");
const processCommand = require("./commands");
const { formatter } = require("./helpers");

const client = new Discord.Client();

const job = new CronJob("0 0 */5 * 3-4 *", async () => {
  const data = await fetchGloablData();
  const channel = client.channels.cache.get(CHANNEL_ID);
  const textToSend = formatter(data, "Global");
  channel.send(textToSend);
});

client.on('ready', () => {
  console.log('I am ready!');
  console.log('Cron job starting...')
  job.start();
});

client.on("message", async (receivedMessage) => {
  if (receivedMessage.content.startsWith("!covid")) {
    try {
      await processCommand(receivedMessage);
      console.log(`Command: [${receivedMessage.content}] executed. `);
    } catch (e) {
      console.error(e);
    }
  }
});

client.login(BOT_TOKEN);