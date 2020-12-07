import { shallowMount } from '@vue/test-utils'
import Home from '@/views/Home.vue'
import moment from 'moment'

describe('Home.vue', () => {
  let component = null

  function componentInstance () {
    return shallowMount(Home)
  }

  beforeEach(() => {
    component = componentInstance()
  })

  afterAll(() => {
    component.destroy()
  })
  it('check default values', () => {
    expect(component.vm.state).toMatchObject({
      showFlightSearch: false,
      setDestination: '',
      setDepartureDate: moment().format('YYYY-MM-DD')
    })
  })
  it('check component state when searchFlight called with values', () => {
    component.vm.searchFlight({ iataCode: '', date: '' })
    expect(component.vm.state).toMatchObject({
      showFlightSearch: true,
      setDestination: '',
      setDepartureDate: moment().format('YYYY-MM-DD')
    })
    component.vm.searchFlight({ iataCode: 'AMS', date: '2020-12-06' })
    expect(component.vm.state).toMatchObject({
      showFlightSearch: true,
      setDestination: 'AMS',
      setDepartureDate: '2020-12-06'
    })
  })
})
