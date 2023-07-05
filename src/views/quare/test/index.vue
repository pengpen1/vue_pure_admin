<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from "vue";
import { ThreeJs } from "./hooks/useThree";
import { throttle } from "@/utils/utils";

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

// 根据前后键码计算出要旋转的弧度
const setRotation = (currentRotation, preRotation, rotationObj) => {
  let radian = ((preRotation - currentRotation) * Math.PI) / 2;
  const duration = 800;
  console.log("旋转", radian);
  if (radian) {
    // 这个设置是让旋转3*90°的行为转换为逆过来旋转90°，贴近生活
    if (Math.abs(preRotation - currentRotation) === 3) {
      radian = -(radian / 3);
    }
    tsetThree.setTweens(
      rotationObj,
      {
        y: rotationObj.y + radian
      },
      duration
    );
    return true;
  }
};
// keyDown事件
let preRotation = 40; //之前朝向的键码，默认朝下,40
let moveDistance = 1; // 每次移动的距离
let currentState = "Walking";
const keyDownHandle = throttle(event => {
  if (tsetThree) {
    switch (event.keyCode) {
      case 65:
      case 37: // 左箭头键
        if (currentState !== "Walking" && currentState !== "Running") {
          tsetThree.fadeToAction("Walking", 0.2);
        }
        // 成功进行转向动作就不进行移动动作了
        if (!setRotation(37, preRotation, tsetThree.model.rotation)) {
          tsetThree.setTweens(
            tsetThree.model.position,
            {
              x: tsetThree.model.position.x - moveDistance
            },
            1000
          );
        }
        preRotation = 37;
        // tsetThree.model.position.x -= moveDistance;
        break;
      case 87:
      case 38: // 上箭头键
        if (currentState !== "Walking" && currentState !== "Running") {
          tsetThree.fadeToAction("Walking", 0.2);
        }
        if (!setRotation(38, preRotation, tsetThree.model.rotation)) {
          tsetThree.setTweens(
            tsetThree.model.position,
            {
              z: tsetThree.model.position.z - moveDistance
            },
            1000
          );
        }
        preRotation = 38;
        // tsetThree.model.position.z -= moveDistance;
        break;
      case 68:
      case 39: // 右箭头键
        if (currentState !== "Walking" && currentState !== "Running") {
          tsetThree.fadeToAction("Walking", 0.2);
        }
        // 动画
        console.log("动画过渡向右");
        if (!setRotation(39, preRotation, tsetThree.model.rotation)) {
          tsetThree.setTweens(
            tsetThree.model.position,
            {
              x: tsetThree.model.position.x + moveDistance
            },
            1000
          );
        }
        preRotation = 39;
        // tsetThree.model.position.x += moveDistance;
        break;
      case 83:
      case 40: // 下箭头键
        if (currentState !== "Walking" && currentState !== "Running") {
          tsetThree.fadeToAction("Walking", 0.2);
        }
        if (!setRotation(40, preRotation, tsetThree.model.rotation)) {
          tsetThree.setTweens(
            tsetThree.model.position,
            {
              z: tsetThree.model.position.z + moveDistance
            },
            1000
          );
        }
        preRotation = 40;
        // tsetThree.model.position.z += moveDistance;
        break;
      case 32: // 空格
        tsetThree.fadeToAction("Jump", 0.2);
        currentState = "Jump";
        break;
      case 73: // i
        tsetThree.fadeToAction("Walking", 0.2);
        currentState = "Walking";
        moveDistance = 1;
        break;
      case 74: // j
        tsetThree.fadeToAction("Punch", 0.2);
        currentState = "Punch";
        break;
      case 75: // k
        tsetThree.fadeToAction("ThumbsUp", 0.2);
        currentState = "ThumbsUp";
        break;
      case 76: // l
        tsetThree.fadeToAction("Wave", 0.2);
        currentState = "Wave";
        break;
      case 79: // o
        tsetThree.fadeToAction("Running", 0.2);
        currentState = "Running";
        moveDistance = 4;
        break;
      default:
        break;
    }
  }
}, 800);

// 生命周期
onMounted(() => {
  tsetThree = new ThreeJs(containerEl.value);
  window.addEventListener("resize", resizeHandle);
  window.addEventListener("keydown", keyDownHandle);
  containerEl.value.addEventListener("mousedown", e => {
    // 左键0，滑轮1，右键2
    console.log("点击", e.button);
    switch (e.button) {
      case 0:
        tsetThree.fadeToAction("Punch", 0.2);
        currentState = "Punch";
        break;
      case 1:
        // 将月亮放置模型上方
        tsetThree.setTweens(
          tsetThree.pointLight.position,
          {
            x: tsetThree.model.position.x,
            y: tsetThree.model.position.y + 8,
            z: tsetThree.model.position.z
          },
          1000
        );
        break;
      case 2:
        // 向前方瞬移
        if (preRotation === 40) {
          tsetThree.setTweens(
            tsetThree.model.position,
            {
              z: tsetThree.model.position.z + 5
            },
            200
          );
        } else if (preRotation === 39) {
          tsetThree.setTweens(
            tsetThree.model.position,
            {
              x: tsetThree.model.position.x + 5
            },
            200
          );
        } else if (preRotation === 38) {
          tsetThree.setTweens(
            tsetThree.model.position,
            {
              z: tsetThree.model.position.z - 5
            },
            200
          );
        } else if (preRotation === 37) {
          tsetThree.setTweens(
            tsetThree.model.position,
            {
              x: tsetThree.model.position.x - 5
            },
            200
          );
        }
        break;
    }
  });
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
      <br />
      操作介绍：w、a、s、d移动，j攻击，k点赞，l打招呼<br />
      i走路模式，o跑步模式，左键攻击，右键瞬移，点击滚轮召唤月亮
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
