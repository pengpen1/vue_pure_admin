<script setup lang="ts">
import splitpane, { ContextProps } from "@/components/ReSplitPane";
import { reactive } from "vue";

defineOptions({
  name: "character"
});
const settingLR: ContextProps = reactive({
  minPercent: 20,
  defaultPercent: 40,
  split: "vertical"
});

const settingTB: ContextProps = reactive({
  minPercent: 20,
  defaultPercent: 40,
  split: "horizontal"
});
</script>

<template>
  <div class="character">
    <splitpane :splitSet="settingLR">
      <!-- #paneL 表示指定该组件为左侧面板 -->
      <template #paneL>
        <!-- 自定义左侧面板的内容 -->
        <div class="dv-a">英文大小写转换</div>
      </template>
      <!-- #paneR 表示指定该组件为右侧面板 -->
      <template #paneR>
        <!-- 再次将右侧面板进行拆分 -->
        <splitpane :splitSet="settingTB">
          <template #paneL>
            <div class="dv-b">json格式化</div>
          </template>
          <template #paneR>
            <div class="dv-c">路径转换</div>
          </template>
        </splitpane>
      </template>
    </splitpane>
  </div>
</template>

<style lang="scss" scoped>
.character {
  height: calc(100vh - 111px);
  background-color: #ffffff;

  .dv-a,
  .dv-b,
  .dv-c {
    width: 100%;
    height: 100%;
    line-height: 500px;
    color: rgba($color: dodgerblue, $alpha: 80%);
  }
}
</style>
