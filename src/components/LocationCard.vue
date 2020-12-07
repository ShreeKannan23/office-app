<template>
  <div class="locations p-3">
    <template
      v-for="(
        { city, locationKey, expanded, address, iataCode, flightQuote, departureDate }, index
      ) in state.locationDetails"
      :key="index"
    >
      <div
        class="px-2 py-2 my-2 custom-border"
        @click="toggleLocation(index, !expanded)"
      >
        <div class="row mx-auto">
          <div class="col p-0">
            <h5>{{ city }}</h5>
          </div>
          <div
            class="col-auto accordion-icon align-self-center"
            :class="{ expanded: expanded }"
          >
            <img src="../assets/icons/icon-chevron-down.svg" alt="toggle" />
          </div>
        </div>
        <div class="row mx-auto" v-if="expanded">
          <div class="col-auto p-0 pr-2">
            <div class="location-banner" :class="city"></div>
          </div>
          <div class="col">
            <div class="row mx-auto mb-3">
              <img
                src="../assets/icons/icon_location_pin.svg"
                width="40"
                height="40"
                class="mr-4"
              />
              <p class="m-0 align-self-center">
                {{ address }}
              </p>
            </div>
            <weather-info
            :location-key="locationKey"
            :iata-code="iataCode"
            :selected-date="departureDate"
            @OnSearchFlightByDate="searchFlightByDate"/>
            <div
              class="row mx-auto mt-3 link"
              @click="searchFlightByCode($event, iataCode)"
            >
              <div class="col-auto pl-0 align-self-center">
                <img
                  src="../assets/icons/icon_flight_lookup.svg"
                  width="44"
                  height="44"
                />
              </div>
              <div class="col-auto pl-0 align-self-center">
                <p class="m-0"><u>Check Flights</u></p>
              </div>
              <div class="col-auto pl-0 align-self-center icon chev-right" />
            </div>
            <template v-if="flightQuote && flightQuote.length > 0">
              <div class="py-2 flight-quote mt-2 row mx-auto">
                <template v-for="(quote, index) in flightQuote" :key="index">
                  <flight-quotes :quote="quote" />
                </template>
              </div>
            </template>
            <template v-else-if="state.isSearchBtnClicked && flightQuote.length === 0">
              <p class="my-2 no-info-available">
                No flights available for selected date, Please try different date or origin.
              </p>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import {
  inject, reactive, watchEffect, computed
} from 'vue'
import { useStore } from 'vuex'
import WeatherInfo from './WeatherInfo.vue'
import FlightQuotes from './FlightQuotes.vue'

export default {
  name: 'WeatherCard',
  components: {
    'weather-info': WeatherInfo,
    'flight-quotes': FlightQuotes
  },
  props: {
    selectedDate: {
      type: String,
      default: ''
    }
  },
  setup (props, context) {
    const $store = useStore()
    const state = reactive({
      locationDetails: inject('availableLocations'),
      flightQuotes: computed(() => $store.getters.getFlightQuotes),
      isSearchBtnClicked: false
    })

    watchEffect(() => {
      // listen to location details change and update accordingly
      // will be triggered when user search for an flight fare
      state.locationDetails = state.locationDetails.map((location) => {
        const currentLocation = location
        if (state.flightQuotes[location.iataCode]) {
          currentLocation.flightQuote = state.flightQuotes[location.iataCode]
          if (state.flightQuotes[location.iataCode].length > 0) {
            currentLocation.departureDate = state.flightQuotes[location.iataCode][0].departureDate
            currentLocation.expanded = true
          }
          return {
            ...location,
            ...currentLocation
          }
        }
        return location
      })
    })

    function toggleLocation (index, isExpanded) {
      // click handler: triggred when user clicks checv icon to toggle accordion
      state.locationDetails[index].expanded = isExpanded
    }

    function emitFlightSearch (payload) {
      // emit event to show search flight card
      state.isSearchBtnClicked = true
      context.emit('on-search-flight', payload)
    }

    function searchFlightByCode (e, iataCode) {
      // emit event to show search flight card when user clicks check flights
      e.stopPropagation()
      emitFlightSearch({ iataCode, date: '' })
    }

    function searchFlightByDate ({ date, iataCode }) {
      // event handler when user clicked on of the weather card
      emitFlightSearch({ iataCode, date })
    }

    return {
      toggleLocation,
      emitFlightSearch,
      searchFlightByCode,
      searchFlightByDate,
      state
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin location-img {
  background-size: cover;
  border-radius: 6px;
}
.locations {
  border-radius: 4px;
  background: $grey-shades-gradient;
  box-shadow: $base-box-shadow-black;
  .custom-border {
    border-bottom: 1px solid $black;
    &:last-of-type {
      border-bottom: none;
    }
  }
  .link:hover {
    cursor: pointer;
  }
  .location-banner {
    width: 200px;
    height: 130px;
  }
  .icon {
    width: 16px;
    height: 16px;
    background-size: contain;
    &.chev-right {
      background-image: url("../assets/icons/icon-chevron-down.svg");
      transform: rotate(270deg);
    }
  }
  .Amsterdam {
    background: url("../assets/images/Amsterdam.jpg") no-repeat;
    @include location-img;
  }
  .Madrid {
    background: url("../assets/images/Madrid.jpg") no-repeat;
    @include location-img;
  }
  .Budapest {
    background: url("../assets/images/Budapest.jpg") no-repeat;
    @include location-img;
  }
  .flight-quote {
    border-top: 1px solid #222;
    .quote-card {
      background: $white-smoke;
      box-shadow: $base-box-shadow-black;
      border-radius: 6px;
    }
  }
}
.accordion-icon {
  img {
    width: 16px;
    height: 16px;
    transition: 0.3s ease-in-out;
  }
  &.expanded {
    img {
      transform: rotate(180deg);
    }
  }
}
.no-info-available {
  background: $error-color-2;
  display: inline-block;
  border: 1px solid $error-color-3;
  padding: 8px;
  border-radius: 4px;
}
</style>
