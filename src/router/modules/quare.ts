export default {
  path: "/quare",
  redirect: "/quare/test",
  meta: {
    icon: "moonNight",
    title: "3D广场",
    // showLink: false,
    rank: 2
  },
  children: [
    {
      path: "/quare/test",
      name: "test",
      component: () => import("@/views/quare/test/index.vue"),
      meta: {
        title: "实验场地"
      }
    },
    {
      path: "/quare/world",
      name: "world",
      component: () => import("@/views/quare/world/index.vue"),
      meta: {
        title: "我的世界"
      }
    },
    {
      path: "/quare/monster",
      name: "monster",
      component: () => import("@/views/quare/monster/index.vue"),
      meta: {
        title: "怪兽"
      }
    },
    {
      path: "/quare/travel",
      name: "travel",
      component: () => import("@/views/quare/travel/index.vue"),
      meta: {
        title: "时空穿梭"
      }
    }
  ]
} as RouteConfigsTable;
