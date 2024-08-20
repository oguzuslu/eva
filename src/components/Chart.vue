<template>
  <div class="container">
    <div class="row">
      <b-spinner
        variant="primary"
        v-if="!userChartData"
        class="m-auto"
      ></b-spinner>

      <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
    </div>

    <div class="row">
      <b-col lg="3" class="my-1" v-if="this.items.skuList">
        <b-form-group
          label-for="filter-input"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-input-group size="sm" class="mb-2">
            <b-input-group-prepend is-text>
              <b-icon icon="search"></b-icon>
            </b-input-group-prepend>
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder=""
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-card v-if="this.items.skuList">
        <b-table
          :items="items.skuList"
          :fields="fields"
          :current-page="currentPage"
          :per-page="rowCount"
          :filter="filter"
          :filter-included-fields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          stacked="md"
          show-empty
          small
          style="font-size: 8px"
        >
          <template #head(amount)="data">
            <div style="text-align: end">
              {{ data.field.dayName }} <br />{{ data.field.date }} <br />
              Sales / Units <br />
              Avg. Selling Price
            </div>
          </template>
          <template #head(amount2)="data">
            <div style="text-align: end">
              {{ data.field.dayName2 }} <br />{{ data.field.date }} <br />
              Sales / Units <br />
              Avg. Selling Price
            </div>
          </template>
          <template #head(refundRate)="">
            <div style="text-align: end">
              SKU Refund Rate<br />
              (Last 60 days)<br />
            </div>
          </template>
          <template #head(productName)="">
            <div style="text-align: left">Product Name</div>
          </template>
          <template #cell(productName)="row">
            <label style="float: left">{{ row.item.productName }}</label>
          </template>
          <template #cell(refundRate)="row">
            <label style="float: right"
              >{{ row.item.refundRateData.refundRate }}%</label
            >
          </template>
          <template #cell(amount)="row">
            <label
              v-if="row.item.qty"
              style="
                color: #7eb073;
                font-weight: bold;
                font-size: 10px;
                float: right;
              "
              >${{ parseFloat(row.item.amount).toFixed(2) }} / {{ row.item.qty
              }}<br /><label style="float: right"
                >${{
                  parseFloat(row.item.amount / row.item.qty).toFixed(2)
                }}</label
              ></label
            >
            <label v-else style="float: right">---------</label>
          </template>
          <template #cell(amount2)="row">
            <label
              v-if="row.item.qty2"
              style="
                color: #7eb073;
                font-weight: bold;
                font-size: 10px;
                float: right;
              "
              >${{ parseFloat(row.item.amount2).toFixed(2) }} /
              {{ row.item.qty2 }}<br /><label style="float: right"
                >${{
                  parseFloat(row.item.amount2 / row.item.qty2).toFixed(2)
                }}</label
              ></label
            >
            <label v-else style="float: right">---------</label>
          </template>
        </b-table>
      </b-card>
    </div>
    <b-row>
      <div>
        <b-pagination
          v-if="isLoading"
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
import Highcharts from "highcharts";
import exportingInit from "highcharts/modules/exporting";
import { BTable } from "bootstrap-vue";
import { mapGetters } from "vuex";

exportingInit(Highcharts);

export default {
  data() {
    return {
      isLoading: true,
      selectedDate1: null,
      selectedDate2: null,
      selectedCategoryIndexes: [], // Seçili barlar için state
      //chart values
      chartOptions: {
        chart: {
          type: "column",
          height: 500,
          responsive: {
            rules: [
              {
                condition: {
                  maxWidth: 500,
                },
                chartOptions: {
                  legend: {
                    align: "center",
                    verticalAlign: "bottom",
                    layout: "horizontal",
                  },
                  yAxis: {
                    title: {
                      text: "",
                    },
                  },
                },
              },
            ],
          },
        },
        title: {
          text: "Daily Sales",
          align: "left",
        },
        xAxis: {
          categories: ["Arsenal", "Chelsea", "Liverpool", "Manchester United"],
        },
        yAxis: {
          min: 0,
          title: {
            text: "Amount ($)",
          },
          stackLabels: {
            enabled: false,
          },
        },
        legend: {
          align: "center",
          verticalAlign: "bottom",
          floating: false,
          layout: "horizontal",
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || "white",
          borderColor: "#CCC",
          borderWidth: 0,
          shadow: false,
        },
        tooltip: {
          shared: true,
          headerFormat: "<b>{point.x}</b><br/>",
          pointFormat: "{series.name}: ${point.y}<br/>",
          footerFormat: "Total Sales: ${point.total}",
        },
        plotOptions: {
          column: {
            stacking: "normal",
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              rotation: -90,
              align: "center",
              format: "${point.y}",
              style: {
                fontSize: "10px",
                fontWeight: "400",
                color: "white",
              },
            },
            pointWidth: 15,
            pointPadding: 0.1,
            groupPadding: 0,
            point: {
              events: {
                click: (ev) => {
                  const categoryIndex = ev.point.index;

                  // sseçili kategori varsa ve seçili barlar arasında değilse, seçimi ekle
                  if (!this.selectedCategoryIndexes.includes(categoryIndex)) {
                    // İki bar seçilirse, en eski seçimi kaldır
                    if (this.selectedCategoryIndexes.length >= 2) {
                      this.selectedCategoryIndexes.forEach((index) =>
                        this.resetBarColor(index)
                      );
                      this.selectedCategoryIndexes = [];
                    }

                    this.selectedCategoryIndexes.push(categoryIndex);
                    this.highlightSelectedBar(categoryIndex);
                  } else {
                    // seçili kategori varsa ve zaten seçiliyse, seçimi kaldır
                    this.selectedCategoryIndexes =
                      this.selectedCategoryIndexes.filter(
                        (index) => index !== categoryIndex
                      );
                    this.resetBarColor(categoryIndex);
                  }
                },
              },
            },
          },
        },

        series: [
          {
            name: "Profit",
            data: [3, 5, 1, 13],
            color: "#71ECC5",
            dataLabels: {
              enabled: false,
            },
          },
          {
            name: "FBA Sales",
            data: [14, 8, 8, 12],
            color: "#7F85E9",
          },
          {
            name: "FBM Sales",
            data: [0, 2, 6, 3],
            color: "#5D33EB",

            dataLabels: {
              enabled: false,
            },
          },
        ],
      },
      //chart values end//////////

      //////table values////////

      items: [],

      totalRows: 100,
      currentPage: 1,
      rowCount: 10,
      perPage: 30,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],

      ////////table values end////////
    };
  },
  components: {
    BTable,
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
      const data = [
        { key: "sku", label: "SKU", sortable: false },
        {
          key: "productName",
          label: "Product Name",
          sortable: false,
          class: "text-center",
        },

        // { key: 'actions', label: 'Actions' }
      ];
      if (this.items.selectedDate) {
        const day = new Date(this.items.selectedDate);

        const dayName = day.toLocaleString("en-US", { weekday: "long" });

        data.push({
          key: "amount",
          label: "amount",
          dayName,
          date: this.items.selectedDate,
          sortable: false,
        });
      }
      if (this.items.selectedDate2) {
        // console.log(this.items.selectedDate2);
        const day = new Date(this.items.selectedDate2);
        const dayName2 = day.toLocaleString("en-US", { weekday: "long" });
        data.push({
          key: "amount2",
          label: "amount2",
          dayName2,
          date: this.items.selectedDate2,
          sortable: false,
        });
      }
      data.push({ key: "refundRate", label: "Refund Rate", sortable: false });
      return data;
    },
    computedFields() {
      let baseFields = [...this.fields];

      // Eğer items içindeki herhangi bir veride refundRate2 varsa, yeni field ekle
      if (this.items.some((item) => item.selectedDate2)) {
        baseFields.push({
          key: "refundRate2",
          label: "SKU Refund Rate 2",
          sortable: true,
        });
      }

      return baseFields;
    },
  },
  props: {
    selectedDay: {
      type: Number,
      required: true, // Eğer bu prop zorunluysa, required olarak ayarlayabilirsiniz
    },
  },

  watch: {
    selectedCategoryIndexes() {
      if (this.selectedCategoryIndexes.length == 1) {
        let data1 = this.getBarData(this.selectedCategoryIndexes[0]);
        this.selectedDate1 = data1[0].date;
        this.selectedDate2 = null; // İkinci tarih yok
        this.tableData(
          this.selectedDate1,
          "",
          this.perPage,
          this.currentPage,
          0
        );
      } else if (this.selectedCategoryIndexes.length == 2) {
        let data1 = this.getBarData(this.selectedCategoryIndexes[0]);
        let data2 = this.getBarData(this.selectedCategoryIndexes[1]);

        this.selectedDate1 = data1[0].date;
        this.selectedDate2 = data2[0].date;
        this.tableData(
          this.selectedDate1,
          this.selectedDate2,
          this.perPage,
          this.currentPage,
          1
        );
        // console.log('Selected Indexes:', this.selectedCategoryIndexes);
        // console.log('Data1:', data1);
        // console.log('Data2:', data2);
      } else {
        this.selectedDate1 = null;
        this.selectedDate2 = null;
      }
    },
    userTableData(val) {
      if (this.items.skuList) {
        this.totalRows = this.items.skuList.length;
      }
    },
    currentPage(val) {
      this.currentPage = val;
      const pageNumber = this.currentPage;

      const apiPageNumber = Math.ceil(pageNumber / 3);

      if ((pageNumber - 1) % 3 === 0 && pageNumber > 1) {
        if (this.selectedCategoryIndexes.length === 1) {
          this.tableData(
            this.selectedDate1,
            "",
            this.perPage,
            apiPageNumber,
            0
          );
        } else if (this.selectedCategoryIndexes.length === 2) {
          this.tableData(
            this.selectedDate1,
            this.selectedDate2,
            this.perPage,
            apiPageNumber,
            1
          );
        }
      }
    },

    items(val) {
      this.items = val;
    },
    userTableData(val) {
      this.items = this.userTableData.tableData;
      this.items.length > 0
        ? (this.isLoading = false)
        : (this.isLoading = true);
      // console.log("val", val);
    },

    userChartData(val) {
      val ? (this.isLoading = false) : (this.isLoading = true);
      // this.userChartData = val
      console.log("ff", val);
      this.chartOptions.xAxis.categories = this.userChartData.map((date) => {
        const dateObj = new Date(date.date);
        const dayName = dateObj.toLocaleString("en-US", { weekday: "long" });
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();

        return `${dayName}, ${month}-${day}-${year}`;
      });

      this.chartOptions.xAxis.labels = {
        style: {
          fontSize: "8px",
        },
      };

      this.chartOptions.series[0].data = Object.values(this.userChartData).map(
        (item) => item.profit
      );
      this.chartOptions.series[1].data = Object.values(this.userChartData).map(
        (item) => item.fbaAmount
      );
      this.chartOptions.series[2].data = Object.values(this.userChartData).map(
        (item) => item.fbmAmount
      );
    },
    selectedDay(val) {
      this.$store.dispatch("User/getChartData", { day: val });
      this.currentPage = 1;
    },
  },
  created() {
    this.$store.dispatch("User/getChartData", { day: this.selectedDay });
    this.chartOptions.xAxis.categories = this.userChartData.map((date) => {
      const dateObj = new Date(date.date);
      const dayName = dateObj.toLocaleString("en-US", { weekday: "long" });
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();

      return `${dayName}, ${month}-${day}-${year}`;
    });

    this.chartOptions.xAxis.labels = {
      style: {
        fontSize: "8px",
      },
    };

    this.chartOptions.series[0].data = Object.values(this.userChartData).map(
      (item) => item.profit
    );
    this.chartOptions.series[1].data = Object.values(this.userChartData).map(
      (item) => item.fbaAmount
    );
    this.chartOptions.series[2].data = Object.values(this.userChartData).map(
      (item) => item.fbmAmount
    );

    // console.log("cchh", this.chartOptions.xAxis.categories);
  },

  methods: {
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },

    tableData(salesDate, salesDate2, perPage, currentPage, isDaysCompare) {
      this.$store.dispatch("User/getTableData", {
        salesDate: salesDate,
        salesDate2: salesDate2,
        pageSize: perPage,
        pageNumber: currentPage,
        isDaysCompare: isDaysCompare,
      });
    },
    ///chart methods

    highlightSelectedBar(categoryIndex) {
      const chart = this.$refs.chart.chart;

      chart.series.forEach((series) => {
        series.data.forEach((point, index) => {
          if (index === categoryIndex) {
            point.update({
              color: "#4D943E",

              shadow: {
                color: "#E6E9EA",
                opacity: 0.2,
                offsetX: 0,
                offsetY: 2,
                width: 1,
              },
            });
          }
        });
      });
    },

    resetBarColor(categoryIndex) {
      const chart = this.$refs.chart.chart;

      chart.series.forEach((series) => {
        series.data.forEach((point, index) => {
          if (index === categoryIndex) {
            point.update({
              color: null,
              borderColor: null,
              borderWidth: 0,

              shadow: false,
            });
          }
        });
      });
    },

    getBarData(categoryIndex) {
      const chart = this.$refs.chart.chart;
      const barData = [];

      function formatDate(dateStr) {
        const [dayName, monthDayYear] = dateStr.split(", ");
        const [month, day, year] = monthDayYear.split("-");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }

      chart.series.forEach((series) => {
        const point = series.data[categoryIndex];
        if (point) {
          const categoryName = chart.xAxis[0].categories[categoryIndex];
          const existingCategory = barData.find(
            (data) => data.date === categoryName
          );

          if (existingCategory) {
            existingCategory[series.name] = point.y;
          } else {
            const formattedDate = formatDate(categoryName);
            const newEntry = { date: formattedDate };
            newEntry[series.name] = point.y;
            barData.push(newEntry);
          }
        }
      });

      return barData;
    },
  },
};
</script>

<style scoped>
#filter-input:hover,
#filter-input:active,
#filter-input:focus {
  border-color: none !important;
}

.form-control:focus {
  color: var(--bs-body-color);
  background-color: none;
  border-color: none !important;
  outline: 0;
  box-shadow: none;
}
</style>