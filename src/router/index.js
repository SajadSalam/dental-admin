import Vue from "vue";
import VueRouter from "vue-router";
// import { isElectron } from '../../utils'
import { isUserLoggedIn } from "@/libs/auth/utils";
Vue.use(VueRouter);
const routes = [
  { path: "/", redirect: { name: "subscriptions" } },

  {
    name: "subscriptions",
    path: "/subscriptions",
    component: () => import("@/views/subscriptions/Subscriptions.vue"),
    meta: {
      title: "المتدربين",
    },
  },
  {
    name: "subscription",
    path: "/subscriptions/:id",
    component: () => import("@/views/subscriptions/Subscription.vue"),
    meta: {
      title: "تفاصيل المتدرب",
    },
  },
  {
    name: "courses",
    path: "/courses",
    component: () => import("@/views/courses/Courses.vue"),
    meta: {
      title: "الكورسات",
    },
  },
  {
    name: "course",
    path: "/courses/:id",
    component: () => import("@/views/courses/Course.vue"),
    meta: {
      title: "تفاصيل الكورس",
    },
  },
  {
    name: "dynamic",
    path: "/dynamic",
    component: () => import("@/views/dynamics/Dynamics.vue"),
    meta: {
      title: "الاخبار والنشاطات",
    },
  },
  {
    name: "dynamic-detail",
    path: "/dynamic/:id",
    component: () => import("@/views/dynamics/DynamicDetail.vue"),
    meta: {
      title: "تفاصيل الخبر",
    },
  },
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/auth/Login.vue"),
    meta: {
      title: "تسجيل الدخول",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.name !== "login" && !isUserLoggedIn()) {
    return next({ name: "login" });
  }
  return next();
});
export default router;
