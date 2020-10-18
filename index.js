require("dotenv").config();
const fse = require('fs-extra');
const Discord = require("discord.js");
const levenshtein = require("js-levenshtein");
const CronJob = require("cron").CronJob;

const { downloadImage } = require("./apiService");
const processCommand = require("./commands");

const { BOT_TOKEN, CHANNEL_ID } = process.env

const client = new Discord.Client();

const job = new CronJob("0 0 0 * * 6", async () => {
  const channel = client.channels.cache.get(CHANNEL_ID);
  const unixTimeAsHash = +new Date();
  await downloadImage(unixTimeAsHash);
  const imagePath = `./images/global_graphic_${unixTimeAsHash}.png`;
  const attachment = new Discord.MessageAttachment(imagePath);
  channel.send(attachment);
  console.log("Cron job executed at:", new Date())
});

const cleanJob = new CronJob("0 0 0 1 * *", async () => {
  try {
    await fse.emptyDir("./images");
    console.log("Clean job executed with success.");
  } catch (err) {
    console.error("Clean job failed with error", err);
  }
});

client.on('ready', () => {
  console.log('I am ready!');
  console.log('Cron job starting...')
  job.start();
  cleanJob.start();
});

client.on("message", async (receivedMessage) => {
  const msg = receivedMessage.content;
  const [ firstArg ] = msg.split(" ");
  const mainCommand = "!covid";
  if (levenshtein(firstArg, mainCommand) <= 2 && firstArg !== mainCommand) {
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
