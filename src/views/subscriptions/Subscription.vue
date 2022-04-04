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
              <template v-for="(field, key) in sub">
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
                      key != 'status'
                  "
                >
                  {{ addToEdit(key) }}
                  <v-text-field
                    :name="key"
                    :label="key"
                    v-model="sub[key]"
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
        <v-card>
          <v-card-title>
            {{ sub.course.data.title }}
          </v-card-title>
          <v-card-text>
            <v-img
              contain
              :src="$service.url + sub.course.data.images.data.url"
              class="rounded"
            />
            <p class="mt-2">
              {{ sub.course.data.description }}
            </p>
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
      let data = {};
      this.toEdit.forEach((key) => {
        data[key] = this.sub[key];
      });
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
