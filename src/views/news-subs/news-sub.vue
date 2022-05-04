<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="9">
        <v-card :loading="$store.state.loading">
          <v-card-title>
            تفاصيل  المشترك {{ sub.name }}
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  label="الاسم الكامل"
                  outlined
                  v-model="sub.full_name"
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
                  label="الاختصاص"
                  outlined
                  v-model="sub.spec"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="رقم التسجيل في نقابة الاطباء"
                  outlined
                  v-model="sub.reg_num"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="d-flex justify-end">
                  
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
        .put("/news-subs/" + this.sub.id, {
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
        .put("/news-subs/" + this.sub.id, {
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
        .get("/news-subs/" + this.$route.params.id, {
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
