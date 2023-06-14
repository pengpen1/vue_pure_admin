export default {
  path: "/toolbox",
  redirect: "/toolbox/character",
  meta: {
    icon: "lollipop",
    title: "工具箱",
    // showLink: false,
    rank: 1
  },
  children: [
    {
      path: "/toolbox/character",
      name: "character",
      component: () => import("@/views/toolbox/character/character.vue"),
      meta: {
        title: "字符串格式化"
      }
    },
    {
      path: "/toolbox/draw",
      name: "draw",
      component: () => import("@/views/toolbox/draw/character.vue"),
      meta: {
        title: "绘图"
      }
    },
    {
      path: "/toolbox/degraded",
      name: "degraded",
      component: () => import("@/views/toolbox/degraded/degraded.vue"),
      meta: {
        title: "图片降质"
      }
    }
  ]
} as RouteConfigsTable;
