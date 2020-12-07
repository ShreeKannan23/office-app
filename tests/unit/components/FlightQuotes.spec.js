import { shallowMount } from '@vue/test-utils'
import FlightQuotes from '@/components/FlightQuotes.vue'

describe('FlightQuotes.vue', () => {
  let component = null

  function componentInstance (props) {
    return shallowMount(FlightQuotes, {
      props
    })
  }

  beforeEach(() => {
    component = componentInstance({
      quote: {
        type: 'Cheapest',
        carrierName: 'KLM',
        originCityName: 'Amsterdam',
        destinationCityName: 'Madrid'
      }
    })
  })

  afterAll(() => {
    component.destroy()
  })
  it('check default values', () => {
    expect(component.vm.quote).toMatchObject({
      type: 'Cheapest',
      carrierName: 'KLM',
      originCityName: 'Amsterdam',
      destinationCityName: 'Madrid'
    })
    expect(component).toMatchSnapshot()
  })
})
