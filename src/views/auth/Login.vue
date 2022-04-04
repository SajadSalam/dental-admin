<template>
  <div
    class="d-flex align-center justify-center"
    style="height: 100vh; width: 100%"
  >
    <v-card :loading="$store.state.loading" width="500">
      <v-card-title class="d-flex flex-column">
        <v-img contain src="../../assets/logo-dark.png" height="150"></v-img>
        <span class="mt-5"> تسجيل الدخول </span>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          @submit.prevent="submit()"
          lazy-validation
        >
          <v-text-field
            v-model="form.identifier"
            :rules="[$rules.required()]"
            outlined
            label="البريد الالكتروني او اسم المستخدم"
            required
          >
          </v-text-field>
          <v-text-field
            v-model="form.password"
            :rules="[$rules.required()]"
            label="كلمة المرور"
            type="password"
            outlined
            required
          >
          </v-text-field>
          <h3 class="error--text ml-2 mb-5" v-if="error">
            غير مخول بالدخول للنظام
          </h3>
          <v-btn block color="primary" :disabled="!valid" type="submit">
            تسجيل الدخول
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        identifier: "",
        password: "",
      },
      valid: false,
      error: false,
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate();
      if (this.valid) {
        this.$store.commit("setLoading", true);
        this.$http
          .post("/auth/local", {
            identifier: this.form.identifier,
            password: this.form.password,
          })
          .then((res) => {
            // console.log(res);
            if (res.status == 200) {
              this.error = false;
              this.$store.commit("setUserData", res.data);
              this.$router.push({ name: "dashboard-home" });
            } else {
              this.error = true;
              this.$store.commit("setLoading", false);
            }
          })
          .catch((err) => {
            console.log(err);
            this.error = true;
          })
          .finally(() => {
            this.$store.commit("setLoading", false);
          });
      }
    },
  },
};
</script>
