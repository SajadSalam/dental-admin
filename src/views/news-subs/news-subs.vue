<template>
  <div>
    <v-card :loading="$store.state.loading" elevation="0" class="transparent">
      <v-card-title>
        <h3>المشتركين</h3>
        <v-spacer></v-spacer>
        <v-btn
          :href="$service.url + '/api/news-sub/excel'"
          target="__blank"
          color="primary"
        >
          <v-icon>mdi-file-excel</v-icon>
          تصدير الى Excel
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              label="بحث"
              v-model="options.filters.full_name.$contains"
              outlined
              hide-details="auto"
              prepend-inner-icon="mdi-magnify"
              solo
              flat
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              label="رقم الهاتف"
              v-model="options.filters.phone_number.$contains"
              outlined
              hide-details="auto"
              prepend-inner-icon="mdi-phone"
              solo
              flat
            ></v-text-field>
          </v-col>
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
              <template v-slot:item.phone_number="{ item }">
                <span dir="ltr">
                  {{ item.phone_number }}
                </span>
                <!-- {{ sub.status }} -->
              </template>
              <template v-slot:item.actions="{ item }">
                <div class="d-flex align-center">
                  <v-btn color="primary" :to="`/news-subs/${item.id}`" text>
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
          هل انت متأكد من حذف المدرب؟
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
import qs from "qs";
export default {
  components: {},
  data() {
    return {
      provinecs: [],
      subs: [],
      total: 1,
      headers: [
        { text: "الاسم", value: "full_name" },
        { text: "رقم الهاتف", value: "phone_number" },
        { text: "البريد", value: "email" },
        { text: "الاختصاص", value: "spec" },
        { text: "رقم التسجيل في النقابة", value: "reg_num" },
        { text: "تاريخ التقديم", value: "created" },
        { text: "الاجراءات", value: "actions" },
      ],
      deleteDialog: false,
      toDelete: {},
      options: {
        populate: "*",
        filters: {
          full_name: {
            $contains: "",
          },
          phone_number: {
            $contains: "",
          },
        },
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
      this.$http.delete("/news-subs/" + this.toDelete.id).then(() => {
        this.deleteDialog = false;
        this.getSubs();
      });
    },
    getSubs() {
      this.$store.commit("setLoading", true);
      this.$http
        .get("/news-subs", {
          params: this.options,
          paramsSerializer: function paramsSerializer(params) {
            return qs.stringify(params);
          },
        })
        .then((response) => {
          this.subs = response.data.data;
          this.total = response.data.meta.pagination.total;
          this.$store.commit("setLoading", false);
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
