import { shallowMount } from '@vue/test-utils'
import WeatherInfo from '@/components/WeatherInfo.vue'
import { WEATHER_ICON_IDS } from '@/constants/index'

describe('WeatherInfo.vue', () => {
  let component = null

  function componentInstance (props) {
    return shallowMount(WeatherInfo, {
      props,
      global: {
        provide: {
          weatherIconsIds: WEATHER_ICON_IDS
        }
      }
    })
  }

  beforeEach(() => {
    component = componentInstance({
      locationKey: '249758',
      iataCode: 'AMS',
      selectedDate: ''
    })
  })

  afterAll(() => {
    component.destroy()
  })
  it('check default values', () => {
    expect(component.vm.state).toMatchObject({
      dailyWeather: [],
      activeDate: 0,
      selectedDate: ''
    })
  })
  it('check searchFlightByDate', async () => {
    component.vm.searchFlightByDate(new Event('click'), 'Dec 5', 0)
    await component.vm.$nextTick()
    expect(component.emitted('on-search-flight-by-date')).toMatchObject([[{ date: '2020-12-05', iataCode: 'AMS' }]])
  })
})
