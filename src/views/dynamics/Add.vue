<template>
  <div>
    <v-card class="transparent" flat>
      <v-card-title>
        {{ isEdit ? "تفاصيل الخبر" : "اضافة خبر" }}
      </v-card-title>
      <v-card-text>
        <v-row v-if="!$store.state.loading">
          <v-col cols="12" :md="isEdit ? 9 : 12">
            <v-card :loading="loading">
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      outlined
                      label="العنوان"
                      name="title"
                      v-model="inputs.data.title"
                      placeholder="قم بإدخال العنوان"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      outlined
                      label="الرابط"
                      v-model="inputs.data.slug"
                      placeholder="سيظهر في الرابط"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-textarea
                      outlined
                      label="وصف قصير"
                      name="description"
                      v-model="inputs.data.description"
                      placeholder="قم بإدخال وصف قصير"
                    />
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-md-editor
                      v-model="inputs.data.content"
                      :text="text"
                      height="400px"
                    ></v-md-editor>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-file-input
                      v-model="file"
                      v-if="!isEdit"
                      @change="onFileChanged"
                      label="اختر صوره"
                      accept="image/*"
                      outlined
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" md="12">
                    <div class="d-flex justify-end">
                      <v-btn @click="add" color="primary">
                        <v-icon left>mdi-content-save</v-icon>
                        حفظ
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col v-if="isEdit" cols="12" md="3">
            <v-card>
              <v-card-title> صوره الخبر </v-card-title>
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
                  :src="
                    image == null
                      ? $service.url + inputs.data.featured_img
                      : image
                  "
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
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      inputs: {
        data: {
          title: "",
          slug: "",
          description: "",
          content: "",
          featured_img: "",
        },
      },
      loading: false,
      text: "",
      isEdit: false,
      uploaded: false,
      image: null,
      file: null,
    };
  },
  methods: {
    async add() {
      this.$store.commit("setLoading", true);
      if (this.isEdit) {
        this.$http.put("/dynmics/" + this.inputs.data.id, this.inputs).then(
          () => {
            this.$store.commit("setLoading", false);
            this.$router.push({ name: "dynamic" });
          },
          (error) => {
            this.$store.commit("setLoading", false);
            console.log(error);
          }
        );
      } else {
        if (this.file != null) {
          let img = await this.$service.uploadFile(this.file);
          this.inputs.data.featured_img = img.url;
        }
        this.$http.post("/dynmics", this.inputs).then(() => {
          this.$router.push("/dynamic");
        });
      }
    },
    async editPhoto() {
      if (this.file != null) {
        this.$store.commit("setLoading", true);
        let img = await this.$service.uploadFile(this.file);

        await this.$http.put("/dynmics/" + this.$route.params.id, {
          data: {
            featured_img: img.url,
          },
        });
        this.file = null;
        this.image = null;
        this.$store.commit("setLoading", true);
        this.$http.get("/dynmics/" + this.$route.params.id).then(({ data }) => {
          this.inputs.data = data.data;
          this.text = data.content;
          this.isEdit = true;
          this.$store.commit("setLoading", false);
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
  },
  mounted() {
    document.getElementsByClassName(
      "v-md-editor__left-area-title"
    )[0].innerHTML = "المحتوى";
    if (this.$route.params.id != undefined) {
      this.$store.commit("setLoading", true);
      this.$http.get("/dynmics/" + this.$route.params.id).then(({ data }) => {
        this.inputs.data = data.data;
        this.text = data.content;
        this.isEdit = true;
        this.$store.commit("setLoading", false);
      });
    }
  },
};
</script>
