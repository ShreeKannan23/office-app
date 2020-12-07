import { createStore } from 'vuex'

// base state
// flightQuotes holds flight fare details against destination office locations
const baseSate = {
  flightQuotes: {
    AMS: {},
    MAD: {},
    BUD: {}
  }
}

export default createStore({
  state: {
    ...baseSate
  },
  mutations: {
    // save flight quotes once user searches
    flightQuotes (state, payload) {
      state.flightQuotes = {
        ...state.flightQuotes,
        ...payload
      }
    }
  },
  getters: {
    // return flight quotes from store state
    getFlightQuotes: (state) => state.flightQuotes
  }
})
