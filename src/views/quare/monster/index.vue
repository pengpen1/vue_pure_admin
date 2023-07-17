<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { ThreeJs } from "./hooks/useThree";

defineOptions({
  name: "monster"
});
// 容器与three实例
const containerEl = ref<HTMLElement>();
let tsetThree: any = null;

// 生命周期
onMounted(() => {
  tsetThree = new ThreeJs(containerEl.value);
});

onBeforeUnmount(() => {});
</script>

<template>
  <div class="monster">
    <h2 class="title">机器人大战怪兽</h2>
    <div ref="containerEl" class="containerEl" />
  </div>
</template>

<style lang="scss" scoped>
.monster {
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
