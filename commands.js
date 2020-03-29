const Discord = require("discord.js");
const { fetchDataByCountry, fetchGloablData, downloadImage } = require("./apiService");
const { checkCountry, formatter, cleanInput, createLeadboard, formatLeadboard } = require("./helpers");

const processCommand = async (receivedMessage) => {
  const [, ...argument] = receivedMessage.content.split(" ");
  const cleanArg = argument.length === 1 ? argument.join("") : argument.join(" ")
  if (cleanArg === "help") {
    helpMsg(receivedMessage);
  } else if (cleanArg === "global") {
    const data = await fetchGloablData();
    const unixTimeAsHash = +new Date()
    await downloadImage(unixTimeAsHash);
    gloablMsg(receivedMessage, data, unixTimeAsHash);
  } else if (cleanArg === "leadboard") {
    const leadboard = await createLeadboard();
    const formattedLeadboard = formatLeadboard(leadboard);
    leadboardMsg(receivedMessage, formattedLeadboard);
  } else {
    const country = cleanInput(cleanArg);
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

const leadboardMsg = (receivedMessage, formattedLeadboard) => receivedMessage.channel.send({ embed: formattedLeadboard });
const helpMsg = receivedMessage => receivedMessage.channel.send("Use command like `!covid <country>`. Example `!covid USA`.");
const invalidCountryMsg = receivedMessage => receivedMessage.channel.send("This country dosen't exist or in not on our database ヾ( ･`⌓´･)ﾉﾞ");
const gloablMsg = (receivedMessage, data, unixTimeAsHash) => {
  const textToSend = formatter(data, "Global");
  const imagePath = `./images/global_graphic_${unixTimeAsHash}.png`
  const attachment = new Discord.MessageAttachment(imagePath);
  receivedMessage.channel.send(textToSend, attachment);
}

module.exports = processCommand;