import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import TWEEN from "@tweenjs/tween.js";

const api = { state: "Walking" };
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
  clock: THREE.Clock | null;
  orbitcontrols: any;
  dragControls: any;
  ambientLight: THREE.AmbientLight | null = null;
  mesh: THREE.Mesh | null = null;
  line: THREE.Line | null = null;
  pointLight: THREE.PointLight | null = null;
  container: HTMLElement | null = null;
  model: any;
  animations: any;
  stats: any;
  mixer: any;
  emoteFolder: any;
  actions: any;
  activeAction: any;
  previousAction: any;

  constructor(container: HTMLElement) {
    this.container = container;
    this.clock = new THREE.Clock();
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
    // this.setLine();
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
    this.setStats();
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
      this.pointLight = new THREE.PointLight("#ffffff", 1, 100, 2);
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
          this.animations = gltf.animations;
          // this.model.castShadow = true;
          // 使用模型的traverse方法遍历模型的所有子对象，并对其中的Mesh类型对象设置castShadow属性为true。
          this.model.traverse(function (object) {
            if (object.isMesh) object.castShadow = true;
          });
          // this.model.position.set(0, 2, 2);
          this.scene.add(this.model);
          // GUI
          this.setGUI(this.model, this.animations);
        }.bind(this),
        undefined,
        function (e) {
          console.error(e);
        }
      );
    }
  }

  // 帧率统计
  setStats(): void {
    if (this.container) {
      this.stats = new Stats();
      //设置统计模式
      this.stats.setMode(0); // 0: fps帧率, 1: ms 渲染时间, 2: mb内存使用量
      //统计信息显示在左上角
      this.stats.domElement.style.position = "absolute";
      this.stats.domElement.style.left = "24px";
      this.stats.domElement.style.right = "unset";
      this.stats.domElement.style.top = "unset";
      this.stats.domElement.style.bottom = "24px";
      this.stats.domElement.addEventListener("mousedown", e => {
        e.stopPropagation();
      });
      this.container.appendChild(this.stats.dom);
    }
  }

  // 新建操作UI
  setGUI(model, animations): void {
    const states = [
      "Idle",
      "Walking",
      "Running",
      "Dance",
      "Death",
      "Sitting",
      "Standing"
    ];
    const emotes = ["Jump", "Yes", "No", "Wave", "Punch", "ThumbsUp"];

    const gui = new GUI();
    gui.domElement.style.right = "24px";
    gui.domElement.style.top = "110px";
    gui.domElement.addEventListener("mousedown", e => {
      e.stopPropagation();
    });
    this.container.appendChild(gui.domElement);
    // 建立动画混合器
    this.mixer = new THREE.AnimationMixer(model);
    this.actions = {};
    // console.log("animations", animations);
    for (let i = 0; i < animations.length; i++) {
      // 遍历，拿到所有的动画剪辑
      const clip = animations[i];
      // 创建动画操作
      const action = this.mixer.clipAction(clip);
      // 存储动画操作
      this.actions[clip.name] = action;

      if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
        // 对特定动画操作进行属性设置
        action.clampWhenFinished = true; //播放完后保留在最后一个关键帧，而不是回到起始状态
        action.loop = THREE.LoopOnce; //表示动画只播放一次
      }
    }

    // states
    // 建立文件夹
    const statesFolder = gui.addFolder("States");
    // state名字是可以换的
    const clipCtrl = statesFolder.add(api, "state").options(states);
    clipCtrl.onChange(
      function () {
        this.fadeToAction(api.state, 0.5);
      }.bind(this)
    );
    statesFolder.close();

    // emotes
    this.emoteFolder = gui.addFolder("Emotes");

    for (let i = 0; i < emotes.length; i++) {
      // 模样回调
      this.createEmoteCallback(emotes[i]);
    }
    // open默认展开，close默认折叠
    // this.emoteFolder.open();
    this.emoteFolder.close();

    // expressions
    const face = model.getObjectByName("Head_4"); //根据名称查找和获取模型中的一个子对象
    const expressions = Object.keys(face.morphTargetDictionary); //获取所有表情
    const expressionFolder = gui.addFolder("Expressions");

    for (let i = 0; i < expressions.length; i++) {
      // 参数：被控制的对象（数组）,控制选项对应的数组索引,表示面部表情权重的最小值,表情权重的最大值,表示面部表情权重的步长
      expressionFolder
        .add(face.morphTargetInfluences, i, 0, 1, 0.01)
        .name(expressions[i]);
    }
    // 默认播放Dance
    this.activeAction = this.actions["Walking"];
    this.activeAction.play();
    expressionFolder.open();
  }
  // 创建动作回调
  createEmoteCallback(name) {
    // 绑定对应事件到api
    api[name] = function () {
      this.fadeToAction(name, 0.2);
      this.mixer.addEventListener("finished", this.restoreState.bind(this));
    }.bind(this);
    // 创建交互按钮
    this.emoteFolder.add(api, name);
  }

  // 还原状态
  restoreState() {
    this.mixer.removeEventListener("finished", this.restoreState);
    // 总是还原回当前的state
    this.fadeToAction(api.state, 0.2);
  }

  // 实现现动画之间的平滑过渡
  fadeToAction(name, duration): void {
    this.previousAction = this.activeAction;
    this.activeAction = this.actions[name];

    // 淡出之前的动画
    if (this.previousAction !== this.activeAction) {
      this.previousAction.fadeOut(duration);
    }

    // 淡入当前动画
    this.activeAction
      .reset() //重置状态
      .setEffectiveTimeScale(1) //设置时间比例，值为0时会使动画暂停。值为负数时动画会反向执行。默认值是1
      .setEffectiveWeight(1) //权重，动作的影响程度 (取值范围[0, 1]). 0 (无影响)到1（完全影响）之间的值可以用来混合多个动作。默认值是1
      .fadeIn(duration)
      .play();
  }

  // 增加tween缓动效果
  setTweens(obj, newObj, duration = 1500) {
    const ro = new TWEEN.Tween(obj); //创建tween动画实例
    ro.to(newObj, duration); //变化后的对象以及动画持续时间
    ro.easing(TWEEN.Easing.Linear.None); //动画缓动函数
    ro.onUpdate(function () {
      // console.log(obj);
    }); //执行回调
    ro.start();
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
      // 使网格模型绕着 X 轴旋转,0.01 是表示每一帧的旋转角度
      if (this.mesh) {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
        this.mesh.rotation.z += 0.01;
      }

      // 更新轨道控制器
      if (this.orbitcontrols) {
        this.orbitcontrols.update();
      }
      // 统计 stats 对象画面何时被重新渲染，需要在重新渲染时调用 stats.update()
      if (this.stats) {
        this.stats.update();
      }
      //获取上一帧到当前帧的时间差;
      const dt = this.clock.getDelta();

      // 动画混合器平滑的更新和混合动画
      if (this.mixer) this.mixer.update(dt);

      // 更新tween缓动
      TWEEN.update();

      // 调用 render() 方法来进行场景的渲染
      this.render();
    }
  }
}
