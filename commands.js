const Discord = require("discord.js");
const { fetchDataByCountry, fetchGloablData, downloadImage } = require("./apiService");
const { checkCountry, formatter, imageConverterPath } = require("./helpers");

const processCommand = async (receivedMessage) => {
  const splitCommand = receivedMessage.content.split(" ");
  const [ primaryCommand, argument ] = splitCommand;

  if (argument.toLowerCase() === "help") {
    helpMsg(receivedMessage);
  } else if (argument.toLowerCase() === "global") {
    const data = await fetchGloablData();
    const unixTimeAsHash = +new Date()
    await downloadImage(unixTimeAsHash);
    gloablMsg(receivedMessage, data, unixTimeAsHash);
  } else {
    const country = argument.toUpperCase();
    const isValidCountry = await checkCountry(country);
    if (isValidCountry) {
      const data = await fetchDataByCountry(country);
      const textToSend = formatter(data, country);
      receivedMessage.channel.send(textToSend);
    } else {
      invalidCountryMsg(receivedMessage);
    }
  }
}

const helpMsg = receivedMessage => receivedMessage.channel.send("Use command like `!covid <country>`. Example `!covid USA`.")
const invalidCountryMsg = receivedMessage => receivedMessage.channel.send("This country dosen't exist or in not on our database ヾ( ･`⌓´･)ﾉﾞ");
const gloablMsg = (receivedMessage, data, unixTimeAsHash) => {
  const textToSend = formatter(data, "Global");
  const imagePath = `./images/global_graphic_${unixTimeAsHash}.png`
  const attachment = new Discord.MessageAttachment(imagePath);
  receivedMessage.channel.send(textToSend, attachment);
}

module.exports = processCommand;