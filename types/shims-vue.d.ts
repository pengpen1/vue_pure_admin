declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.scss" {
  const scss: Record<string, string>;
  export default scss;
}

declare module "@types/three";
declare module "three/addons/loaders/GLTFLoader.js";
declare module "three/addons/controls/OrbitControls.js";
declare module "three/addons/controls/DragControls.js";
