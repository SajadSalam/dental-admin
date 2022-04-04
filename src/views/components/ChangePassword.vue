<template>
  <v-dialog persistent v-model="$store.state.passwordDialog" width="650">
    <v-card :loading="$store.state.loading" outlined>
      <v-card-title class="text-h5 my-3">
        تغيير كلمة المرور لـ <strong>{{ $store.state.user.fullName }}</strong>
        <v-spacer></v-spacer>
        <v-btn
          @click="$store.commit('togglePasswordDialog')"
          text
          color="error"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-form ref="changePassword" v-model="vaild">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                hide-detials="auto"
                outlined
                v-model="inputs.newPassword"
                :type="isPasswordShow ? 'text' : 'password'"
                :append-icon="isPasswordShow ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="isPasswordShow = !isPasswordShow"
                label="كلمة السر"
                :rules="[$rules.required()]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                hide-detials="auto"
                outlined
                v-model="inputs.confirmPassword"
                :type="isPasswordShow ? 'text' : 'password'"
                :append-icon="isPasswordShow ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="isPasswordShow = !isPasswordShow"
                label="تأكيد كلمة السر"
                :rules="[ v => (v && v == inputs.newPassword) || 'كلمات المرور لا تتطابقان']"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="$store.commit('users/toggleDialog', 'addAccounts')"
          >
            إلغاء
          </v-btn>
          <v-btn color="primary" :disabled="!vaild" @click="changePassword()">
            حفظ
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  computed: {
    isEdit() {
      return this.$store.state.users.isEdit;
    },
    item: {
      get() {
        return this.$store.state.users.item;
      },
    },
  },
  data() {
    return {
      date: false,
      vaild: false,
      isPasswordShow: false,
      file: null,
      types: [],
      inputs: {
        newPassword: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    changePassword() {
      this.$store.commit("setLoading", true);
      this.$http
        .post("/auth/changePasswordByAdmin/" + this.$store.state.user.id, this.inputs)
        .then(() => {
          this.$store.commit("setLoading", false);
          this.$store.commit("togglePasswordDialog");
          this.$emit("refresh", true);
        });
    },
  },
  created() {},
  watch: {
    "$store.state.passwordDialog"() {
      if (this.$store.state.passwordDialog == false) {
        this.$refs.changePassword.reset();
      }
    },
  },
};
</script>
<style scoped>
.col-xl,
.col-xl-auto,
.col-xl-12,
.col-xl-11,
.col-xl-10,
.col-xl-9,
.col-xl-8,
.col-xl-7,
.col-xl-6,
.col-xl-5,
.col-xl-4,
.col-xl-3,
.col-xl-2,
.col-xl-1,
.col-lg,
.col-lg-auto,
.col-lg-12,
.col-lg-11,
.col-lg-10,
.col-lg-9,
.col-lg-8,
.col-lg-7,
.col-lg-6,
.col-lg-5,
.col-lg-4,
.col-lg-3,
.col-lg-2,
.col-lg-1,
.col-md,
.col-md-auto,
.col-md-12,
.col-md-11,
.col-md-10,
.col-md-9,
.col-md-8,
.col-md-7,
.col-md-6,
.col-md-5,
.col-md-4,
.col-md-3,
.col-md-2,
.col-md-1,
.col-sm,
.col-sm-auto,
.col-sm-12,
.col-sm-11,
.col-sm-10,
.col-sm-9,
.col-sm-8,
.col-sm-7,
.col-sm-6,
.col-sm-5,
.col-sm-4,
.col-sm-3,
.col-sm-2,
.col-sm-1,
.col,
.col-auto,
.col-12,
.col-11,
.col-10,
.col-9,
.col-8,
.col-7,
.col-6,
.col-5,
.col-4,
.col-3,
.col-2,
.col-1 {
  padding-top: 5px !important;
  padding-bottom: 5px !important;
  margin: 0px !important;
}
.v-input__slot {
  margin-bottom: 0px !important;
  padding: 0px !important;
}
</style>