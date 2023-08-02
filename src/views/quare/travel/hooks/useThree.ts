import * as THREE from "three";

type lightParams = {
  type?: string;
  color: string | number;
  gradientColor?: string | number;
  strength: number;
  position: number[];
};

export class ThreeJs {
  scene: THREE.Scene | null = null;
  camera: THREE.PerspectiveCamera | null = null;
  renderer: THREE.WebGLRenderer | null = null;
  ambientLight: THREE.AmbientLight | null = null;
  cylinder: THREE.Mesh | null = null;
  line: THREE.Line | null = null;
  container: HTMLElement | null = null;
  texture: THREE.Texture;
  animations: any;
  h = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  init(): void {
    // 实现思路：实现圆柱体，加上贴图，控制高度和位置使其占满屏幕并正对自己，使其旋转，设置贴图偏移量实现穿梭效果
    // 可选择是否要设置透明贴图，然后通过控制材质颜色来变色
    this.setScene();
    this.setCamera();
    this.setRenderer();
    this.setCylinder();
    this.setLight({
      type: "PointLight",
      color: "#ffffff",
      strength: 1,
      position: [0, 0, 500]
    });
    this.animate();
  }
  // 新建场景
  setScene(): void {
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color("#3C3D3E");
    // // 设置场景颜色和雾气
    // this.scene.fog = new THREE.Fog("#3C3D3E", 5, 100);
  }

  // 新建透视相机
  setCamera(): void {
    // 第二参数就是 长度和宽度比 默认采用浏览器  返回以像素为单位的窗口的内部宽度和高度
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container
        ? this.container.clientWidth / this.container.clientHeight
        : window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 500);
    this.camera.lookAt(this.scene.position); //视点，焦点，决定了相机所观察的场景中哪一部分是中心，设置了轨道控制器的焦点，这个焦点就失效了
  }

  // 设置渲染器
  setRenderer(): void {
    // antialias抗锯齿
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    if (this.container) {
      // 设置画布的大小
      this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight
      );
      //这里 其实就是canvas 画布  想想摄像机原理，场景是场景
      this.container.appendChild(this.renderer.domElement);
    } else {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
    }
  }

  // 添加圆柱体
  setCylinder(): void {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "/assets/imgs/travel/storm.jpg",
      (texture: THREE.Texture) => {
        this.texture = texture;
        // 重复方式为重复换行
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        // 决定纹理在表面的重复次数，两个方向分别表示U和V，如果重复次数在任何方向上设置了超过1的数值， 对应的Wrap需要设置Repeat相关属性
        texture.repeat.set(1, 2);
        //上圆半径、下圆半径、高、分段、是否去底
        const geometry = new THREE.CylinderGeometry(30, 50, 1000, 32, 32, true);
        const material = new THREE.MeshPhongMaterial({
          // 直接作为贴图不能控制颜色
          map: texture,
          // 设置透明，然后图片作为透明通道，就会根据不同像素的颜色来设置不同的透明度
          // transparent: true,
          // alphaMap: texture, //我的理解是向蒙版，黑色透明，白色不透明
          side: THREE.DoubleSide //双面都贴的意思
        });
        this.cylinder = new THREE.Mesh(geometry, material);
        this.cylinder.rotation.x = -Math.PI / 2;
        this.scene.add(this.cylinder);
      }
    );
  }

  // 设置环境光/平行光/
  setLight({
    type = "DirectionalLight",
    color,
    gradientColor,
    strength,
    position
  }: lightParams) {
    if (this.scene) {
      let light = null;
      if (type === "HemisphereLight") {
        light = new THREE.HemisphereLight(color, gradientColor, strength);
      } else {
        light = new THREE[type](color, strength);
        light.castShadow = true;
      }
      light.position.set(...position);
      this.scene.add(light);
      return light;
    }
  }

  // 渲染
  render(): void {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
  // 动画循环
  animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    if (this.cylinder) {
      // 因为在添加圆柱体时已经绕x轴旋转90°了，所以这里不是z而是y
      this.cylinder.rotation.y += 0.01;
    }
    if (this.texture) {
      // 设置垂直方向的起始偏移量
      this.texture.offset.y += 0.01;
      // 设置垂直方向的重复偏移量
      // this.texture.repeat.y = Math.sin(this.texture.offset.y);
      // this.h += 0.001;
      // if (this.h > 1) {
      //   this.h = 0;
      // }
      // this.cylinder.material.color.setHSL(this.h, 0.5, 0.5);
    }
    // 调用 render() 方法来进行场景的渲染
    this.render();
  }
}
