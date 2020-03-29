const { fetchData, fetchCountries, fetchInfectedByCountry } = require("./apiService");

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

const createLeadboard async () => {
  const { countries: countryList } = await fetchCountries();
  const iso2List = countryList.map(country => { if ("iso2" in country) return fetchInfectedByCountry(country.iso2) });
  const allCountries = await Promise.all(iso2List);
  return allCountries.map(([ country ]) => ({ "country": country.countryRegion, value: country.confirmed}).sort((a, b) => a.value - b.value).slice(0, 9)
};

const formatLeadboard = leadboard => ({
  color: 3447003,
  title: "Leadboard",
  description: "Top 10 countries with more confirmed covid-19 total infected cases.",
  fields: leadboard.map((country, i) => ({ name: `${i}. ${country.name} - ${country.value}`})),
  timestamp: new Date(),
})

const cleanInput = input => input.toUpperCase().trim()

module.exports = { checkCountry, cleanInput, formatter, formatLeadboard, createLeadboard };