const fetch = require("node-fetch");

const BASE_PATH = "https://covid19.mathdro.id/api";

const fetchGloablData = () => fetch(`${BASE_PATH}`).then(res => res.json());
const fetchDataByCountry = country => fetch(`${BASE_PATH}/countries/${country}`).then(res => res.json());
const fetchCountries = () => fetch(`${BASE_PATH}/countries`).then(res => res.json());

module.exports = { fetchGloablData, fetchDataByCountry, fetchCountries };