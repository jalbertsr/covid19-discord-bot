const { fetchData, fetchCountries, fetchDataByCountry } = require("./apiService");

const checkCountry = async (inputCountry) => {
  const { countries: countryList } = await fetchCountries();
  let isValidCountry = false;
  if (inputCountry.length === 2 || inputCountry.length === 3) {
    const iso2List = countryList.map(country => country.iso2);
    const iso3List = countryList.map(country => country.iso3);
    isValidCountry = [...iso2List, ...iso3List].filter(iso => iso).includes(inputCountry);    
  } else if (inputCountry.length >= 4) {
    isValidCountry = countryList.map(country => cleanInput(country.name)).includes(inputCountry);
  } else {
    isValidCountry = false;
  }
  return isValidCountry;
};

const formatter = (data, country) =>
  `COVID-19 - ${country}
- Infected: ${data.confirmed.value}
- Recovered: ${data.recovered.value}
- Deaths: ${data.deaths.value}`;

const createLeadboard = async () => {
  const { countries: countryList } = await fetchCountries();
  const iso2List = await countryList.map(async (country) => { if ("iso2" in country) return await fetchDataByCountry(country.iso2, true) });
  const allCountries = await Promise.all(iso2List);
  return allCountries.filter(i => Boolean(i)).map(country => {
    if (country.name && country.response) {
      const { confirmed, recovered, deaths } = country.response;
      if (confirmed && recovered && deaths) {
        return ({ name: country.name, confirmed: confirmed.value, recovered: recovered.value, deaths: deaths.value })
      }
    }
  }).filter(country => country).filter(country => country.name && country.confirmed).sort((a, b) => b.confirmed - a.confirmed).slice(0, 10);
};

const formatLeadboard = leadboard => ({
  color: 3447003,
  title: "Leadboard",
  description: "Top 10 countries with more confirmed covid-19 total infected cases.",
  fields: leadboard.map((country, i) => ({ 
    name: `**__${i+1}. ${country.name}__**`, 
    value: `Infected: ${country.confirmed} - Recovered: ${country.recovered} - Deaths: ${country.deaths}`
  })),
  timestamp: new Date(),
})

const cleanInput = input => input.toUpperCase().trim()

module.exports = { checkCountry, cleanInput, formatter, formatLeadboard, createLeadboard };