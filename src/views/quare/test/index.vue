<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ThreeJs } from "./hooks/useThree";
defineOptions({
  name: "test"
});

const containerEl = ref<HTMLElement>();
onMounted(() => {
  new ThreeJs(containerEl.value);
});
</script>

<template>
  <div class="test">
    <!-- (z-index实现文字) -->
    <h2 class="title">追光的少年</h2>
    <p class="describe">
      基础:理解坐标系、场景、相机、网格模型(立方体+材质)、光线、帧动画<br />
      进阶：控制器、粒子动效、阴影<br />
      晋级：场景交互、动态数据<br />
      晋升：建模<br />
    </p>
    <div ref="containerEl" class="containerEl" />
  </div>
</template>

<style lang="scss" scoped>
.test {
  .title {
    position: absolute;
    top: 20px;
    right: 50%;
    transform: translateX(50%);
    text-align: left;
    color: rgb(0, 0, 0);
    z-index: 800;
  }
  .describe {
    position: absolute;
    top: 40px;
    left: 50px;
    text-align: left;
    color: rgb(0, 0, 0);
    z-index: 800;
  }
  // 用container会和全局样式起冲突
  .containerEl {
    height: calc(100vh - 134px);
  }
}
</style>
