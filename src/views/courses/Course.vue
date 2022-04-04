<template>
  <div>
    <v-row>
      <v-col cols="12" md="9">
        <v-card v-if="!$store.state.loading" :loading="$store.state.loading">
          <v-card-title>
            تفاصيل الكورس {{ course.title }}
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-row>
              <template v-for="(field, key) in course">
                <v-col
                  cols="6"
                  :key="key"
                  v-if="
                    key != 'course' &&
                      key != 'images' &&
                      key != 'createdAt' &&
                      key != 'updatedAt' &&
                      key != 'publishedAt' &&
                      key != 'id' &&
                      key != 'status' &&
                      key != 'specialty'
                  "
                >
                  {{ addToEdit(key) }}
                  <v-text-field
                    :name="key"
                    :label="key"
                    v-model="course[key]"
                    outlined
                    hide-details
                  ></v-text-field>
                </v-col>
              </template>
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
      <v-col cols="12" md="3">
        <v-card>
          <v-card-title> </v-card-title>
          <v-card-text>
            <v-img
              contain
              :src="$service.url + course.images.data.url"
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
    };
  },
  methods: {
    addToEdit(key) {
      this.toEdit.push(key);
    },
    update() {
      this.$store.commit("setLoading", true);
      let data = {};
      this.toEdit.forEach((key) => {
        data[key] = this.course[key];
      });
      this.$http
        .put("/courses/" + this.course.id, {
          data,
        })
        .then(() => {
          this.getcourse();
        })
        .catch((e) => {
          this.$store.commit("setLoading", false);
          console.log(e);
        });
    },
    getcourse() {
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
        .then((res) => {
          console.log(res);
          this.course = res.data.data;
          this.$store.commit("setLoading", false);
        });
    },
  },
  created() {
    this.getcourse();
  },
};
</script>
