<template>
  <div>
    <Dialog :provinecs="provinecs" />
    <v-card :loading="$store.state.loading" elevation="0" class="transparent">
      <v-card-title>
        <h3>المتدربين</h3>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :ripple="false"
              :items="subs"
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
                  <v-btn color="primary" :to="`/subscriptions/${item.id}`" text>
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
      status: {
        pending: {
          color: "warning",
          text: "قيد المراجعة",
        },
        approved: {
          color: "success",
          text: "تمت الموافقة",
        },
        accepted: {
          color: "success",
          text: "مقبول",
        },
        rejected: {
          color: "error",
          text: "مرفوض",
        },
      },
      provinecs: [],
      subs: [],
      total: 1,
      headers: [
        { text: "الاسم", value: "name" },
        { text: "رقم الهاتف", value: "phone_number" },
        { text: "البريد", value: "email" },
        { text: "تاريخ التقديم", value: "created" },
        { text: "الحالة", value: "status" },
        { text: "الكورس", value: "course.data.title" },
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
    this.getSubs();
  },
  methods: {
    editRegion(item) {
      let temp = item;
      temp.provinecId = this.provinecs.find(
        (provinec) => provinec.name == item.provinecName
      ).id;
      this.$store.commit("subs/updateItem", temp);

      this.$store.commit("subs/toggleEdit");

      this.$store.commit("subs/toggleDialog");
    },
    getSubs() {
      this.$http
        .get("/course-subs", { params: this.options })
        .then((response) => {
          this.subs = response.data.data;
          this.total = response.data.meta.pagination.total;
        });
    },
  },
  watch: {
    options: {
      handler() {
        this.getSubs();
      },
      deep: true,
    },
  },
};
</script>
