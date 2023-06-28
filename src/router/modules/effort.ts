export default {
  path: "/effort",
  redirect: "/effort/line",
  meta: {
    icon: "flag",
    title: "心之动力",
    // showLink: false,
    rank: 3
  },
  children: [
    {
      path: "/effort/line",
      name: "line",
      component: () => import("@/views/effort/line/index.vue"),
      meta: {
        title: "线路图"
      }
    },
    {
      path: "/effort/forecast",
      name: "forecast",
      component: () => import("@/views/effort/forecast/index.vue"),
      meta: {
        title: "未来预测"
      }
    },
    {
      path: "/effort/memory",
      name: "memory",
      component: () => import("@/views/effort/memory/index.vue"),
      meta: {
        title: "记忆卡"
      }
    }
  ]
} as RouteConfigsTable;
