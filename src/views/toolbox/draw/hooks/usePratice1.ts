// 画矩形
export const drawRect = (ctx, x, y, width, height, color) => {
  ctx.fillStyle = color; //不设置默认黑色
  ctx.fillRect(x, y, width, height);
  ctx.clearRect(x + 20, y + 20, 60, 60); //通过设置透明清空区域
  ctx.strokeRect(x + 40, y + 40, 20, 20); //描边矩形
};
// 画线
export const drawLine = (ctx, x1, y1, x2, y2, color = "black") => {
  ctx.beginPath(); // start a new path
  ctx.setLineDash([6, 4]);
  ctx.lineDashOffset = 6;
  ctx.moveTo(x1, y1); // move to (x1,y1)
  ctx.lineTo(x2, y2); // line to (x2,y2)
  ctx.closePath();
  ctx.strokeStyle = color; // stroke color set later in draw function.
  ctx.stroke();
};
// 画笑脸
export const drawFace = (ctx, color = "blue") => {
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
export const drawTriangle = (ctx, x1, y1, x2, y2, x3, y3, color = "black") => {
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
export const drawBubble = (ctx, color = "black") => {
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
export const drawSnake = (ctx, canvasEl, offset, color = "black") => {
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  ctx.setLineDash([4, 2]);
  ctx.lineDashOffset = -offset;
  ctx.strokeStyle = color;
  ctx.strokeRect(10, 10, 100, 100);
};
