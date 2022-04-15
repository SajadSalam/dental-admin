<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="9">
        <v-card :loading="$store.state.loading">
          <v-card-title>
            تفاصيل المدرب {{ sub.name }}
            <v-spacer></v-spacer>
            <div v-if="!$store.state.loading">
              <v-chip label :color="status[sub.status].color">
                {{ status[sub.status].text }}
              </v-chip>
              <!-- {{ sub.status }} -->
            </div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="الاسم الكامل"
                  outlined
                  v-model="sub.name"
                  id="id"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="رقم الهاتف"
                  dir="ltr"
                  outlined
                  v-model="sub.phone_number"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="البريد الالكتروني"
                  outlined
                  v-model="sub.email"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="موقع العمل"
                  outlined
                  v-model="sub.work_place"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="المهنة"
                  outlined
                  v-model="sub.job_title"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="المؤهل العلمي"
                  outlined
                  v-model="sub.cert"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                  label="العنوان"
                  outlined
                  v-model="sub.course"
                  id="id"
                ></v-textarea>
              </v-col>
              <v-col>
                <v-btn
                  color="warning"
                  tag="a"
                  :href="$service.url + sub.cv_url"
                  target="_blank"
                >
                  السيرة الذاتية
                </v-btn>
              </v-col>
              <v-col cols="12">
                <div class="d-flex justify-end">
                  <v-btn
                    large
                    :loading="$store.state.loading"
                    :disabled="$store.state.loading"
                    v-if="sub.status == 'pending'"
                    @click="changeStatus('rejected')"
                    color="error"
                  >
                    <v-icon>mdi-close</v-icon>
                    رفض
                  </v-btn>
                  <v-btn
                    large
                    :loading="$store.state.loading"
                    :disabled="$store.state.loading"
                    class="mx-2"
                    v-if="sub.status == 'pending'"
                    @click="changeStatus('approved')"
                    color="success"
                  >
                    <v-icon>mdi-check</v-icon>
                    موافقة
                  </v-btn>
                  <v-btn
                    large
                    :loading="$store.state.loading"
                    :disabled="$store.state.loading"
                    class="mx-2"
                    v-if="sub.status == 'approved'"
                    @click="changeStatus('accepted')"
                    color="success"
                  >
                    <v-icon>mdi-check</v-icon>
                    قبول
                  </v-btn>
                  <v-btn
                    large
                    :loading="$store.state.loading"
                    :disabled="$store.state.loading"
                    color="primary"
                    @click="update"
                  >
                    <v-icon>mdi-pencil</v-icon>
                    تعديل
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import qs from "qs";
export default {
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
      sub: {},
      col: {},
      toEdit: [],
      inputs: {},
    };
  },
  methods: {
    addToEdit(key) {
      this.toEdit.push(key);
    },
    changeStatus(status) {
      this.$store.commit("setLoading", true);
      this.$http
        .put("/trainers/" + this.sub.id, {
          data: {
            status: status,
          },
        })
        .then(() => {
          this.getSub();
        })
        .catch((e) => {
          this.$store.commit("setLoading", false);
          console.log(e);
        });
    },
    update() {
      this.$store.commit("setLoading", true);
      this.inputs = {
        name: this.sub.name,
        email: this.sub.email,
        phone_number: this.sub.phone_number,
        cert: this.sub.cert,
        work_place: this.sub.work_place,
        job_title: this.sub.job_title,
        course: this.sub.course,
      };
      let data = this.inputs;
      this.$http
        .put("/trainers/" + this.sub.id, {
          data,
        })
        .then(() => {
          this.getSub();
        })
        .catch((e) => {
          this.$store.commit("setLoading", false);
          console.log(e);
        });
    },
    getSub() {
      this.$store.commit("setLoading", true);
      this.$http
        .get("/trainers/" + this.$route.params.id, {
          params: {
            populate: {
              course: {
                populate: "*",
              },
            },
          },
          paramsSerializer: function paramsSerializer(params) {
            return qs.stringify(params);
          },
        })
        .then((res) => {
          this.sub = res.data.data;
          this.$store.commit("setLoading", false);
        });
    },
  },
  created() {
    this.getSub();
  },
};
</script>
