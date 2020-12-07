import axios from 'axios'
import {
  FLIGHTS_API_BASE_URL, FLIGHT_API_KEY, WEATHER_API_BASE_URL, WEATHER_API_KEY
} from '../constants/index'

const apiService = {
  getNext5DaysWeatherCondition (locationKey) {
    return axios.get(`${WEATHER_API_BASE_URL}forecasts/v1/daily/5day/${locationKey}?apikey=${WEATHER_API_KEY}&metric=true`)
  },
  getFlightFares ({ origin, destination, departureDate }) {
    const url = `${FLIGHTS_API_BASE_URL}apiservices/browsedates/v1.0/NL/EUR/en-US/${origin}-sky/${destination}-sky/${departureDate}`
    return axios.get(url, {
      headers: {
        'x-rapidapi-key': FLIGHT_API_KEY,
        'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
      }
    })
  }
}

export { apiService as default }
