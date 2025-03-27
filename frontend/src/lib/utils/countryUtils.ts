// Map of country names to their API-friendly versions
export const COUNTRY_NAME_MAP: Record<string, string> = {
  "United States": "USA",
  "United States of America": "USA",
  USA: "USA",
  "United Kingdom": "UK",
  "United Kingdom of Great Britain and Northern Ireland": "UK",
  "Great Britain": "UK",
  "Czech Republic": "Czechia",
  "Republic of the Congo": "Congo",
  "Democratic Republic of the Congo": "DR Congo",
  "Republic of Korea": "South Korea",
  "Democratic People's Republic of Korea": "North Korea",
  "Islamic Republic of Iran": "Iran",
  "Syrian Arab Republic": "Syria",
  "Lao People's Democratic Republic": "Laos",
  "Kingdom of Eswatini": "Eswatini",
  "Republic of Moldova": "Moldova",
  "Brunei Darussalam": "Brunei",
  "Republic of the Union of Myanmar": "Myanmar",
  "Timor-Leste": "East Timor",
  "Republic of Côte d'Ivoire": "Ivory Coast",
  "Republic of Cabo Verde": "Cape Verde",
  "Republic of the Niger": "Niger",
  "Republic of the Sudan": "Sudan",
  "Republic of South Sudan": "South Sudan",
  "Republic of Cameroon": "Cameroon",
  "Republic of Chad": "Chad",
  "Republic of Mali": "Mali",
  "Republic of Senegal": "Senegal",
  "Republic of Guinea": "Guinea",
  "Republic of Benin": "Benin",
  "Republic of Togo": "Togo",
  "Republic of Ghana": "Ghana",
  "Republic of Liberia": "Liberia",
  "Republic of Sierra Leone": "Sierra Leone",
  "Republic of Guinea-Bissau": "Guinea-Bissau",
  "Republic of Gambia": "Gambia",
  "Republic of Namibia": "Namibia",
  "Republic of Botswana": "Botswana",
  "Republic of Zimbabwe": "Zimbabwe",
  "Republic of Mozambique": "Mozambique",
  "Republic of Malawi": "Malawi",
  "Republic of Zambia": "Zambia",
  "Republic of Angola": "Angola",
  "Republic of Burundi": "Burundi",
  "Republic of Rwanda": "Rwanda",
  "Republic of Uganda": "Uganda",
  "Republic of Kenya": "Kenya",
  "Republic of Tanzania": "Tanzania",
  "Republic of Seychelles": "Seychelles",
  "Republic of Mauritius": "Mauritius",
  "Republic of Madagascar": "Madagascar",
  "Republic of Comoros": "Comoros",
  "Republic of Djibouti": "Djibouti",
  "Republic of Somalia": "Somalia",
  "Republic of Ethiopia": "Ethiopia",
  "Republic of Eritrea": "Eritrea",
  "Republic of Central African Republic": "Central African Republic",
  "Republic of Equatorial Guinea": "Equatorial Guinea",
  "Republic of Gabon": "Gabon",
};

export const getApiFriendlyCountryName = (countryName: string): string => {
  // First try exact match
  if (COUNTRY_NAME_MAP[countryName]) {
    return COUNTRY_NAME_MAP[countryName];
  }

  // Then try case-insensitive match
  const normalizedInput = countryName.toLowerCase();
  const match = Object.entries(COUNTRY_NAME_MAP).find(
    ([key]) => key.toLowerCase() === normalizedInput
  );

  return match ? match[1] : countryName;
};
