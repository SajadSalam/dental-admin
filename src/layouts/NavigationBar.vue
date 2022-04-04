<template>
  <v-navigation-drawer
    v-model="$store.state.drawer"
    bottom
    floating
    width="255"
    app
    right
    class=""
    style="
      box-shadow: 0 0 15px 0 rgb(34 41 47 / 5%);
    "
  >
    <v-list nav class="text-center">
      <v-list-item>
        <v-list-item-title
          class="d-flex flex-column justify-center align-center"
        >
          <v-img cover src="../assets/logo-dark.png" class="mt-3" width="100%" contain height="150" alt="" />
      
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <v-list nav>
      <v-list-item
        v-for="item in items"
        class="white--text"
        :key="item.title"
        link
        :to="typeof item.route == 'string' ? { name: item.route } : item.route"
      >
        <v-list-item-icon>
          <v-icon class="">{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="">{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import Navigation from "../navigation";
export default {
  data() {
    return {
      items: Navigation,
      mini: true,
    };
  },
};
</script>
