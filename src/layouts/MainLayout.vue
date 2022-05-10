<template>
  <div>
    <v-app :style="colors">
      <navigation-bar v-if="$route.name !== 'login'" />
      <v-main :style="background">
        <v-snackbar
          top
          right
          :timeout="3000"
          :color="$store.state.snackbarColor"
          style="width: 100; max-width: 100%"
          v-model="snackbar"
        >
          <span
            v-if="
              $store.state.snackbarMessage !== '' &&
                $store.state.snackbarMessage !== null &&
                $store.state.snackbarMessage !== undefined
            "
            v-html="$store.state.snackbarMessage"
          ></span>
          <span v-else> Something went wrong! </span>
          <template v-slot:action="{ attrs }">
            <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
        <app-bar v-if="$route.name !== 'login'" />
        <div class="wrapper px-5 py-3">
          <transition name="scale" mode="out-in">
            <router-view />
          </transition>
        </div>
      </v-main>
    </v-app>
  </div>
</template>
<script>
import AppBar from "./AppBar.vue";
import NavigationBar from "./NavigationBar.vue";
export default {
  computed: {
    isLoggendIn() {
      return this.$store.state.accessToken !== null;
    },
    colors() {
      let style = this.$store.state.style;
      let ret = {};
      Object.keys(style.colors).forEach((key) => {
        ret[`--${key}-color`] = style.colors[key];
      });
      ret[`--list-background`] = `var(--${
        this.$store.state.dark ? "secondary" : "primary"
      }-color)`;
      return ret;
    },
    background() {
      // let style = this.$store.state.style;
      // if (style.colors.secondary !== undefined) {
      //   if (style.backType == "gradient") {
      //     return `background-image: linear-gradient(140deg,${style.colors.secondary} 17%,${style.colors.primary} 67%) !important;`;
      //   } else if (style.backType == "onlyPrimary") {
      //     return `background-color: ${style.colors.primary} !important;`;
      //   } else if (style.backType == "onlySecondary") {
      //     return `background-color: ${style.colors.secondary} !important;`;
      //   } else if (style.backType == "image") {
      //     return `background-image: url(${style.image}) !important; background-size: cover; `;
      //   } else {
      //     if(this.$store.state.dark == false){
      //       return `background-color: #F0F6FF !important;`;
      //     }
      //     return '';
      //   }

      // }
      if (this.$store.state.dark == false) {
        return `background-color: #f1f2f3 !important;`;
      }
      return "";
    },
  },
  components: {
    AppBar,
    NavigationBar,
  },
  data() {
    return {
      snackbar: false,
    };
  },
  watch: {
    "$store.state.snackbar"() {
      this.snackbar = this.$store.state.snackbar;
    },
    snackbar() {
      this.$store.commit("UPDATE_SNACKBAR", this.snackbar);
      if (!this.snackbar) {
        this.$store.commit("UPDATE_SNACKBAR_MESSAGE", "");
      }
    },
  },
};
</script>
<style>
body,
.v-application,
* {
  font-family: "Cairo", sans-serif !important;
  letter-spacing: 0 !important;
  /* transition: all 0.2s ease-in !important; */
}
.v-card {
  box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%) !important;
}
.shadow {
  box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%) !important;
}
.gradient {
  background-image: linear-gradient(
    -140deg,
    var(--secondary-color) 17%,
    var(--primary-color) 67%
  ) !important;
}
.v-list .v-list-item--active {
  background-color: var(--primary-color) !important;
  color: white !important;
  max-width: 100% !important;
}
.apexcharts-legend-text {
  font-family: "Cairo", sans-serif !important;
  margin: auto 10px !important;
}
</style>
<style lang="scss">
.theme--dark {
  .apexcharts-legend-text,
  .apexcharts-text {
    color: #fff !important;
  }
  .apexcharts-tooltip * {
    color: rgb(0, 0, 0) !important;
    direction: rtl !important;
    left: 0 !important;
    right: inherit;
  }
}
.v-select-list {
  .v-list-item--active * {
    color: #fff !important;
  }
}
</style>
