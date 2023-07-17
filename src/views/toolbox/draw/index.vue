<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import {
  drawSnake,
  drawRect,
  drawLine,
  drawFace,
  drawBubble,
  drawTriangle
} from "./hooks/usePratice1";
import { drawDashLine, drawGradientRect, drawWord } from "./hooks/usePratice2";
import { Sphere } from "./hooks/usePratice3";

defineOptions({
  name: "draw"
});
const canvasEl = ref();
const canvasEl2 = ref();
const canvasEl3 = ref();
let offset = 0;
// 2D上下文
let ctx: CanvasRenderingContext2D | null = null;
let ctx2: CanvasRenderingContext2D | null = null;
let ctx3: CanvasRenderingContext2D | null = null;

// 动画
let animationKey: any = null;
const animation = () => {
  animationKey = requestAnimationFrame(() => {
    animation();
    offset += 0.5;
    drawSnake(ctx, canvasEl.value, offset, "red");
  });
};
onMounted(() => {
  ctx = canvasEl.value.getContext("2d"); //The canvas
  drawRect(ctx, 200, 100, 100, 100, "#000000");
  drawLine(ctx, 0, 0, 500, 300);
  drawLine(ctx, 0, 300, 500, 0, "red");
  drawFace(ctx);
  // 设置透明度值
  // ctx.globalAlpha = 0.2; //影响后面的透明度
  drawRect(ctx, 300, 100, 100, 100, "#000000");
  // 使用Path2D对象保存路径，并绘画
  const trianglePath = drawTriangle(ctx, 400, 150, 430, 180, 430, 120);
  ctx.fillStyle = "red";
  ctx.fill(trianglePath); // fill the path object.
  drawBubble(ctx);
  animation();

  // 测试虚线偏移量
  const canvas2: HTMLCanvasElement = document.getElementById(
    "testCanvas2"
  ) as HTMLCanvasElement;
  ctx2 = canvas2.getContext("2d") as CanvasRenderingContext2D;
  // ctx2.rotate(Math.PI / 2);
  ctx2.scale(0.5, 0.5);
  drawDashLine(ctx2, "red");
  drawGradientRect(ctx2);
  drawWord(ctx2, "当前只是学习canvas，绘图功能待定");

  // 高级动画
  ctx3 = canvasEl3.value.getContext("2d");
  const sphere = new Sphere(ctx3, canvasEl3.value);
  sphere.init();
});
onUnmounted(() => {
  cancelAnimationFrame(animationKey);
});
</script>

<template>
  <div class="draw">
    <div class="top_content">
      <canvas width="500" height="300" id="testCanvas" ref="canvasEl" />
      <canvas width="500" height="300" id="testCanvas3" ref="canvasEl3" />
    </div>
    <canvas width="1000" height="500" id="testCanvas2" ref="canvasEl2" />
  </div>
</template>

<style lang="scss" scoped>
.draw {
  background-color: #fff;
  .top_content {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    canvas {
      border: 1px solid black;
      background-color: #d6f7c9;
    }
  }
  #testCanvas2 {
    margin: 10px auto;
    border: 1px solid black;
    background-color: #d6f7c9;
  }
}
</style>
