export class Sphere {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  animation: any;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  running: boolean;

  constructor(
    ctx,
    canvas,
    x = 100,
    y = 100,
    radius = 25,
    vx = 5,
    vy = 1,
    color = "black"
  ) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = color;
    this.running = false;
  }
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
  // 利用透明矩形制作拖尾效果
  clear() {
    this.ctx.fillStyle = "rgba(255,255,255,0.3)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  action() {
    this.clear();
    this.draw();
    this.x += this.vx;
    this.y += this.vy;

    if (this.y + this.vy > this.canvas.height || this.y + this.vy < 0) {
      this.vy = -this.vy;
    }
    if (this.x + this.vx > this.canvas.width || this.x + this.vx < 0) {
      this.vx = -this.vx;
    }

    this.animation = window.requestAnimationFrame(this.action.bind(this));
  }
  init() {
    this.draw();
    this.canvas.addEventListener(
      "mousemove",
      function (e) {
        if (!this.running) {
          this.clear();
          this.x = e.offsetX;
          this.y = e.offsetY;
          this.draw();
        }
      }.bind(this)
    );

    this.canvas.addEventListener(
      "click",
      function () {
        if (!this.running) {
          this.animation = window.requestAnimationFrame(this.action.bind(this));
          this.running = true;
        }
      }.bind(this)
    );

    this.canvas.addEventListener(
      "mouseout",
      function () {
        window.cancelAnimationFrame(this.animation);
        this.running = false;
      }.bind(this)
    );
  }
}
