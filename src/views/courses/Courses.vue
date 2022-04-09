<template>
  <div>
    <v-card :loading="$store.state.loading" elevation="0" class="transparent">
      <v-card-title>
        <h3>الكورسات</h3>
        <v-spacer></v-spacer>
        <v-btn :to="'/courses-add'" color="primary">
          <v-icon>mdi-plus</v-icon>
          إضافة
        </v-btn>
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
              <template v-slot:item.count="{ item }">
                {{ item.course_subs.data.length }}
              </template>
              <template v-slot:item.actions="{ item }">
                <div class="d-flex align-center">
                  <v-btn color="primary" :to="`/courses/${item.id}`" text>
                    <v-icon>mdi-pencil</v-icon>
                    كل التفاصيل
                  </v-btn>
                  <v-btn @click="showDeleteDialog(item)" color="error" icon>
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
                :length="parseInt(total / options.pagination.pageSize) +1 "
              />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="deleteDialog" width="400">
      <v-card>
        <v-card-title>
          هل انت متأكد من حذف الكورس؟
        </v-card-title>

        <v-card-text>
          سيتم حذف الكورس وجميع التفاصيل المرتبطة به
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
import qs from "qs";
export default {
  components: {},
  data() {
    return {
      deleteDialog: false,
      courses: [],
      total: 1,
      headers: [
        { text: "الاسم", value: "title" },
        { text: "الاسم انكليزي", value: "en_title" },
        { text: "الوصف", value: "description" },
        { text: "عدد المتدربين", value: "count" },
        { text: "تاريخ الانتهاء", value: "end_date" },
        { text: "الاجراءات", value: "actions" },
      ],
      toDelete: {},
      options: {
        populate: {
          course_subs: {
            fields: ["id"],
          },
        },
        pagination: {
          page: 1,
          pageSize: 10,
        },
      },
    };
  },
  created() {
    this.getcourses();
  },
  methods: {
    showDeleteDialog(item) {
      this.toDelete = item;
      this.deleteDialog = true;
    },
    deleteItem() {
      this.$http.delete("/courses/" + this.toDelete.id).then(() => {
        this.deleteDialog = false;
        this.getcourses();
      });
    },
    getcourses() {
      this.$store.commit("setLoading", true);
      this.$http
        .get("/courses", {
          params: this.options,
          paramsSerializer: function paramsSerializer(params) {
            return qs.stringify(params);
          },
        })
        .then((response) => {
          this.courses = response.data.data;
          this.total = response.data.meta.pagination.total;
          this.$store.commit("setLoading", false);
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
