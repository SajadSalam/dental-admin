<template>
  <div>
    <v-card class="transparent" flat>
      <v-card-title>
        أضف صفحة جديد
      </v-card-title>
      <v-card-text>
        <v-card-text>
          <v-row v-if="!$store.state.loading">
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
                disabled
                placeholder="سيظهر في الرابط"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-md-editor
                v-model="inputs.data.content"
                :text="text"
                height="400px"
              ></v-md-editor>
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
          <div v-else class="d-flex justify-center mt-10 pt-10">
            <v-progress-circular indeterminate size="60"></v-progress-circular>
          </div>
        </v-card-text>
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
    };
  },
  methods: {
    add() {
      this.$store.commit("setLoading", true);
      if (this.isEdit) {
        this.$http.put("/statics/" + this.inputs.data.id, this.inputs).then(
          () => {
            this.$store.commit("setLoading", false);
            this.get();
          },
          (error) => {
            this.$store.commit("setLoading", false);
            console.log(error);
          }
        );
      } else {
        this.$http.post("/statics", this.inputs).then(() => {
          this.$router.push("/statics");
        });
      }
    },
    get() {
      this.$store.commit("setLoading", true);
      this.$http.get("/statics/" + this.$route.params.id).then(({ data }) => {
        this.inputs.data = data.data;
        this.text = data.content;
        this.$store.commit("setLoading", false);
      });
    },
  },
  mounted() {
    document.getElementsByClassName(
      "v-md-editor__left-area-title"
    )[0].innerHTML = "المحتوى";
    if (this.$route.params.id != undefined) {
      this.isEdit = true;
      this.get();
    }
  },
};
</script>
