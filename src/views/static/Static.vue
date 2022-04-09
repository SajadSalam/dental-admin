<template>
  <div>
    <v-card :loading="$store.state.loading" elevation="0" class="transparent">
      <v-card-title>
        <h3>الصفحات</h3>
        <v-spacer></v-spacer>
        <v-btn color="primary" :to="{ name: 'add-static' }">اضافة صفحة</v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :ripple="false"
              :items="news"
              hide-default-footer
              :loading="$store.state.loading"
              no-data-text="لا يوجد"
              loading-text="جار التحميل..."
            >
              <template v-slot:item.created="{ item }">
                {{ $service.formatDate(new Date(item.createdAt), false) }}
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip label :color="status[item.status].color">
                  {{ status[item.status].text }}
                </v-chip>
                <!-- {{ sub.status }} -->
              </template>
              <template v-slot:item.actions="{ item }">
                <div class="d-flex align-center">
                  <v-btn color="primary" :to="`/static/${item.id}`" text>
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
      news: [],
      total: 1,

      headers: [
        { text: "العنوان", value: "title" },
        { text: "المحتوى", value:"description" },
        { text: "الرابط", value: "slug" },
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
    this.getnews();
  },
  methods: {
    getnews() {
      this.$http.get("/statics", { params: this.options }).then((response) => {
        this.news = response.data.data;
        this.total = response.data.meta.pagination.total;
      });
    },
  },
  watch: {
    options: {
      handler() {
        this.getnews();
      },
      deep: true,
    },
  },
};
</script>
