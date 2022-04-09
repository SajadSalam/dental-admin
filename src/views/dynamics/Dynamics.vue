<template>
  <div>
    <v-card :loading="$store.state.loading" elevation="0" class="transparent">
      <v-card-title>
        <h3>الاخبار والمقالات الخاصة بالموقع</h3>
        <v-spacer></v-spacer>
        <v-btn color="primary" :to="{ name: 'add-dynamic' }">اضافة خبر</v-btn>
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
                  <v-btn color="primary" :to="`/dynamic/${item.id}`" text>
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
          هل انت متأكد من حذف الخبر؟
        </v-card-title>

        <v-card-text>
          سيتم حذف الخبر وجميع التفاصيل المرتبطة به
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
      news: [],
      total: 1,
      headers: [
        { text: "العنوان", value: "title" },
        { text: "المحتوى", value: "description" },
        { text: "الرابط", value: "slug" },
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
    this.getnews();
  },
  methods: {
    showDeleteDialog(item) {
      this.toDelete = item;
      this.deleteDialog = true;
    },
    deleteItem() {
      this.$http.delete("/dynmics/" + this.toDelete.id).then(() => {
        this.deleteDialog = false;
        this.getnews();
      });
    },
    getnews() {
      this.$http.get("/dynmics", { params: this.options }).then((response) => {
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
