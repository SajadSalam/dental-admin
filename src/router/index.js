import Vue from "vue";
import VueRouter from "vue-router";
// import { isElectron } from '../../utils'
import { isUserLoggedIn } from "@/libs/auth/utils";
Vue.use(VueRouter);
const routes = [
  { path: "/", redirect: { name: "subscriptions" } },
  {
    path: "/home",
    name: "dashboard-home",
    component: () => import("@/views/dashoard/Home.vue"),
    meta: {
      title: "الصفحة الرئيسية",
    },
  },
  {
    path: "/static",
    name: "static",
    component: () => import("@/views/static/Static.vue"),
    meta: {
      title: "الصفحات",
    },
  },
  {
    path: "/static/",
    name: "add-static",
    component: () => import("@/views/static/Add.vue"),
    meta: {
      title: "الصفحات",
    },
  },
  {
    path: "/static/:id",
    name: "static",
    component: () => import("@/views/static/Add.vue"),
    meta: {
      title: "تفاصيل الصفحة",
    },
  },
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
    name: "trainers",
    path: "/trainers",
    component: () => import("@/views/trainers/Trainers.vue"),
    meta: {
      title: "المدربين",
    },
  },
  {
    name: "trainer",
    path: "/trainers/:id",
    component: () => import("@/views/trainers/Trainer.vue"),
    meta: {
      title: "تفاصيل المدرب",
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
    name: "course-add",
    path: "/courses-add",
    component: () => import("@/views/courses/Course.vue"),
    meta: {
      title: "اضافة كورس",
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
    component: () => import("@/views/dynamics/Add.vue"),
    meta: {
      title: "تفاصيل الخبر",
    },
  },
  {
    name: "add-dynamic",
    path: "/dynamic/add",
    component: () => import("@/views/dynamics/Add.vue"),
    meta: {
      title: "اضافة خبر",
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
