const { fetchData, fetchCountries } = require("./apiService");

const checkCountry = async (country) => {
  const countries = await fetchCountries();
  let isValidCountry = false;
  if (country.length === 2 || country.length === 3) {
    const iso = countries["iso3"]
    const iso2 = Object.keys(iso);
    const iso3 = Object.values(iso);
    isValidCountry = [...iso2, ...iso3].map(country => country.toUpperCase()).includes(country); 
  } else if (country.length >= 4) {
    const countryList = Object.keys(countries["countries"]);
    isValidCountry = countryList.map(country => country.toUpperCase()).includes(country)
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


module.exports = { checkCountry, formatter };