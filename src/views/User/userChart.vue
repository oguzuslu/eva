<template>
  <div class="container">
    <div class="row justify-content-end mb-3 mt-3">
      <b-form-select
        v-model="selectedDay"
        :options="dayOptions"
        class="day-select"
      ></b-form-select>
    </div>

    <chart :selectedDay="selectedDay" />
  </div>
</template>

<script>
import Chart from "@/components/Chart.vue";

export default {
  components: {
    chart: Chart,
  },
  data() {
    return {
      //////day select////////////
      selectedDay: 30,
      dayOptions: [
        { value: 60, text: "Last 60 Days  " },
        { value: 30, text: "Last 30 Days" },
        { value: 14, text: "Last 14 Days" },
        { value: 7, text: "Last 7 Days" },
      ],

      ////day select end//////////
    };
  },
  watch: {
    selectedDay(val) {
      this.selectedDay = val;
    },
  },

  methods: {
    handler() {
      var args = arguments;
      for (var arg of args) {
        if (arg instanceof Function) {
          arg();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped >
.day-select {
  width: 12%;
  font-size: 1rem;
  border: 1px solid #add8e600 !important;
  border-radius: 5px;
  :hover {
    border: 1px solid #add8e600 !important;
  }
  :focus-visible {
    border: 1px solid #add8e600 !important;
  }
}
</style>