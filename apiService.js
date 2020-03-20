const fs = require("fs");
const fetch = require("node-fetch");

const BASE_PATH = "https://covid19.mathdro.id/api";

const fetchGloablData = () => fetch(`${BASE_PATH}`).then(res => res.json());
const fetchDataByCountry = country => fetch(`${BASE_PATH}/countries/${country}`).then(res => res.json());
const fetchCountries = () => fetch(`${BASE_PATH}/countries`).then(res => res.json());
const downloadImage = hash => fetch(`${BASE_PATH}/og`)
  .then(async (res) => {
    const imageName = `global_graphic_${hash}.png`
    const fileStream = fs.createWriteStream(`./images/${imageName}`);
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", err => {
        reject(err);
      });
      fileStream.on("finish", () => {
        resolve();
      });
    });
  });

module.exports = { fetchGloablData, fetchDataByCountry, fetchCountries, downloadImage };