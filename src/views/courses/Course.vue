<template>
  <div>
    <v-row>
      <v-col cols="12" :md="isEdit ? 9 : 12">
        <v-card v-if="!$store.state.loading" :loading="$store.state.loading">
          <v-card-title>
            <span v-if="isEdit"> تفاصيل الكورس {{ course.title }} </span>
            <span v-else>
              اضافة كورس
            </span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="العنوان بالعربي"
                  outlined
                  v-model="inputs.title"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="العنوان بالانجليزي"
                  outlined
                  v-model="inputs.en_title"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="المدفوعات"
                  outlined
                  v-model="inputs.fees"
                  prepend-icon="mdi-currency-usd"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="المدة"
                  outlined
                  v-model="inputs.duration"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                  label="الوصف بالعربي"
                  outlined
                  v-model="inputs.description"
                  id="id"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu
                  v-model="date"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="inputs.end_date"
                      label="تاريخ الانتهاء"
                      outlined
                      append-icon="mdi-calendar"
                      readonly
                      hide-details="auto"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    locale="ar"
                    v-model="inputs.end_date"
                    @input="date = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="مكان اقامة الكورس"
                  outlined
                  v-model="inputs.address"
                  id="id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-md-editor
                  v-model="inputs.content"
                  :text="inputs.content"
                  height="400px"
                ></v-md-editor>
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
                    {{ isEdit ? "تعديل" : "اضافة" }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="isEdit" cols="12" md="3">
        <v-card>
          <v-card-title> صوره الكورس </v-card-title>
          <v-card-text>
            <v-img
              contain
              :src="$service.url + course.image_url"
              class="rounded"
            />
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
      course: {},
      toEdit: [],
      inputs: {
        title: "",
        en_title: "",
        fees: "",
        duration: "",
        end_date: "",
        address: "",
        content: "",
      },
      isEdit: false,
      date: false,
    };
  },
  methods: {
    addToEdit(key) {
      this.toEdit.push(key);
    },
    update() {
      this.$store.commit("setLoading", true);
      this.inputs.end_date = new Date(this.inputs.end_date).toISOString();
      let data = this.inputs;
      if (this.isEdit) {
        this.$http
          .put("/courses/" + this.course.id, {
            data,
          })
          .then(() => {
            this.$store.commit("setLoading", false);
            this.getcourse();
          })
          .catch((e) => {
            this.$store.commit("setLoading", false);
            console.log(e);
          });
      } else {
        this.$http
          .post("/courses", {
            data,
          })
          .then(() => {
            this.$router.push("/courses");
          })
          .catch((e) => {
            this.$store.commit("setLoading", false);
            console.log(e);
          });
      }
    },
  },
  created() {
    if (this.$route.params.id != undefined) {
      this.$http
        .get("/courses/" + this.$route.params.id, {
          params: {
            populate: "*",
          },
          paramsSerializer: function paramsSerializer(params) {
            return qs.stringify(params);
          },
        })
        .then(({ data }) => {
          this.course = data.data;
          this.inputs = data.data;
          this.text = data.content;
          this.isEdit = true;
          this.loading = false;
        });
    }
  },
};
</script>
