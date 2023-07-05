<script setup lang="ts">
import { onMounted, ref } from "vue";
defineOptions({
  name: "draw"
});
const canvasEl = ref();
let offset = 0;
// 2D上下文
let ctx = null;
// 画矩形
const drawRect = (ctx, x, y, width, height, color) => {
  ctx.fillStyle = color; //不设置默认黑色
  ctx.fillRect(x, y, width, height);
  ctx.clearRect(x + 20, y + 20, 60, 60); //通过设置透明清空区域
  ctx.strokeRect(x + 40, y + 40, 20, 20); //描边矩形
};
// 画线
const drawLine = (ctx, x1, y1, x2, y2, color = "black") => {
  ctx.beginPath(); // start a new path
  ctx.moveTo(x1, y1); // move to (x1,y1)
  ctx.lineTo(x2, y2); // line to (x2,y2)
  ctx.closePath();
  ctx.strokeStyle = color; // stroke color set later in draw function.
  ctx.stroke();
};
// 画笑脸
const drawFace = (ctx, color = "blue") => {
  // moveTo就是移动笔触，想想你在画板上作画的样子
  ctx.beginPath();
  // ctx.lineWidth = 4;
  ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // 绘制
  ctx.moveTo(110, 75);
  ctx.arc(75, 75, 35, Math.PI / 4, -Math.PI * 1.25, false); // 口 (顺时针)
  ctx.moveTo(65, 65);
  ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // 左眼
  ctx.moveTo(95, 65);
  ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // 右眼
  ctx.strokeStyle = color; // stroke color set later in draw function.
  ctx.stroke();
};

// 画三角形
const drawTriangle = (ctx, x1, y1, x2, y2, x3, y3, color = "black") => {
  // ctx.beginPath();
  const trianglePath = new Path2D();
  trianglePath.moveTo(x1, y1); // move to
  trianglePath.lineTo(x2, y2);
  trianglePath.lineTo(x3, y3);
  ctx.fillStyle = color;
  ctx.fill();
  return trianglePath;
};

// 画气泡框
const drawBubble = (ctx, color = "black") => {
  ctx.beginPath();
  ctx.moveTo(75, 25);
  ctx.quadraticCurveTo(25, 25, 25, 62.5);
  ctx.quadraticCurveTo(25, 100, 50, 100);
  ctx.quadraticCurveTo(50, 120, 30, 125);
  ctx.quadraticCurveTo(60, 120, 65, 100);
  ctx.quadraticCurveTo(125, 100, 125, 62.5);
  ctx.quadraticCurveTo(125, 25, 75, 25);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.stroke();
};

// 画蚂蚁线
const drawSnake = (ctx, canvasEl, color = "black") => {
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  ctx.setLineDash([4, 2]);
  ctx.lineDashOffset = -offset;
  ctx.strokeStyle = color;
  ctx.strokeRect(10, 10, 100, 100);
};
// 动画
const animation = () => {
  requestAnimationFrame(() => {
    animation();
    offset += 0.5;
    drawSnake(ctx, canvasEl.value, "red");
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
});
</script>

<template>
  <div class="draw">
    <h2>绘图</h2>
    <canvas width="500" height="300" id="testCanvas" ref="canvasEl" />
  </div>
</template>

<style lang="scss" scoped>
.draw {
  #testCanvas {
    margin: 50px auto;
    border: 1px solid black;
    background-color: #d6f7c9;
  }
}
</style>
