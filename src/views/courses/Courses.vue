<template>
  <div>
    <v-card :loading="$store.state.loading" elevation="0" class="transparent">
      <v-card-title>
        <h3>الكورسيات</h3>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :ripple="false"
              :items="courses"
              hide-default-footer
              :loading="$store.state.loading"
              no-data-text="لا يوجد"
              loading-text="جار التحميل..."
            >
              <template v-slot:item.created="{ item }">
                {{ $service.formatDate(new Date(item.createdAt), false) }}
              </template>
              <template v-slot:item.actions="{ item }">
                <div class="d-flex align-center">
                  <v-btn color="primary" :to="`/courses/${item.id}`" text>
                    <v-icon>mdi-pencil</v-icon>
                    كل التفاصيل
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-col>
          <v-col cols="12">
            <div class="d-flex justify-center">
              <v-pagination
                v-model="options.pagination.page"
                :length="parseInt(total / options.pagination.pageSize) + 1"
              />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      courses: [],
      total: 1,
      headers: [
        { text: "الاسم", value: "title" },
        { text: "الاسم انكليزي", value: "en_title" },
        { text: "الوصف", value: "description" },
        { text: "تاريخ الانتهاء", value: "end_date" },
        { text: "الاجراءات", value: "actions" },
      ],
      options: {
        populate: "*",
        pagination: {
          page: 0,
          pageSize: 15,
        },
      },
    };
  },
  created() {
    this.getcourses();
  },
  methods: {
    editRegion(item) {
      let temp = item;
      temp.provinecId = this.provinecs.find(
        (provinec) => provinec.name == item.provinecName
      ).id;
      this.$store.commit("courses/updateItem", temp);

      this.$store.commit("courses/toggleEdit");

      this.$store.commit("courses/toggleDialog");
    },
    getcourses() {
      this.$http.get("/courses", { params: this.options }).then((response) => {
        this.courses = response.data.data;
        this.total = response.data.meta.pagination.total;
      });
    },
  },
  watch: {
    options: {
      handler() {
        this.getcourses();
      },
      deep: true,
    },
  },
};
</script>
