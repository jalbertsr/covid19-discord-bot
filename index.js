require("dotenv").config();
const { BOT_TOKEN, CHANNEL_ID } = process.env
const Discord = require("discord.js");
const levenshtein = require("js-levenshtein");
const CronJob = require("cron").CronJob;

const { fetchGloablData } = require("./apiService");
const processCommand = require("./commands");
const { formatter } = require("./helpers");

const client = new Discord.Client();

const job = new CronJob("0 0 */3 * * *", async () => {
  const data = await fetchGloablData();
  const channel = client.channels.cache.get(CHANNEL_ID);
  const textToSend = formatter(data, "Global");
  channel.send(textToSend);
  console.log("Cron job executed at:", new Date())
});

client.on('ready', () => {
  console.log('I am ready!');
  console.log('Cron job starting...')
  job.start();
});

client.on("message", async (receivedMessage) => {
  const msg = receivedMessage.content;
  const mainCommand = "!covid";
  if (levenshtein(msg, mainCommand) <= 2) {
      receivedMessage.channel.send("I don't understand the command. Try `!covid help`");
  };
  if (msg.startsWith(mainCommand)) {
    try {
      await processCommand(receivedMessage);
      console.log(`Command: [${msg}] executed.`);
    } catch (e) {
      console.error(e);
    }
  }
});

client.login(BOT_TOKEN);