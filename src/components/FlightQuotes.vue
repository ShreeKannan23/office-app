<template>
  <div class="col-auto quote-card px-3 pt-3 pb-0 mr-3">
    <div class="row mx-auto quote-type mb-2">
      <p class="m-0">{{ quote.type }}</p>
    </div>
    <div class="row mx-auto py-1">
      <p class="col-5 pl-0 m-0">Operator :</p>
      <p class="col pl-0 m-0">
        {{ quote.carrierName }}
      </p>
    </div>
    <div class="row mx-auto py-1">
      <p class="col-5 pl-0 m-0">Price :</p>
      <p class="col pl-0 m-0">{{ quote.price }}&euro;</p>
    </div>
    <div class="row mx-auto mt-2">
      <p>{{ quote.originCityName }}</p>
      &nbsp;-------<img
        src="../assets/icons/icon_flight_lookup.svg"
        width="24"
        height="24"
      />-------&nbsp;
      <p>{{ quote.destinationCityName }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlightQuotes',
  props: {
    quote: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.quote-type {
  font-size: 21px;
  font-weight: 500;
  line-height: 21px;
}
</style>
