<script setup lang="ts">
import splitpane, { ContextProps } from "@/components/ReSplitPane";
import { reactive, ref, computed } from "vue";
import { Delete, Star, StarFilled, Tools } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import Sort from "@iconify-icons/ep/sort";
import { ElMessage } from "element-plus";

import eache from "@/utils/eache";
import { unique } from "@/utils/utils";
import {
  toUpperCase,
  capitalizeWords,
  toConvertHump,
  toLowerCase,
  toUnderline,
  isUnderScored
} from "./utils/convert";
import { isHexadecimal, isRGB, hexToRgb, rgbToHex } from "./utils/colorConvert";

defineOptions({
  name: "character"
});
// 分割面板配置
const settingLR: ContextProps = reactive({
  minPercent: 20,
  defaultPercent: 46,
  split: "vertical"
});
const settingTB: ContextProps = reactive({
  minPercent: 32,
  defaultPercent: 40,
  split: "horizontal"
});
// ------------英文大小写转换-------------
// JSON.parse() 方法会将 JSON 字符串解析为 JavaScript 值。在解析过程中，该方法会根据字符串的内容自动判断并构造出对应的数据类型。
const isCopy = ref(
  eache.getItem("pure_is_copy")
    ? JSON.parse(eache.getItem("pure_is_copy"))
    : true
); //是否打开转换后默认复制
const textarea = ref("");
const tableData = reactive(
  eache.getItem("pure_favorites_list")
    ? JSON.parse(eache.getItem("pure_favorites_list"))
    : []
);
// 检测
const detect = (value = textarea.value) => {
  if (value === undefined || value === null || value === "") {
    ElMessage({
      showClose: true,
      message: "请在输入框写入单词再进行操作",
      duration: 2000
    });
    return false;
  }
  return true;
};
// 自动复制
const automaticCopy = (text, enable = true) => {
  if (enable) {
    navigator.clipboard.writeText(text);
    ElMessage({
      showClose: true,
      message: "内容已复制到剪贴板",
      duration: 2000,
      type: "success"
    });
  }
};

// type starItem = {
//   content: string;
//   date: String;
// };
const delimiters = [" ", "_", "-"];
// 相关事件
const textListeners = {
  // 大写
  capital: () => {
    console.log("点击了大写");
    if (detect()) {
      textarea.value = toUpperCase(textarea.value);
      automaticCopy(textarea.value, isCopy.value);
    }
  },
  // 小写
  lowerCase: () => {
    console.log("点击了小写");
    if (detect()) {
      textarea.value = toLowerCase(textarea.value);
      automaticCopy(textarea.value, isCopy.value);
    }
  },
  // 首字母大写
  capitalized: () => {
    console.log("点击了首字母大写");
    if (detect()) {
      // 多个单词
      for (let i = 0; i < delimiters.length; i++) {
        const delimiter = delimiters[i];
        if (textarea.value.indexOf(delimiter) !== -1) {
          // 分隔符采用第一个检测到的
          textarea.value = capitalizeWords(textarea.value, delimiter);
          return automaticCopy(textarea.value, isCopy.value);
        }
      }
      // 只有一个单词的情况
      textarea.value = capitalizeWords(textarea.value);
      automaticCopy(textarea.value, isCopy.value);
    }
  },
  // 下划线拼接
  underline: () => {
    console.log("点击了下划线拼接");
    if (detect()) {
      if (isUnderScored(textarea.value)) {
        // 是由下划线拼接的，改成由空字符串拼接
        textarea.value = toUnderline(textarea.value, "_", " ");
      } else {
        // 不是下划线拼接的，改成下划线拼接
        textarea.value = toUnderline(textarea.value);
      }
      automaticCopy(textarea.value, isCopy.value);
    }
  },
  // 驼峰互转
  convertHump: () => {
    console.log("点击了下划线拼接");
    if (detect()) {
      textarea.value = toConvertHump(textarea.value);
      automaticCopy(textarea.value, isCopy.value);
    }
  },
  // 清空
  empty: () => {
    textarea.value = "";
  },
  // 收藏
  star: () => {
    if (detect()) {
      const date = dayjs().format("YYYY.MM.DD HH:mm:ss");
      const content = textarea.value;
      tableData.push({ date, content });
      eache.setItem("pure_favorites_list", JSON.stringify(unique(tableData)));
      ElMessage({
        showClose: true,
        message: "内容已收藏",
        duration: 2000,
        type: "success"
      });
    }
  },
  // 改变是否复制
  changeCopyHandle: () => {
    eache.setItem("pure_is_copy", JSON.stringify(isCopy.value));
  }
};
// 列表事件
const textOperationsListeners = {
  copy: row => {
    console.log("点击了复制", row);
    if (row) {
      automaticCopy(row.content);
    }
  },
  display: row => {
    console.log("点击了陈列", row);
    if (row) {
      textarea.value = row.content;
    }
  },
  delete: row => {
    console.log("点击了删除", row.content);
    if (row) {
      const index = tableData.findIndex(item => item.content === row.content);
      if (index !== -1) {
        tableData.splice(index, 1);
        eache.setItem("pure_favorites_list", JSON.stringify(unique(tableData)));
        return ElMessage({
          showClose: true,
          message: "删除成功",
          duration: 2000,
          type: "success"
        });
      }
    }
    return ElMessage({
      showClose: true,
      message: "删除失败，请联系开发人员",
      duration: 2000,
      type: "error"
    });
  }
};

// ------------rgb-16进制转换-------------
const color_16 = ref("#409EFF");
const color_rgb = ref("rgb(16,16,16)");
const colorDialogVisible = ref(false);
const predefineColors = reactive(
  eache.getItem("pure_predefine_colors")
    ? JSON.parse(eache.getItem("pure_predefine_colors"))
    : [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585"
      ]
);
const colorsList = computed(() => {
  return predefineColors.map(item => {
    return { color: item };
  });
});
const isColorCopy = ref(
  eache.getItem("pure_color_copy")
    ? JSON.parse(eache.getItem("pure_color_copy"))
    : true
);
// 检测
const rgbDetect = (values: string[] | string) => {
  let result = true;
  if (Array.isArray(values)) {
    values.forEach(item => {
      if (item === undefined || item === null || item === "") result = false;
    });
  } else {
    if (values === undefined || values === null || values === "")
      result = false;
  }
  !result &&
    ElMessage({
      showClose: true,
      message: "请在输入框写入字符串再进行操作",
      duration: 2000
    });

  return result;
};

// 同步数据
const syncColorList = colorsList => {
  console.log(colorsList);
  if (Array.isArray(colorsList) && colorsList.length !== 0) {
    const result = colorsList.map(item => {
      return item.color;
    });
    predefineColors.splice(0);
    predefineColors.push(...result);
    eache.setItem(
      "pure_predefine_colors",
      JSON.stringify(unique(predefineColors))
    );
  }
};
const colorListeners = {
  // rgb转16进制
  convertHexadecimal: () => {
    console.log("点击rgb转16进制");
    if (isRGB(color_rgb.value)) {
      color_16.value = rgbToHex(color_rgb.value);
      automaticCopy(color_rgb.value, isColorCopy);
    }
  },
  // 16进制转rgb
  convertRgb: () => {
    console.log("点击了16进制转rgb");
    if (isHexadecimal(color_16.value)) {
      color_rgb.value = hexToRgb(color_16.value);
      automaticCopy(color_rgb.value, isColorCopy);
    }
  },
  // 清空
  empty: () => {
    color_16.value = "";
    color_rgb.value = "";
  },
  // 收藏
  star: () => {
    if (rgbDetect([color_rgb.value, color_16.value])) {
      predefineColors.push(color_16.value);
      eache.setItem(
        "pure_predefine_colors",
        JSON.stringify(unique(predefineColors))
      );
      ElMessage({
        showClose: true,
        message: "颜色已收藏到预设",
        duration: 2000,
        type: "success"
      });
    }
  },
  tool: () => {
    console.log("点击了设置");
    colorDialogVisible.value = true;
  },
  // 改变是否复制
  changeCopyHandle: () => {
    eache.setItem("pure_color_copy", JSON.stringify(isColorCopy.value));
  },
  colorChangeHandle: () => {
    color_rgb.value = hexToRgb(color_16.value);
    automaticCopy(color_rgb.value, isColorCopy);
  }
};
// 操作列事件
const colorOperationsListeners = {
  copy: row => {
    console.log("点击了copy", row);
    automaticCopy(row.color);
  },
  delete: row => {
    console.log("点击了delete", row);
    const index = colorsList.value.findIndex(item => item.color === row.color);
    if (index !== -1) {
      colorsList.value.splice(index, 1);
    }
    syncColorList(colorsList.value);
    ElMessage({
      showClose: true,
      message: "已删除该预设",
      duration: 2000,
      type: "success"
    });
  },
  save: row => {
    console.log("点击了save", row);
    syncColorList(colorsList.value);
    ElMessage({
      showClose: true,
      message: "已删除该预设",
      duration: 2000,
      type: "success"
    });
  }
};
</script>

<template>
  <div class="character">
    <splitpane :splitSet="settingLR">
      <!-- #paneL 表示指定该组件为左侧面板 -->
      <template #paneL>
        <!-- 自定义左侧面板的内容 -->
        <div class="word-conversion">
          <div class="title">
            <p>单词转换</p>
          </div>
          <el-input
            v-model="textarea"
            :rows="4"
            type="textarea"
            placeholder="请输入需要转换的单词，多个单词可用' '、'-'、'_'分隔"
          />
          <div class="control">
            <el-tooltip
              content="是否开启转换后默认复制"
              placement="bottom"
              effect="light"
            >
              <el-switch
                v-model="isCopy"
                class="copy-wrap"
                @change="textListeners.changeCopyHandle"
              />
            </el-tooltip>
            <el-button @click="textListeners.capital">转大写</el-button>
            <el-button @click="textListeners.lowerCase">转小写</el-button>
            <el-button @click="textListeners.capitalized">首字母大写</el-button>
            <el-tooltip
              content="空格分隔的单词转换成【小写单词】并用'_'拼接起来，可互转"
              placement="bottom"
              effect="light"
            >
              <el-button @click="textListeners.underline">下划线拼接</el-button>
            </el-tooltip>
            <el-tooltip
              content="将驼峰与通过空格分隔的单词转互转"
              placement="bottom"
              effect="light"
            >
              <el-button @click="textListeners.convertHump">驼峰转换</el-button>
            </el-tooltip>
            <el-tooltip content="清空" placement="bottom" effect="light">
              <el-button
                type="danger"
                :icon="Delete"
                circle
                @click="textListeners.empty"
              />
            </el-tooltip>
            <el-tooltip content="收藏" placement="bottom" effect="light">
              <el-button
                type="warning"
                :icon="Star"
                circle
                @click="textListeners.star"
              />
            </el-tooltip>
          </div>
          <!-- 收藏列表 -->
          <el-divider class="divider">
            <el-icon><star-filled /></el-icon>
          </el-divider>
          <p class="second-title">收藏列表</p>
          <el-table
            :data="tableData"
            style="width: 100%"
            class="star-list"
            max-height="700"
          >
            <el-table-column prop="date" label="Date" min-width="120" />
            <el-table-column prop="content" label="Content" min-width="120" />
            <el-table-column fixed="right" label="Operations" min-width="120">
              <template #default="{ row }">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="textOperationsListeners.copy(row)"
                  >copy</el-button
                >
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="textOperationsListeners.display(row)"
                  >display</el-button
                >
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="textOperationsListeners.delete(row)"
                  >delete</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <!-- #paneR 表示指定该组件为右侧面板 -->
      <template #paneR>
        <!-- 再次将右侧面板进行拆分 -->
        <splitpane :splitSet="settingTB">
          <template #paneL>
            <div class="rgb-conversion">
              <div class="title">
                <p>颜色转换</p>
              </div>
              <div class="rgb-content">
                <div class="left-side">
                  <div class="input-wrap">
                    <span>rgb:</span>
                    <el-input
                      v-model="color_rgb"
                      placeholder="请输入需要转换的rgb，回车即可进行转换"
                      @keyup.enter="colorListeners.convertHexadecimal"
                    />
                  </div>
                  <el-icon style="margin: 0.4em" :size="26"
                    ><IconifyIconOffline :icon="Sort"
                  /></el-icon>
                  <div class="input-wrap">
                    <span>16进制:</span>
                    <el-input
                      v-model="color_16"
                      placeholder="请输入需要转换的16进制，回车即可进行转换"
                      @keyup.enter="colorListeners.convertRgb"
                    />
                  </div>
                </div>
                <div class="right-side">
                  <el-color-picker
                    v-model="color_16"
                    size="large"
                    :predefine="predefineColors"
                    @change="colorListeners.colorChangeHandle"
                  />
                </div>
              </div>
              <div class="control">
                <el-tooltip
                  content="是否开启转换后默认复制"
                  placement="bottom"
                  effect="light"
                >
                  <el-switch
                    v-model="isColorCopy"
                    class="copy-wrap"
                    @change="colorListeners.changeCopyHandle"
                  />
                </el-tooltip>
                <el-tooltip
                  content="将输入的rgb转换成rgb，并在右侧展示效果"
                  placement="bottom"
                  effect="light"
                >
                  <el-button @click="colorListeners.convertHexadecimal"
                    >rgb转16进制</el-button
                  >
                </el-tooltip>
                <el-tooltip
                  content="将输入的16进制转换成rgb，并在右侧展示效果"
                  placement="bottom"
                  effect="light"
                >
                  <el-button @click="colorListeners.convertRgb"
                    >16进制转rgb</el-button
                  >
                </el-tooltip>
                <el-tooltip content="清空" placement="bottom" effect="light">
                  <el-button
                    type="danger"
                    :icon="Delete"
                    circle
                    @click="colorListeners.empty"
                  />
                </el-tooltip>
                <el-tooltip content="收藏" placement="bottom" effect="light">
                  <el-button
                    type="warning"
                    :icon="Star"
                    circle
                    @click="colorListeners.star"
                  />
                </el-tooltip>
                <el-tooltip content="设置" placement="bottom" effect="light">
                  <el-button
                    type="primary"
                    :icon="Tools"
                    circle
                    @click="colorListeners.tool"
                  />
                </el-tooltip>
              </div>
            </div>
          </template>
          <template #paneR>
            <div class="dv-c">路径转换</div>
          </template>
        </splitpane>
      </template>
    </splitpane>
    <!-- 弹窗 -->
    <el-dialog v-model="colorDialogVisible" title="颜色设置">
      <el-table
        :data="colorsList"
        table-layout="fixed"
        style="width: 90%; margin: 0 auto"
        class="star-list"
        max-height="500"
      >
        <el-table-column prop="color" label="Color" min-width="120" />
        <el-table-column label="Display">
          <template #default="{ row }">
            <el-color-picker v-model="row.color" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operations" min-width="120">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              @click="colorOperationsListeners.copy(row)"
              >copy</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="colorOperationsListeners.delete(row)"
              >delete</el-button
            >
            <el-tooltip
              content="是否保存颜色修改"
              placement="bottom"
              effect="light"
            >
              <el-button
                link
                type="primary"
                size="small"
                @click="colorOperationsListeners.save(row)"
                >save</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.character {
  height: calc(100vh - 111px);
  background-color: #ffffff;
  // 修改取色器样式
  :deep(.el-color-picker .el-color-picker__icon) {
    display: none;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
    color: black;
    margin-bottom: 12px;
  }
  .second-title {
    width: 100%;
    font-size: 14px;
    text-align: start;
    color: #464646;
    margin: 0px 0px 12px 0;
  }
  .dv-b,
  .dv-c {
    width: 100%;
    height: 100%;
    line-height: 500px;
    color: rgba($color: dodgerblue, $alpha: 80%);
  }
  .word-conversion {
    width: 100%;
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .control {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      row-gap: 12px;
      align-items: center;
      .copy-wrap {
        margin-right: 12px;
      }
    }
    .divider {
      margin-top: 28px;
    }
  }
  .rgb-conversion {
    width: 100%;
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    :deep(.el-color-picker--large .el-color-picker__trigger) {
      height: 80px;
      width: 80px;
    }
    .control {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      row-gap: 12px;
      align-items: center;
      .copy-wrap {
        margin-right: 12px;
      }
    }
    .rgb-content {
      width: 80%;
      display: flex;
      justify-content: center;
      align-items: center;
      .left-side {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .input-wrap {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            display: inline-block;
            text-align: right;
            margin-right: 8px;
            width: 70px;
          }
        }
      }
      .right-side {
        margin-left: 18px;
      }
    }
  }
}
</style>
