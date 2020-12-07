<template>
  <div class="home text-left pb-5">
    <header class="px-5 pt-3 pb-1 header-section">
      <div class="row mx-auto">
        <div class="col-avatar">
          <img src="../assets/icons/icon-Office.svg" alt="office-icon" width="50" height="50">
        </div>
        <div class="col align-self-center">
          <h3>Office Explorer</h3>
          <h6>Explore our offices from your desk</h6>
        </div>
      </div>
    </header>
    <div class="px-5 mt-5">
      <div class="row mx-auto">
        <h4>Our Work Locations</h4>
      </div>
    <div class="content row justify-content-between">
      <div class="col-8">
        <location-card @onSearchFlight="searchFlight" :selected-date="state.setDepartureDate"/>
      </div>
      <div class="col-4 flight-search" :class="state.showFlightSearch ? 'slideIn' : 'slideOut'">
        <flight-search :destination="state.setDestination" :departureDate="state.setDepartureDate"/>
      </div>
    </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  .header-section {
    background: $header-bg-black;
    box-shadow: 0 5px 10px rgba(36,50,56,.25);
    color:$white;
  }
  .flight-search {
    position: fixed;
    right: 2%;
    transition: $transition-slide;
    &.slideIn {
      transform: translate3d(0,0,0);
      transition: $transition-slide;
    }
    &.slideOut {
      transform: translate3d(500%,0,0);
    }
  }
}
</style>

<script>
import { provide, reactive } from 'vue'
import moment from 'moment'
import LocationCard from '../components/LocationCard.vue'
import { LOCATION_CONFIG, WEATHER_ICON_IDS } from '../constants/index'
import FlightSearch from '../components/FlightSearch.vue'

export default {
  components: {
    'location-card': LocationCard,
    'flight-search': FlightSearch
  },
  setup () {
    const defaultLocation = 0
    const getLocationOptions = LOCATION_CONFIG.map((config, i) => ({
      ...config,
      expanded: i === defaultLocation
    }))
    const state = reactive({
      showFlightSearch: false,
      setDestination: '',
      setDepartureDate: moment().format('YYYY-MM-DD')
    })

    // make base location options and weather icon list available to child components
    provide('availableLocations', getLocationOptions)
    provide('weatherIconsIds', WEATHER_ICON_IDS)

    function searchFlight ({ iataCode, date }) {
      // method will be triggred when user clicks weather card or check flight
      // show flight search card
      // set destination and date only if it has a value
      state.showFlightSearch = true
      if (iataCode) {
        state.setDestination = iataCode
      }
      if (date) {
        state.setDepartureDate = moment(date).format('YYYY-MM-DD')
      }
    }
    return {
      state,
      searchFlight
    }
  }
}

</script>
