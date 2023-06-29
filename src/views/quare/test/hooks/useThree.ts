import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";

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
  orbitcontrols: any;
  dragControls: any;
  ambientLight: THREE.AmbientLight | null = null;
  mesh: THREE.Mesh | null = null;
  line: THREE.Line | null = null;
  pointLight: THREE.PointLight | null = null;
  container: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  init(): void {
    // 第一步新建一个场景
    this.setScene();
    this.setCamera();
    this.setRenderer();
    this.setOrbitControls();
    this.setCube();
    this.setPointLight();
    this.setDragControls();
    this.setLine();
    this.setModel();
    this.setGround();
    this.setLight({
      type: "DirectionalLight",
      color: "#ffffff",
      strength: 1,
      position: [0, 5, 10]
    });
    // 半球光
    // this.setLight({
    //   type: "HemisphereLight",
    //   color: "#ffffff",
    //   gradientColor: "#8d8d8d",
    //   strength: 3,
    //   position: [0, 20, 0]
    // });
    this.animate();
  }
  // 新建场景
  setScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#3C3D3E");
    // 设置场景颜色和雾气
    this.scene.fog = new THREE.Fog("#3C3D3E", 5, 100);
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
    // this.camera.position.z = 5;
    // this.camera.position.y = 2;
    // 相机将从位置指向视点，以此确定相机的朝向和观察范围。
    this.camera.position.set(-4, 5, 12); //位置，这个不能通过轨道控制器控制
    this.camera.lookAt(0, 2, 0); //视点，焦点，决定了相机所观察的场景中哪一部分是中心，设置了轨道控制器的焦点，这个焦点就失效了
  }

  // 新建轨道控制器
  setOrbitControls(): void {
    if (this.camera && this.renderer) {
      // 传的是相机，不是场景！
      this.orbitcontrols = new OrbitControls(
        this.camera,
        this.renderer.domElement
      );
      // 控制器只是改变相机的位置和旋转，而不会改变相机的视点（target）
      this.orbitcontrols.target.set(0, 0, 0); //焦点，围绕那个点旋转，缩放
      this.orbitcontrols.update();
      // this.orbitcontrols.rotateSpeed = -1; // 相机反向旋转
      this.orbitcontrols.enableZoom = true; // 启用缩放
      this.orbitcontrols.enablePan = false; //运行摄像机平移？
      this.orbitcontrols.enableDamping = true; //阻尼（惯性）？
    }
  }

  // 新建拖放控制器
  setDragControls(): void {
    if (this.scene && this.renderer && this.mesh) {
      // 创建光源放到着到立方体上位置上
      // const light = this.setLight({
      //   type: "DirectionalLight",
      //   color: "#ffffff",
      //   strength: 0.5,
      //   position: [-5, 4, 2]
      // });
      this.dragControls = new DragControls(
        [this.pointLight],
        this.camera,
        this.renderer.domElement
      );
      this.dragControls.addEventListener(
        "dragstart",
        function (event) {
          console.log("开始拖放", event);
          this.scene.background = new THREE.Color("#e0e0e0");
          this.scene.fog = new THREE.Fog("#e0e0e0", 5, 100);
          this.orbitcontrols.enabled = false;
          // this.render();
        }.bind(this)
      );

      this.dragControls.addEventListener(
        "dragend",
        function (event) {
          console.log("结束拖放", event);
          this.scene.background = new THREE.Color("#3C3D3E");
          this.scene.fog = new THREE.Fog("#3C3D3E", 5, 100);
          this.orbitcontrols.enabled = true;
          this.pointLight.position.set(
            event.object.position.x.toFixed(2),
            event.object.position.y.toFixed(2),
            event.object.position.z.toFixed(2)
          );
          this.render();
        }.bind(this)
      );
    }
  }
  // 设置渲染器
  setRenderer(): void {
    // antialias抗锯齿
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // this.renderer.useLegacyLights = false;
    // 设置阴影渲染器
    this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (this.container) {
      // 设置画布的大小
      this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight
      );
      //这里 其实就是canvas 画布  renderer.domElement
      this.container.appendChild(this.renderer.domElement);
    } else {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
    }
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
      // this.ambientLight = new THREE.AmbientLight(0xffffff); // 环境光
      // this.scene.add(this.ambientLight);
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

  // 创建立方体网格模型:几何体+图片材质
  setCube(): void {
    if (this.scene) {
      const geometry = new THREE.BoxGeometry(); //创建一个立方体几何对象Geometry
      // const material = new THREE.MeshBasicMaterial({ color: 0xff3200 }); //材质对象Material
      const texture = new THREE.TextureLoader().load("/assets/imgs/marble.jpg"); //首先，获取到纹理
      const material = new THREE.MeshBasicMaterial({ map: texture }); //然后创建一个phong材质来处理着色，并传递给纹理映射
      this.mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      this.mesh.position.set(-5, 4, 0.2);
      this.mesh.castShadow = true; //生成阴影
      this.scene.add(this.mesh); //网格模型添加到场景中
      this.render();
    }
  }

  // 创建点光源:类似灯泡
  setPointLight(): void {
    if (this.scene) {
      this.pointLight = new THREE.PointLight(0xffee88, 1, 100, 2);
      const bulbGeometry = new THREE.SphereGeometry(0.5, 16, 16);
      const bulbMat = new THREE.MeshStandardMaterial({
        emissive: 0xffffee,
        emissiveIntensity: 1,
        color: 0x000000
      });
      // 光源也是三维物体，所以可以添加子集
      this.pointLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
      this.pointLight.castShadow = true; //生成阴影
      this.pointLight.position.set(5, 4, 2);
      this.scene.add(this.pointLight); //网格模型添加到场景中
      this.render();
    }
  }

  // 创建场地网格模型:平面几何体+网孔材质
  setGround(): void {
    if (this.scene) {
      const geometry = new THREE.PlaneGeometry(100, 100); //创建一个平面几何对象Geometry
      const material = new THREE.MeshPhongMaterial({
        color: 0xcbcbcb
        // depthWrite: false //禁用深度写入
      }); //网格材质对象Material
      const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      mesh.receiveShadow = true; //响应阴影
      mesh.rotation.x = -Math.PI / 2; // 绕x轴旋转
      this.scene.add(mesh); //网格模型添加到场景中
      // 格子
      const grid = new THREE.GridHelper(100, 40, "#FF4500");
      // 坐标格是方形的，第一个参数确认长宽，第二个参数确认划分多少格
      // grid.material.opacity = 0.2;
      // grid.material.transparent = true;
      this.scene.add(grid);
      this.render();
    }
  }

  // 画线
  setLine(): void {
    if (this.scene) {
      const material = new THREE.LineBasicMaterial({ color: "#FF4500" });
      const points = [];
      // 这个10代表多少？10%？
      points.push(new THREE.Vector3(-10, 0, 0));
      points.push(new THREE.Vector3(0, 0, 0));
      points.push(new THREE.Vector3(0, 10, 0));
      points.push(new THREE.Vector3(0, 0, 0));
      points.push(new THREE.Vector3(0, 0, 10));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      this.line = new THREE.Line(geometry, material);
      this.scene.add(this.line); //网格模型添加到场景中
      this.render();
    }
  }

  // 模型
  setModel(): void {
    if (this.scene) {
      const loader = new GLTFLoader();
      loader.load(
        "/models/RobotExpressive.glb",
        function (gltf) {
          this.model = gltf.scene;
          // this.model.castShadow = true;
          // 使用模型的traverse方法遍历模型的所有子对象，并对其中的Mesh类型对象设置castShadow属性为true。
          this.model.traverse(function (object) {
            if (object.isMesh) object.castShadow = true;
          });
          // this.model.position.set(0, 2, 2);
          this.scene.add(this.model);
        }.bind(this),
        undefined,
        function (e) {
          console.error(e);
        }
      );
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
    if (this.mesh) {
      requestAnimationFrame(this.animate.bind(this));
      // 使模型绕着 X 轴旋转,0.01 是表示每一帧的旋转角度
      this.mesh.rotation.x += 0.01;
      this.mesh.rotation.y += 0.01;
      this.mesh.rotation.z += 0.01;
      // 更新控制器
      this.orbitcontrols.update();
      // 调用 render() 方法来进行场景的渲染
      this.render();
    }
  }
}
