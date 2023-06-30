<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from "vue";
import { ThreeJs } from "./hooks/useThree";
defineOptions({
  name: "test"
});

// 容器与three实例
const containerEl = ref<HTMLElement>();
let tsetThree: any = null;

// resize事件
const resizeHandle = () => {
  console.log("resize");
  const width = containerEl.value
    ? containerEl.value.clientWidth
    : window.innerWidth;
  const height = containerEl.value
    ? containerEl.value.clientHeight
    : window.innerHeight;
  tsetThree.camera.aspect = width / height;
  tsetThree.camera.updateProjectionMatrix();
  tsetThree.renderer.setSize(width, height);
};

// keyDown事件
const moveDistance = 1; // 每次移动的距离
const keyDownHandle = event => {
  if (tsetThree) {
    switch (event.keyCode) {
      case 37: // 左箭头键
        // tsetThree.fadeToAction("Walking", 0.2);
        tsetThree.model.position.x -= moveDistance;
        break;
      case 38: // 上箭头键
        // tsetThree.fadeToAction("Jump", 0.2);
        tsetThree.model.position.z -= moveDistance;
        break;
      case 39: // 右箭头键
        // tsetThree.fadeToAction("Dance", 0.2);
        tsetThree.model.position.x += moveDistance;
        break;
      case 40: // 下箭头键
        //   tsetThree.fadeToAction("Idle", 0.2);
        tsetThree.model.position.z += moveDistance;
        break;
      default:
        break;
    }
  }
};

// 生命周期
onMounted(() => {
  tsetThree = new ThreeJs(containerEl.value);
  window.addEventListener("resize", resizeHandle);
  window.addEventListener("keydown", keyDownHandle);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeHandle);
  window.removeEventListener("keydown", keyDownHandle);
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
    top: 24px;
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
  // 状态下拉样式修改
  :deep(.lil-gui .widget select) {
    background-color: #ebe8b4;
    color: black;
  }
}
</style>
