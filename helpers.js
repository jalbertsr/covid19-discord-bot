const { fetchData, fetchCountries } = require("./apiService");

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

const cleanInput = input => input.toUpperCase().trim()

module.exports = { checkCountry, cleanInput, formatter };