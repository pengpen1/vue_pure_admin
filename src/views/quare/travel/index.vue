<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ThreeJs } from "./hooks/useThree";

defineOptions({
  name: "travel"
});
const containerEl = ref();

onMounted(() => {
  // 初始化threejs
  new ThreeJs(containerEl.value);
});
</script>

<template>
  <div class="travel">
    <h2 class="title">时空旅行</h2>
    <div ref="containerEl" class="containerEl" />
  </div>
</template>

<style lang="scss" scoped>
.travel {
  .title {
    position: absolute;
    top: 24px;
    right: 50%;
    transform: translateX(50%);
    text-align: left;
    color: rgb(0, 0, 0);
    z-index: 800;
  }
  .containerEl {
    height: calc(100vh - 134px);
  }
}
</style>
