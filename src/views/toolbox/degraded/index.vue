<script setup lang="ts">
// import { PrismComponent } from "vue-prism-component";
import Prism from "prismjs";
// import "prismjs/themes/prism.css";
// import "prismjs/themes/prism-twilight.min.css";
import "prismjs/components/prism-javascript";
import { onMounted } from "vue";
defineOptions({
  name: "degraded"
});
onMounted(() => {
  Prism.highlightAll();
});
</script>

<template>
  <div class="degraded">
    <h2>图片降质</h2>
    <!-- <PrismComponent language="javascript">
      const greeting = "Hello, World!"; console.log(greeting);
    </PrismComponent> -->
    <div class="code-content">
      <pre>
         <code class="language-js line-numbers" >
    tableProps: {
      data: [
        {
          name: "number-style",
          desc: [{ text: "每个数字的 style 配置" }],
          type: "object",
          optionValue: "—",
          defaultValue: "—",
        },
        {
          name: "number",
          desc: [{ text: "数字" }],
          type: "number | string",
          optionValue: "—",
          defaultValue: "—",
        },
        {
          name: "delay",
          desc: [{ text: "每个数字动画延时的时间" }],
          type: "number",
          optionValue: "—",
          defaultValue: "100",
        },
        {
          name: "max-length",
          desc: [{ text: "最大展示的数字长度" }],
          type: "number",
          optionValue: "—",
          defaultValue: "-",
        },
        {
          name: "duration",
          desc: [{ text: "动画时长" }],
          type: "number",
          optionValue: "—",
          defaultValue: "1",
        },
        {
          name: "height",
          desc: [{ text: "每个数字的滚动高度" }],
          type: "number",
          optionValue: "—",
          defaultValue: "40",
        },
        {
          name: "default",
          desc: [{ text: "初始化默认占位字符" }],
          type: "string",
          optionValue: "—",
          defaultValue: "0",
        },
        {
          name: "init-speed",
          desc: [{ text: "初始化动画速度" }],
          type: "string",
          optionValue: "fast,slow",
          defaultValue: "fast",
        },
        {
          name: "refresh-speed",
          desc: [{ text: "数字变化时重新渲染的动画速度" }],
          type: "string",
          optionValue: "fast,slow",
          defaultValue: "slow",
        },
      ],
    },
         </code>
      </pre>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.degraded {
  .code-content {
    width: 800px;
    position: relative;
    pre {
      width: 100%;
    }
    .code-toolbar > .toolbar {
      right: 0.5em;
    }
  }
  pre[class*="language-"].line-numbers {
    padding-left: unset;
  }
  // mac风格
  pre {
    overflow: hidden !important;
    code {
      width: 100%;
      display: inline-block;
      padding-bottom: 12px;
      position: relative;
      top: 12px;
    }
    &::before {
      content: "";
      position: absolute;
      background: red;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      top: 10px;
      left: 15px;
      transform: translate(-50%);
    }
    &::after {
      content: "";
      position: absolute;
      background: limegreen;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      top: 10px;
      left: 30px;
      transform: translate(-50%);
    }
  }
}
</style>
