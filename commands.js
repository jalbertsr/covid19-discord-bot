const { fetchDataByCountry } = require("./apiService");
const { checkCountry, formatter } = require("./helpers");

const processCommand = async (receivedMessage) => {
  const splitCommand = receivedMessage.content.split(" ");
  const [ primaryCommand, argument ] = splitCommand;

  if (argument === "help") {
    helpMsg(receivedMessage);
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

module.exports = processCommand;