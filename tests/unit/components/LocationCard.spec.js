import { shallowMount } from '@vue/test-utils'
import LocationCard from '@/components/LocationCard.vue'
import { LOCATION_CONFIG } from '@/constants/index'

describe('LocationCard.vue', () => {
  let component = null

  function componentInstance (props) {
    return shallowMount(LocationCard, {
      props,
      global: {
        provide: {
          availableLocations: LOCATION_CONFIG,
          store: {
            getters: {
              getFlightQuotes: {
                AMS: {
                  carrierName: 'LOT',
                  departureDate: '2020-12-07',
                  destinationCityName: 'Amsterdam',
                  originCityName: 'Budapest',
                  price: 146,
                  type: 'Cheapest'
                },
                MAD: {},
                BUD: {}
              }
            }
          }
        }
      }
    })
  }

  beforeEach(() => {
    component = componentInstance({
      selectedDate: ''
    })
  })

  afterAll(() => {
    component.destroy()
  })
  it('check default values', () => {
    expect(component.vm.state).toMatchObject({
      locationDetails: [
        {
          city: 'Amsterdam',
          locationKey: '249758',
          address: 'Simon Carmiggeltstraat 6-50 1011 DJ, NL',
          iataCode: 'AMS',
          flightQuote: {
            carrierName: 'LOT',
            departureDate: '2020-12-07',
            destinationCityName: 'Amsterdam',
            originCityName: 'Budapest',
            price: 146,
            type: 'Cheapest'
          }
        },
        {
          city: 'Madrid',
          locationKey: '308526',
          address: 'c/ Serrano 37, Spain',
          iataCode: 'MAD',
          flightQuote: {}
        },
        {
          city: 'Budapest',
          locationKey: '187423',
          address: 'Kungsbron 16, HN',
          iataCode: 'BUD',
          flightQuote: {}
        }
      ],
      flightQuotes: {
        AMS: {
          carrierName: 'LOT',
          departureDate: '2020-12-07',
          destinationCityName: 'Amsterdam',
          originCityName: 'Budapest',
          price: 146,
          type: 'Cheapest'
        },
        MAD: {},
        BUD: {}
      },
      isSearchBtnClicked: false
    })
  })

  it('check toggleLocation', () => {
    component.vm.toggleLocation(0, true)
    expect(component.vm.state.locationDetails[0].expanded).toBeTruthy()
  })

  it('check emitFlightSearch', async () => {
    component.vm.emitFlightSearch({ iataCode: 'AMS', date: '2020-12-10' })
    await component.vm.$nextTick()
    expect(component.emitted('on-search-flight')).toMatchObject([[{ iataCode: 'AMS', date: '2020-12-10' }]])
  })
  it('check searchFlightByCode', async () => {
    component.vm.searchFlightByCode(new Event('click'), 'AMS')
    await component.vm.$nextTick()
    expect(component.emitted('on-search-flight')).toMatchObject([[{ iataCode: 'AMS', date: '' }]])
  })
  it('check searchFlightByDate', async () => {
    component.vm.searchFlightByDate({ iataCode: 'AMS', date: '2020-12-10' })
    await component.vm.$nextTick()
    expect(component.emitted('on-search-flight')).toMatchObject([[{ iataCode: 'AMS', date: '2020-12-10' }]])
  })
})
