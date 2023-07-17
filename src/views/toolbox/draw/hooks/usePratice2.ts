// 画虚线
export const drawDashLine = (
  ctx: CanvasRenderingContext2D,
  color = "black"
) => {
  ctx.setLineDash([4, 16]);
  ctx.lineDashOffset = -17;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(100, 0);
  ctx.lineTo(100, 500);
  ctx.stroke();
};

// 线性渐变圆
export const drawGradientRect = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.arc(300, 300, 100, 0, 2 * Math.PI);
  // 创建径向渐变对象
  const gradient = ctx.createRadialGradient(300, 300, 20, 300, 300, 100);
  // gradient.addColorStop(0, "red");
  // gradient.addColorStop(0.5, "yellow");
  // gradient.addColorStop(1, "white");
  gradient.addColorStop(0.6, "yellow");
  gradient.addColorStop(0, "white");
  ctx.fillStyle = gradient;
  ctx.fill();
};

// 写字
export const drawWord = (ctx: CanvasRenderingContext2D, word: string) => {
  // 创建径向渐变对象
  const gradient = ctx.createRadialGradient(500, 50, 100, 100, 50, 100);
  gradient.addColorStop(0.6, "yellow");
  gradient.addColorStop(0, "white");
  ctx.fillStyle = gradient;
  ctx.font = "48px Arial";
  ctx.fillText(word, 100, 50);
};

// 旋转
export const rotation = (ctx: CanvasRenderingContext2D, angle: number) => {
  const radian = (Math.PI / 180) * angle;
  ctx.rotate(radian);
};
