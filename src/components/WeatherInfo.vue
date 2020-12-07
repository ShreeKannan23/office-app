<template>
  <div class="weather-card">
    <div class="row mx-auto">
      <div class="col-auto pl-0 align-self-center">
        <img src="../assets/icons/icon_sunny.svg" width="44" height="44" />
      </div>
      <template
        v-for="(
          { temperature, dayPhrase, date, icon }, index
        ) in state.dailyWeather"
        :key="index"
      >
        <div
          class="col-auto weather mr-1 py-2 pl-3 pr-0"
          @click="searchFlightByDate($event, date, index)"
          :class="index === state.activeDate ? 'activeDate' : ''"
        >
          <div class="row mx-auto text-center">
            <p class="m-0">{{ date }}</p>
          </div>
          <div class="row mx-auto justify-content-between">
            <div class="col-auto pl-0 align-self-center">
              <img
                :src="require(`../assets/icons/icon_weather_${icon}.svg`)"
                :alt="dayPhrase"
              />
            </div>
            <div class="col-auto pl-0 align-self-end">
              <div class="temperature">
                <p class="m-0">{{ temperature.max }}&deg;<small>C</small></p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {
  inject, reactive, watchEffect, watch
} from 'vue'
import moment from 'moment'
import apiService from '../services/index'

let weatherIcons = []

function getTemeratureValues (temperature) {
  // parse temperature values
  const { Maximum, Minimum } = temperature
  return {
    max: Maximum && Maximum.Value ? Math.floor(Maximum.Value) : 'N/A',
    min: Minimum && Minimum.Value ? Math.floor(Minimum.Value) : 'N/A'
  }
}

function getIcon (iconId) {
  // get appropriate weather icons
  // map icons from icon constants
  return weatherIcons.find(({ weatherIconsIds }) => weatherIconsIds.some((id) => id === iconId)).icon
}

function weatherInfoByLocationkey (locationKey) {
  // fetch next 5 days weather from server
  return apiService.getNext5DaysWeatherCondition(locationKey)
}

function serialiseWeatherInfo ({ Date, Temperature, Day }) {
  // parse weather information
  return {
    date: moment(Date).format('MMM D'),
    temperature: getTemeratureValues(Temperature),
    icon: getIcon(Day.Icon)
  }
}

function findSelectedDateIndex (dailyWeather, selectedDate) {
  // find selected date index from response to update weather card
  const selectedDay = moment(selectedDate).format('MMM D')
  return dailyWeather.findIndex((weather) => weather.date === selectedDay)
}

async function loadWeatherInfo (locationKey) {
  // fetch next 5 days weather using API service by passing unique location key
  const {
    data: { DailyForecasts }
  } = await weatherInfoByLocationkey(locationKey)
  return DailyForecasts.map(serialiseWeatherInfo)
}

export default {
  props: {
    locationKey: {
      type: String,
      required: true
    },
    iataCode: {
      type: String,
      required: true
    },
    selectedDate: {
      type: String,
      default: ''
    }
  },
  setup (props, context) {
    weatherIcons = inject('weatherIconsIds')
    const state = reactive({
      dailyWeather: [],
      activeDate: 0,
      selectedDate: props.selectedDate
    })
    watchEffect(async () => {
      // fetch next 5 days weather using API service by passing unique location key
      state.dailyWeather = await loadWeatherInfo(props.locationKey)
      state.activeDate = findSelectedDateIndex(
        state.dailyWeather,
        props.selectedDate
      )
    })

    watch(
      () => props.selectedDate,
      () => {
        // update selected weather date based on user flight search
        state.activeDate = findSelectedDateIndex(
          state.dailyWeather,
          props.selectedDate
        )
      }
    )

    function searchFlightByDate (e, date, index) {
      // click handler: when user click on weather card, display flight search with selected date
      e.stopPropagation()
      state.activeDate = index
      context.emit('on-search-flight-by-date', {
        date: moment(date, 'MMM D').format('YYYY-MM-DD'),
        iataCode: props.iataCode
      })
    }
    return {
      state,
      searchFlightByDate
    }
  }
}
</script>

<style lang="scss" scoped>
.weather {
  @include blackGradientTheme;
  @include pointer;
  border-radius: 4px;
  img {
    width: 30px;
    height: 30px;
  }
  &.activeDate {
    background: $grey-gradient;
  }
}
</style>
