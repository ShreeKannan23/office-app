import { shallowMount } from '@vue/test-utils'
import FlightSearch from '@/components/FlightSearch.vue'
import { LOCATION_CONFIG } from '@/constants/index'
import moment from 'moment'
import apiService from '@/services/index'

describe('FlightSearch.vue', () => {
  let component = null

  jest.mock('@/services/index.js', () => ({
    getFlightFares: () => new Promise((res) => res({
      data: {
        Quotes: [{
          QuoteId: 1,
          MinPrice: 286,
          Direct: true,
          OutboundLeg: {
            CarrierIds: [1324],
            OriginId: 43268,
            DestinationId: 40595,
            DepartureDate: '2020-12-08T00:00:00'
          },
          QuoteDateTime: '2020-12-06T23:32:00'
        }],
        Carriers: [{
          CarrierId: 1324,
          Name: 'KLM'
        }],
        Places: [{
          Name: 'Amsterdam',
          Type: 'Station',
          PlaceId: 40595,
          IataCode: 'AMS',
          SkyscannerCode: 'AMS',
          CityName: 'Amsterdam',
          CityId: 'AMST',
          CountryName: 'Netherlands'
        }, {
          Name: 'Budapest',
          Type: 'Station',
          PlaceId: 43268,
          IataCode: 'BUD',
          SkyscannerCode: 'BUD',
          CityName: 'Budapest',
          CityId: 'BUDA',
          CountryName: 'Hungary'
        }],
        Currencies: [{
          Code: 'EUR',
          Symbol: '€',
          ThousandsSeparator: '.',
          DecimalSeparator: ',',
          SymbolOnLeft: false,
          SpaceBetweenAmountAndSymbol: true,
          RoundingCoefficient: 0,
          DecimalDigits: 2
        }],
        Dates: {
          OutboundDates: [{
            PartialDate: '2020-12-08',
            Price: 286,
            QuoteDateTime: '2020-12-06T23:32:00',
            QuoteIds: [1]
          }]
        }
      }
    }))
  }))

  function componentInstance (props) {
    return shallowMount(FlightSearch, {
      props,
      global: {
        provide: {
          availableLocations: LOCATION_CONFIG,
          store: {}
        }
      }
    })
  }

  beforeEach(() => {
    component = componentInstance({
      departureDate: moment().format('YYYY-MM-DD'),
      destination: ''
    })
  })

  afterAll(() => {
    component.destroy()
  })
  it('check default values', () => {
    expect(component.vm.state).toMatchObject({
      from: '',
      to: '',
      minDepartureDate: moment().format('YYYY-MM-DD'),
      departureDate: moment().format('YYYY-MM-DD'),
      flightQuotesInfo: [],
      showError: false,
      errorMsg: ''
    })
  })
  it('check showError method', () => {
    component.vm.showError('error')
    expect(component.vm.state.showError).toBeTruthy()
    expect(component.vm.state.errorMsg).toBe('error')
  })

  it('check searchFlightFareDetails error case', () => {
    component.vm.state.to = 'JFK'
    component.vm.searchFlightFareDetails()
    expect(component.vm.state.showError).toBeTruthy()
    expect(component.vm.state.errorMsg).toBe('Invalid destination entered. Valid values: AMS, BUD, MAD')
  })
  it('check searchFlightFareDetails', async () => {
    const spy = jest.spyOn(apiService, 'getFlightFares')
    component.vm.state.to = 'AMS'
    component.vm.state.From = 'BUD'
    component.vm.state.departureDate = '2020-12-10'
    component.vm.searchFlightFareDetails()
    await component.vm.$nextTick()
    expect(spy).toHaveBeenCalled()
  })
})
