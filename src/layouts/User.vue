<template>
  <div>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn  color="primary" x-large text v-bind="attrs" v-on="on">
          <v-icon>mdi-account</v-icon>
          <label> {{$store.state.userData.user.username}}  </label>
        </v-btn>
      </template>
      <v-list>
        <!-- <v-list-item> -->
          <!-- <v-btn text><v-icon>mdi-logout</v-icon>الاعدادات</v-btn> -->
        <!-- </v-list-item> -->
        <v-list-item>
          <v-btn @click="logout()" text><v-icon>mdi-logout</v-icon>تسجيل خروج</v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
export default {
  methods: {
    logout() {
      this.$store.commit('setUserData', null)
      this.$router.push('/login');
    }
  }
}
</script>