const { fetchData, fetchCountries } = require("./apiService");

const checkCountry = async (country) => {
  const { countries: countryList } = await fetchCountries();
  let isValidCountry = false;
  if (country.length === 2 || country.length === 3) {
    const iso2List = countryList.map(country => country.iso2);
    const iso3List = countryList.map(country => country.iso3);
    isValidCountry = [...iso2List, ...iso3List].filter(iso => iso).includes(country);    
  } else if (country.length >= 4) {
    isValidCountry = countryList.map(country => country.name.toUpperCase()).includes(country);
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