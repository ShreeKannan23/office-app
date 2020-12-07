export const WEATHER_API_KEY = 'vGcRMwvGhW81qHYV3kqzmVyPNOycJyF1'
export const FLIGHT_API_KEY = 'bdf05b506amsh70c49cb9fe034b2p14a539jsn33306f09c234'

export const WEATHER_API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://dataservice.accuweather.com/' : 'http://dataservice.accuweather.com/'
export const FLIGHTS_API_BASE_URL = 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/'

// Base location configuration
export const LOCATION_CONFIG = [{
  city: 'Amsterdam',
  locationKey: '249758',
  address: 'Simon Carmiggeltstraat 6-50 1011 DJ, NL',
  iataCode: 'AMS'
},
{
  city: 'Madrid',
  locationKey: '308526',
  address: 'c/ Serrano 37, Spain',
  iataCode: 'MAD'

},
{
  city: 'Budapest',
  locationKey: '187423',
  address: 'Kungsbron 16, HN',
  iataCode: 'BUD'

}]

// Accuweather API weather icon mapping
export const WEATHER_ICON_IDS = [{
  weatherIconsIds: [1, 2, 3, 30],
  icon: 1
},
{
  weatherIconsIds: [4, 5, 6, 7, 8],
  icon: 7
},
{
  weatherIconsIds: [12, 13, 14],
  icon: 12
},
{
  weatherIconsIds: [15, 16, 17],
  icon: 15
},
{
  weatherIconsIds: [18, 19, 20, 21],
  icon: 18
},
{
  weatherIconsIds: [22, 23, 24, 25, 26, 29],
  icon: 22
},
{
  weatherIconsIds: [31],
  icon: 31
},
{
  weatherIconsIds: [11],
  icon: 11
}]
