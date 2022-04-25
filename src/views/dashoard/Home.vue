<template>
  <div>
    <v-row>
      <v-col cols="6" md="3">
        <v-card color="primary">
          <v-card-title class="d-flex align-center white--text">
            <div>
              <h4>
                {{stats.courses}}
              </h4>
              <small class="font-weight-bold">عدد الكورسات</small>
            </div>
            <v-spacer></v-spacer>
            <v-icon color="white" size="75">mdi-book-account</v-icon>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card>
          <v-card-title class="d-flex align-center">
            <div>
              <h4>
                {{stats.specialty}}
              </h4>
              <small class="font-weight-bold">الاختصاص</small>
            </div>
            <v-spacer></v-spacer>
            <v-icon size="75">mdi-transit-connection-variant</v-icon>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card>
          <v-card-title class="d-flex align-center">
            <div>
              <h4>
                {{stats.numberOfTrainers}}
              </h4>
              <small class="font-weight-bold">المتدربين</small>
            </div>
            <v-spacer></v-spacer>
            <v-icon size="75">mdi-account-check</v-icon>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card>
          <v-card-title class="d-flex align-center">
            <div>
              <h4>
                {{stats.numberOfSubs}}
              </h4>
              <small class="font-weight-bold">المدربين</small>
            </div>
            <v-spacer></v-spacer>
            <v-icon size="75">mdi-account-eye</v-icon>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col class="my-5" cols="12">
        <h3 class="my-3">احصائيات المقدمين</h3>
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" md="6">
        <apexchart
          width="550"
          height="300"
          type="line"
          :options="options"
          :series="subs"
          ref="subchart"
        ></apexchart>
      </v-col>
      <v-col cols="12" md="6">
        <apexchart
          width="550"
          height="300"
          type="line"
          :options="options"
          :series="trainers"
          ref="trchart"
        ></apexchart>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      stats: {},
      options: {
        colors: ["#3CC2E0", "#2ED67B", "#FFC107"],

        stroke: {
          curve: "smooth",
        },
        chart: {
          zoom: {
            enabled: true,
            type: "x",
            autoScaleYaxis: false,
          },
          id: "vuechart-example",
          toolbar: {
            show: true,
          },
        },
        xaxis: {
          tickPlacement: "on",
          categories: [0],
        },
      },
      trainers: [
        {
          name: "قيد المراجعة",
          uid: "pending",
          data: [0],
        },
        {
          name: "تم الموافقة",
          uid: "approved",
          data: [0],
        },
        {
          name: "تم القبول",
          uid: "accepted",
          data: [0],
        },
        {
          name: "تم الرفض",
          uid: "rejected",
          data: [0],
        },
      ],
      subs: [
        {
          name: "قيد المراجعة",
          uid: "pending",
          data: [0],
        },
        {
          name: "تم الموافقة",
          uid: "approved",
          data: [0],
        },
        {
          name: "تم القبول",
          uid: "accepted",
          data: [0],
        },
        {
          name: "تم الرفض",
          uid: "rejected",
          data: [0],
        },
      ],
    };
  },
  created() {
    this.getStats();
  },
  methods: {
    getStats() {
      this.$http.get("/statics/stats").then((res) => {
        this.stats = res.data;
        this.subs.filter((el) => el.uid == "pending")[0].data = [
          0,
          this.stats.subs.pending,
        ];
        this.subs.filter((el) => el.uid == "approved")[0].data = [
          0,
          this.stats.subs.approved,
        ];
        this.subs.filter((el) => el.uid == "accepted")[0].data = [
          0,
          this.stats.subs.accepted,
        ];
        this.subs.filter((el) => el.uid == "rejected")[0].data = [
          0,
          this.stats.subs.rejected,
        ];
        this.$refs.subchart.updateSeries(this.subs);
        this.trainers.filter((el) => el.uid == "pending")[0].data = [
          0,
          this.stats.trainers.pending,
        ];
        this.trainers.filter((el) => el.uid == "approved")[0].data = [
          0,
          this.stats.trainers.approved,
        ];
        this.trainers.filter((el) => el.uid == "accepted")[0].data = [
          0,
          this.stats.trainers.accepted,
        ];
        this.trainers.filter((el) => el.uid == "rejected")[0].data = [
          0,
          this.stats.trainers.rejected,
        ];
        this.$refs.trchart.updateSeries(this.trainers);
      });
    },
  },
};
</script>
