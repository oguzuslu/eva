<template>
  <div class="container">
    <div class="row justify-content-end mb-3 mt-3">
      <b-form-select
        v-model="selectedDay"
        :options="dayOptions"
        style="width: 11%; border: 1px solid lightblue; border-radius: 5px"
      ></b-form-select>
    </div>
    <div></div>
    <div class="row">
      <b-spinner
        variant="primary"
        v-if="!userChartData"
        class="m-auto"
      ></b-spinner>
      <!-- {{ selectedBarsData }}
      {{ selectedBarsData.length }} -->

      <div
        tabindex="0"
        @keydown.ctrl="handleKeyDown"
        @keyup.ctrl="handleKeyUp"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        <VueApexCharts
          v-if="userChartData"
          ref="chart"
          type="bar"
          :options="options"
          :series="series"
          height="350"
          @click="handleBarClick"
          v-bind:class="{ clickable: ctrlKeyActive }"
        />

        <!-- <b-table striped hover :items="selectedBarsData" :fields="fields">
          <template slot="label" slot-scope="row">
            {{ row.item.label }}
          </template>
          <template slot="value" slot-scope="row">
            {{ row.item.value }}
          </template>
        </b-table> -->
      </div>
    </div>
    <div class="row" v-if="!isLoading">
      <b-table
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filter-included-fields="filterOn"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        stacked="md"
        show-empty
        small
        @filtered="onFiltered"
      >
        <template #cell(name)="row">
          {{ row.value.first }} {{ row.value.last }}
        </template>

        <!-- <template #cell(actions)="row">
        <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
          Info modal
        </b-button>
        <b-button size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
        </b-button>
      </template> -->

        <template #row-details="row">
          <b-card>
            <ul>
              <li v-for="(value, key) in row.item" :key="key">
                {{ key }}: {{ value }}
              </li>
            </ul>
          </b-card>
        </template>
      </b-table>
    </div>
    <b-row>
      <div>
        <b-pagination
          v-if="!isLoading"
          class="float-end"
          pills
          limit="1"
          :last-number="false"
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          :hide-goto-end-buttons="true"
        ></b-pagination>
      </div>
    </b-row>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { BTable } from "bootstrap-vue";
import { mapGetters } from "vuex";
export default {
  components: {
    VueApexCharts,
    BTable,
  },

  data() {
    return {
      //////table values////////

      isLoading: true,
      rows: 100,

      items: [
        {
          isActive: true,
          age: 40,
          name: { first: "Dickerson", last: "Macdonald" },
        },
        { isActive: false, age: 21, name: { first: "Larsen", last: "Shaw" } },
        {
          isActive: false,
          age: 9,
          name: { first: "Mini", last: "Navarro" },
          _rowVariant: "success",
        },
        { isActive: false, age: 89, name: { first: "Geneva", last: "Wilson" } },
        { isActive: true, age: 38, name: { first: "Jami", last: "Carney" } },
        { isActive: false, age: 27, name: { first: "Essie", last: "Dunlap" } },
        { isActive: true, age: 40, name: { first: "Thor", last: "Macdonald" } },
        {
          isActive: true,
          age: 87,
          name: { first: "Larsen", last: "Shaw" },
          _cellVariants: { age: "danger", isActive: "warning" },
        },
        { isActive: false, age: 26, name: { first: "Mitzi", last: "Navarro" } },
        {
          isActive: false,
          age: 22,
          name: { first: "Genevieve", last: "Wilson" },
        },
        { isActive: true, age: 38, name: { first: "John", last: "Carney" } },
        { isActive: false, age: 29, name: { first: "Dick", last: "Dunlap" } },
      ],
      // fields: [
      //   { key: 'sku.sku', label: 'SKU', sortable: true, sortDirection: 'desc' },
      //  { key: 'sku.productName', label: 'Product Name', sortable: true, class: 'text-center' },
      //  { key: 'sku.amount',  label: 'this.perPage', sortable: true, sortDirection: 'desc' },

      //   // { key: 'actions', label: 'Actions' }
      // ],
      totalRows: 1,
      currentPage: 1,
      perPage: 30,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],

      ////////table values end////////

      //////day select////////////
      selectedDay: 30,
      dayOptions: [
        { value: 60, text: "Last 60 Days  " },
        { value: 30, text: "Last 30 Days" },
        { value: 14, text: "Last 14 Days" },
        { value: 7, text: "Last 7 Days" },
      ],

      ////day select end//////////

      ////////////chart values//////////
      selectedBarsData: [],
      ctrlKeyActive: false,

      series: [
        {
          name: "Profit",
          data: [44, 55, 41, 67, 22, 43],
        },
        {
          name: "FBA Sales",
          data: [13, 23, 20, 8, 13, 27],
        },
        {
          name: "FBM Sales",
          data: [13, 23, 20, 8, 13, 27],
        },
       
      ],

      options: {
        colors: ["#71ECC5", "#7F85E9", "#5D33EB"],
        plotOptions: {
          bar: {
            selectedColors: ["#CCCCCC", "#CCCCCC"], // İki seçilen çubuğun rengi (gri)
          },
        },

        chart: {
          
          events: {
            // updateOptions: function(event, chartContext, config) {
            //   console.log(config.w.config.xaxis.categories[config.dataPointIndex]);
            //   console.log(config.w.config.series[0].data[config.dataPointIndex]);
            // },
            //   dataPointSelection: function(event, chartContext, config) {
            //  console.log(config.w.config.xaxis.categories[config.dataPointIndex]);
            //       console.log(config.w.config.series[0].data[config.dataPointIndex]);
            //   },
          },
          //       events: {

          // // dataPointSelection: (event, chartContext, config) => {
          // //   console.log('bar data',chartContext);
          // // }

          //           },
          //     events: {
          // dataPointSelection: function (event, chartContext, config) {
          // setTimeout(() => {
          //   console.log(this.options.xaxis.categories[0],event,chartContext);
          //   console.log(this.selectedBarsData);
          // }, 200);

          // },
          // },
          states: {
            normal: {
              filter: {
                type: "none",
                value: 0,
              },
            },
            hover: {
              filter: {
                type: "lighten",
                value: 0.15,
              },
            },
            active: {
              allowMultipleDataPointsSelection: true,
              filter: {
                type: "darken",
                value: 0.35,
              },
            },
          },

          multipleXaxis: true,
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: true,
          },

          zoom: {
            enabled: false,
          },
        },
        tooltip: {
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
    var tooltipContent = '<ul>';
    w.config.series.forEach((seriesData, index) => {
      var data = seriesData.data[dataPointIndex];
      var color =  seriesData.data[dataPointIndex].color;
      tooltipContent += '<li style="color:' + color + '"><b>' + seriesData.name + '</b>: ' + data + '</li>';
    });
    tooltipContent += '</ul>';
    return tooltipContent;
  }
  },
        plotOptions: {
          bar: {
            dataLabels: {
              total: {
                enabled: false,
              },
              
              orientation: "vertical",
              position: "center", // bottom/center/top
            },
          },
        },
        
        dataLabels: {
          enabled: true,

          style: {
            colors: ["#fff"],
          },
          offsetY: 20, // play with this value
        },

        xaxis: {
          type: "days",
          categories: [
            "01/01/2011 GMT",
            "01/02/2011 GMT",
            "01/03/2011 GMT",
            "01/04/2011 GMT",
            "01/05/2011 GMT",
            "01/06/2011 GMT",
          ],
        },

        legend: {
          position: "bottom",
          offsetY: 10,
        },
        fill: {
          opacity: 2,
        },
      },
      //////////chart values end//////////
    };
  },
  computed: {
    ...mapGetters({
      userData: "User/userData",
      userChartData: "User/userChartData",
      userTableData: "User/userTableData",
    }),
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
    fields() {
      return [
        { key: "sku.sku", label: "SKU", sortable: true },
        {
          key: "sku.productName",
          label: "Product Name",
          sortable: true,
          class: "text-center",
        },
        { key: "sku.amount", label: this.getColLabel(), sortable: true },
        { key: "sku.amount", label: this.getColLabel(), sortable: true },
        { key: "refundRate", label: "Refund Rate", sortable: true },

        // { key: 'actions', label: 'Actions' }
      ];
    },
    //     amountLabel() {
    //   return this.userTableData.tableData.selectedDate;
    // }
  },
  created() {
    this.$store.dispatch("User/getChartData", { day: this.selectedDay });
    this.options.xaxis.categories = this.userChartData.map((date) => {
      return date.date;
    });

    this.series[0].data = Object.values(this.userChartData).map(
      (item) => item.profit
    );
    this.series[1].data = Object.values(this.userChartData).map(
      (item) => item.fbaAmount
    );
    this.series[2].data = Object.values(this.userChartData).map(
      (item) => item.fbmAmount
    );

    console.log("cchh", this.options.xaxis.categories);
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
    // this.items= this.userTableData.refundRate
  },
  watch: {
    currentPage(val) {
      this.currentPage = val;
      alert(val);
      if (this.selectedBarsData.length == 1) {
        // alert("1tane");
        this.tableData(this.selectedBarsData[0], "", 0, this.currentPage);
      } else if (this.selectedBarsData.length == 2) {
        // alert("2tane");
        this.tableData(
          this.selectedBarsData[0],
          this.selectedBarsData[1],
          1,
          this.currentPage
        );
      } else {
        // alert("boş");
      }
    },

    items(val) {
      this.items = val;
    },
    userChartData(val) {
      // this.userChartData = val;
      console.log("ff", val);
      this.options.xaxis.categories = val.map((date) => {
        return date.date;
      });

      this.series[0].data = Object.values(val).map((item) => item.profit);
      this.series[1].data = Object.values(val).map((item) => item.fbaAmount);
      this.series[2].data = Object.values(val).map((item) => item.fbmAmount);

     // console.log("cchh", this.options.xaxis.categories);
      this.$refs.chart.updateSeries(this.series);
      this.$refs.chart.updateOptions(this.options);
    },
    selectedDay(val) {
      this.$store.dispatch("User/getChartData", { day: val });
    },
    options(val) {
      this.options = val;
    },
    userTableData(val) {
      this.items = this.userTableData.refundRate;
      val.refundRate.length > 0
        ? (this.isLoading = false)
        : (this.isLoading = true);
      console.log("val", val);
    },
    selectedDate(newValue) {
      // fields dizisindeki 3. sütunun (2. indeks) etiketini güncelle
      this.fields[2].label = newValue;
    },
  },

  methods: {
    getColLabel() {
      if (this.selectedBarsData.length == 1) {
        return (
          this.userTableData.tableData.selectedDate +
          "Sales / Units" +
          "Avg Selling Price"
        );
      } else if (this.selectedBarsData.length == 2) {
        return (
          this.userTableData.tableData.selectedDate2 +
          "Sales2 / Units" +
          "Avg Selling Price"
        );
      }
    },
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    tableData(salesDate, salesDate2, isDaysCompare, pageNumber) {
      this.$store.dispatch("User/getTableData", {
        salesDate: salesDate,
        salesDate2: salesDate2,
        pageSize: 30,
        pageNumber: pageNumber,
        isDaysCompare: isDaysCompare,
      });
    },
    handleKeyDown(event) {
      console.log("basıldı");
      if (event.key === "Control") {
        this.ctrlKeyActive = true;
      }
    },
    handleKeyUp(event) {
      console.log("bırakıldı");
      if (event.key === "Control") {
        this.ctrlKeyActive = false;
      }
    },
    handleBarClick(event, chartContext, config) {
      if (this.selectedBarsData.length > 1) {
        this.selectedBarsData = [];
        this.selectedBarsData.push(
          this.options.xaxis.categories[config.dataPointIndex]
        );
      } else {
        this.selectedBarsData.push(
          this.options.xaxis.categories[config.dataPointIndex]
        );
      }
      if (this.selectedBarsData.length == 1) {
        // alert("1tane");
        this.tableData(this.selectedBarsData[0], "", 0, this.currentPage);
      } else if (this.selectedBarsData.length == 2) {
        // alert("2tane");
        this.tableData(
          this.selectedBarsData[0],
          this.selectedBarsData[1],
          1,
          this.currentPage
        );
      } else {
        // alert("boş");
      }
    },
    handleFocus() {
      window.addEventListener("keyup", this.handleKeyUp);
    },
    handleBlur() {
      window.removeEventListener("keyup", this.handleKeyUp);
    },
  },
};
</script>

<style lang="scss">
td {
  font-size: 0.7rem;
  text-align: left;
}

/* Tablo başlığı (header) için font boyutu */
th {
  font-size: 0.8rem;
}
</style>
