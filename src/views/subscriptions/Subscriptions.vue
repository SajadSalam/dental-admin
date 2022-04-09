<template>
  <div>
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
                    كل التفاصيل </v-btn
                  ><v-btn @click="showDeleteDialog(item)" color="error" icon>
                    <v-icon>mdi-delete</v-icon>
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
    <v-dialog v-model="deleteDialog" width="400">
      <v-card>
        <v-card-title>
          هل انت متأكد من حذف المتدرب؟
        </v-card-title>

        <v-card-text>
          سيتم حذف المتدرب وجميع التفاصيل المرتبطة به
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="deleteItem()">
            <v-icon>mdi-delete</v-icon>
            حذف
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      deleteDialog: false,
      toDelete: {},
      options: {
        populate: "*",
        pagination: {
          page: 1,
          pageSize: 15,
        },
      },
    };
  },
  created() {
    this.getSubs();
  },
  methods: {
    showDeleteDialog(item) {
      this.toDelete = item;
      this.deleteDialog = true;
    },
    deleteItem() {
      this.$http.delete("/course-subs/" + this.toDelete.id).then(() => {
        this.deleteDialog = false;
        this.getSubs();
      });
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
