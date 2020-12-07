<template>
  <div class="flight-card px-4 py-4">
    <div class="row mx-auto">
      <h4>Search Flights</h4>
    </div>
    <div class="row my-2 input-search origin p-3 ml-4">
      <input
        type="text"
        name="origin"
        id="origin"
        placeholder="Enter Origin (AMS, JFK, etc)"
        v-model="state.from"
      />
    </div>
    <div class="row my-2 input-search destination p-3 ml-4">
      <input
        type="text"
        name="destination"
        id="destination"
        placeholder="Destination (AMS, MAD, BUD)"
        v-model="state.to"
      />
    </div>
    <div class="row my-2 input-search departure p-3 ml-4">
      <input
        type="date"
        name="departureDate"
        id="depdate"
        placeholder="Departute Date"
        :min="state.minDepartureDate"
        v-model="state.departureDate"
      />
    </div>
    <div class="row mx-auto mt-3">
      <button @click="searchFlightFareDetails">Search</button>
    </div>
    <div class="error row mx-auto mt-2" v-if="state.showError">
      <p>{{ state.errorMsg }}</p>
    </div>
  </div>
</template>

<script>
import { inject, reactive, watchEffect } from 'vue'
import { useStore } from 'vuex'
import moment from 'moment'
import apiService from '../services/index'

function getFareType (quote, cheapestFare) {
  // handler to categorize each quote based price and direct
  if (quote.Direct && quote.MinPrice === cheapestFare) {
    return 'Recommended'
  }
  if (quote.MinPrice === cheapestFare) {
    return 'Cheapest'
  }
  return quote.Direct ? 'Fastest' : 'Normal'
}

const parseFlightQuote = ({
  // parse quotes response
  Carriers,
  Places,
  cheapestFare,
  destination,
  origin
}) => (quote) => ({
  price: quote.MinPrice,
  carrierName: Carriers.find(
    (carrier) => carrier.CarrierId === quote.OutboundLeg.CarrierIds[0]
  ).Name,
  originCityName: Places.find((place) => place.IataCode === origin).CityName,
  destinationCityName: Places.find((place) => place.IataCode === destination)
    .CityName,
  type: getFareType(quote, cheapestFare),
  departureDate: moment(quote.OutboundLeg.DepartureDate).format('YYYY-MM-DD')
})

const isValidDestination = (destinationIataCode, availableLocations) => availableLocations.some(
  (location) => location.iataCode === destinationIataCode
)

export default {
  name: 'FlightSearch',
  props: {
    departureDate: {
      type: String,
      default: moment().format('YYYY-MM-DD')
    },
    destination: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const $store = useStore()
    const state = reactive({
      from: '',
      to: props.destination || 'AMS',
      minDepartureDate: moment().format('YYYY-MM-DD'),
      departureDate: props.departureDate,
      flightQuotesInfo: [],
      showError: false,
      errorMsg: ''
    })
    const availableLocations = inject('availableLocations')

    function showError (msg) {
      state.showError = true
      state.errorMsg = msg
    }

    async function searchFlightFareDetails () {
      // click handler: triggered when search button clicked by the user
      // fires an FLIGHTS API SERVICE to get Flight quotes
      state.showError = false
      if (!isValidDestination(state.to, availableLocations)) {
        showError(
          'Invalid destination entered. Valid values: AMS, BUD, MAD'
        )
        return
      }
      const { from: origin, to: destination, departureDate } = state
      try {
        const {
          data: { Carriers, Quotes, Places }
        } = await apiService.getFlightFares({
          origin,
          destination,
          departureDate
        })
        if (Quotes.length > 0) {
          const cheapestFare = Quotes.reduce(
            (min, q) => (q.MinPrice < min ? q.MinPrice : min),
            Quotes[0].MinPrice
          )
          // parse flight quotes received from API SERVICE
          state.flightQuotesInfo = Quotes.map(
            parseFlightQuote({
              Carriers,
              Places,
              cheapestFare,
              destination,
              origin
            })
          )
        } else {
          state.flightQuotesInfo = []
        }
        const payload = {
          [destination]: state.flightQuotesInfo
        }
        // save quote as entity in store by destination location IATA code key
        $store.commit('flightQuotes', payload)
      } catch (error) {
        showError('Incorrect value(s). Please check and try again!')
      }
    }

    watchEffect(() => {
      // auto populate flight search card based on user selection
      state.to = props.destination
      state.departureDate = props.departureDate
    })
    return {
      state,
      searchFlightFareDetails,
      showError
    }
  }
}
</script>
<style scoped lang="scss">
.flight-card {
  @include blackGradientTheme;
  border-radius: 4px 4px 0 0;
  .input-search {
    position: relative;
    margin-left: 10px;
    input {
      appearance: none;
      height: 40px;
      border: none;
      border-bottom: 2px solid;
      margin-left: 8px;
      width: 70%;
      padding-left: 8px;
      &:focus {
        outline: none;
        border-bottom: 2px solid;
      }
    }
    &::before {
      content: "";
      width: 40px;
      height: 40px;
      position: absolute;
      left: -30px;
      top: 16px;
      background-image: url("../assets/icons/icon_Air_plane.svg");
      background-size: contain;
    }
    &.destination::before {
      transform: rotate(60deg);
    }
    &.departure::before {
      background-image: url("../assets/icons/icon_Calender.svg") !important;
    }
  }
  button {
    appearance: none;
    width: 35%;
    height: 50px;
    border: none;
    border-radius: 6px;
    background: $btn-bg-cyan;
    box-shadow: $base-box-shadow-black;
    &:hover {
      background: $btn-bg-cyan-hover;
    }
  }
  .error {
    color: $error-color-1;
  }
}
</style>
