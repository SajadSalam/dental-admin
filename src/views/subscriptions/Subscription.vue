<template>
  <div>
    <v-row>
      <v-col cols="12" md="9">
        <v-card :loading="$store.state.loading">
          <v-card-title>
            تفاصيل المتدرب {{ sub.name }}
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
                  label="الاسم الكامل بالعربي"
                  outlined
                  v-model="sub.name"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="الاسم الكامل بالانجليزي"
                  outlined
                  v-model="sub.en_name"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="رقم الهاتف"
                  outlined
                  dir="ltr"
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
                  label="محل العمل"
                  outlined
                  v-model="sub.hospital"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="عنوان محل العمل"
                  outlined
                  v-model="sub.hospital_address"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="اسم الاختصاص"
                  outlined
                  v-model="sub.pro_name"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="العنوان الوظيفي"
                  outlined
                  v-model="sub.job"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                  label="العنوان"
                  outlined
                  v-model="sub.address"
                  id="id"
                ></v-textarea>
              </v-col>
              <v-col>
                <div class="d-flex">
                  <v-btn
                    color="warning"
                    tag="a"
                    :href="$service.url + sub.ima_id"
                    target="_blank"
                  >
                    <v-icon>mdi-file</v-icon>
                    تنزيل الهوية
                  </v-btn>
                  <v-btn
                    color="primary"
                    tag="a"
                    class="mx-3"
                    :href="$service.url + sub.passport"
                    target="_blank"
                  >
                    <v-icon>mdi-file</v-icon>
                    تنزيل الجواز
                  </v-btn>
                  <v-btn
                    color="secondary"
                    tag="a"
                    :href="$service.url + sub.endorsement"
                    target="_blank"
                  >
                    <v-icon>mdi-file</v-icon>
                    تنزيل
                    {{ sub.study == "pro" ? "الامر الاداري" : "تأييد الطالب" }}
                  </v-btn>
                </div>
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
      <v-col cols="12" md="3">
        <v-card v-if="sub.course.data != undefined">
          <v-card-title>
            {{ sub.course.data.title }}
          </v-card-title>
          <v-card-text>
            <v-img
              contain
              :src="$service.url + sub.course.data.images_url"
              class="rounded"
            />
            <p class="mt-2">
              {{ sub.course.data.description }}
            </p>
          </v-card-text>
        </v-card>
        <p v-else class="text-center mt-10">
          تم حذف الكورس الذي تم تسجيله من قبل هذا المتدرب
        </p>
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
        .put("/course-subs/" + this.sub.id, {
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
        en_name: this.sub.en_name,
        phone_number: this.sub.phone_number,
        email: this.sub.email,
        hospital: this.sub.hospital,
        hospital_address: this.sub.hospital_address,
        pro_name: this.sub.pro_name,
        job: this.sub.job,
        address: this.sub.address,
      };
      let data = this.inputs;
      this.$http
        .put("/course-subs/" + this.sub.id, {
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
        .get("/course-subs/" + this.$route.params.id, {
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
