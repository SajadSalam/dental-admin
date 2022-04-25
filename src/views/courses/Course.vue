<template>
  <div>
    <v-row v-if="!$store.state.loading">
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
            <v-form
              :loading="$store.state.loading"
              :disabled="$store.state.loading"
              v-model="vaild"
            >
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="العنوان بالعربي"
                    outlined
                    :rules="[$rules.required()]"
                    v-model="inputs.title"
                    id="id"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="العنوان بالانجليزي"
                    outlined
                    v-model="inputs.en_title"
                    :rules="[$rules.required()]"
                    id="id"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="المدفوعات"
                    outlined
                    v-model="inputs.fees"
                    :rules="[$rules.required()]"
                    prepend-icon="mdi-currency-usd"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="المدة"
                    outlined
                    v-model="inputs.duration"
                    :rules="[$rules.required()]"
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
                    :rules="[$rules.required()]"
                    id="id"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    label="الاختصاص"
                    outlined
                    v-model="inputs.specialty"
                    :items="specialties"
                    item-text="title"
                    item-value="id"
                    :rules="[$rules.required()]"
                    return-object
                    id="id"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="12">
                  <v-md-editor
                    v-model="inputs.content"
                    :text="inputs.content"
                    :rules="[$rules.required()]"
                    height="400px"
                  ></v-md-editor>
                </v-col>
                <v-col v-if="!isEdit" cols="12" md="12">
                  <v-file-input
                    v-model="file"
                    @change="onFileChanged"
                    label="اختر صوره"
                    accept="image/*"
                    outlined
                  ></v-file-input>
                </v-col>
                <v-col cols="12">
                  <div class="d-flex justify-end">
                    <v-btn
                      large
                      :loading="$store.state.loading"
                      :disabled="!vaild"
                      color="primary"
                      @click="update"
                    >
                      <v-icon>mdi-pencil</v-icon>
                      {{ isEdit ? "تعديل" : "اضافة" }}
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="isEdit" cols="12" md="3">
        <v-card>
          <v-card-title> صوره الكورس </v-card-title>
          <v-card-text>
            <v-file-input
              v-model="file"
              @change="onFileChanged"
              label="اختر صوره"
              accept="image/*"
              outlined
            ></v-file-input>

            <v-img
              contain
              :src="image == null ? $service.url + course.image_url : image"
              class="rounded"
            />
            <div class="d-flex justify-end mt-2">
              <v-btn v-if="file != null" @click="editPhoto" color="info">
                <v-icon>mdi-camera</v-icon>
                تعديل
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div v-else class="d-flex justify-center mt-10 pt-10">
      <v-progress-circular indeterminate size="60"></v-progress-circular>
    </div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      course: {},
      toEdit: [],
      image: null,
      file: null,
      vaild: false,
      inputs: {
        title: "",
        en_title: "",
        fees: "",
        duration: "",
        end_date: "",
        address: "",
        content: "",
        image_url: "",
        specialty: "",
      },
      specialties: [],
      isEdit: false,
      date: false,
      uploaded: false,
    };
  },
  methods: {
    addToEdit(key) {
      this.toEdit.push(key);
    },
    async update() {
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
        if (this.file != null) {
          let img = await this.$service.uploadFile(this.file);
          data.image_url = img.url;
        }
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
    onFileChanged() {
      if (this.file != null) {
        // this.file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = () => {
          this.image = reader.result;
        };
      }
    },
    async editPhoto() {
      if (this.file != null) {
        this.$store.commit("setLoading", true);
        let img = await this.$service.uploadFile(this.file);

        await this.$http.put("/courses/" + this.course.id, {
          data: {
            image_url: img.url,
          },
        });
        this.file = null;
        this.image = null;
        this.getcourse();
      }
    },
    getcourse() {
      if (this.$route.params.id != undefined) {
        this.$store.commit("setLoading", true);
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
            this.inputs.specialty = data.data.specialty.data.id;

            console.log(this.inputs);
            this.isEdit = true;
            this.$store.commit("setLoading", false);
            this.$store.commit("setLoading", false);
          });
      }
    },
    getSpecialty() {
      this.$http
        .get("/specialties", {
          params: {
            "pagination[pageSize]": 500,
          },
        })
        .then(({ data }) => {
          this.specialties = data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  created() {
    if (this.$route.params.id != undefined) {
      this.isEdit;
      this.getcourse();
      this.getSpecialty();
    }
  },
};
</script>
