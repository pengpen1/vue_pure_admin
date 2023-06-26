<script setup lang="ts">
import splitpane, { ContextProps } from "@/components/ReSplitPane";
import { Delete, Star, StarFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import eache from "@/utils/eache";
import {
  toUpperCase,
  capitalizeWords,
  toConvertHump,
  toLowerCase,
  toUnderline
} from "./utils/convert";
import dayjs from "dayjs";
import { reactive, ref } from "vue";

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
  minPercent: 20,
  defaultPercent: 40,
  split: "horizontal"
});
// 英文大小写转换
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
const automaticCopy = (text = textarea.value) => {
  if (isCopy.value) {
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
const textListeners = {
  // 大写
  capital: () => {
    console.log("点击了大写");
    if (detect()) {
      textarea.value = toUpperCase(textarea.value);
      automaticCopy();
    }
  },
  // 小写
  lowerCase: () => {
    console.log("点击了小写");
    if (detect()) {
      textarea.value = toLowerCase(textarea.value);
      automaticCopy();
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
          textarea.value = capitalizeWords(textarea.value, delimiter);
          return automaticCopy();
        }
      }
      // 只有一个单词的情况
      textarea.value = capitalizeWords(textarea.value);
      automaticCopy();
    }
  },
  // 下划线拼接
  underline: () => {
    console.log("点击了下划线拼接");
    if (detect()) {
      textarea.value = toUnderline(textarea.value);
      automaticCopy();
    }
  },
  // 驼峰互转
  convertHump: () => {
    console.log("点击了下划线拼接");
    if (detect()) {
      textarea.value = toConvertHump(textarea.value);
      automaticCopy();
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
      eache.setItem("pure_favorites_list", JSON.stringify(tableData));
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

// 收藏列表事件
const handleCopy = row => {
  console.log("点击了复制", row);
  if (row) {
    automaticCopy(row.content);
  }
};
const handleDisplay = row => {
  console.log("点击了陈列", row);
  if (row) {
    textarea.value = row.content;
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
              content="将通过空格分隔的单词转换成【小写单词】并用'_'拼接起来"
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
              <el-button @click="textListeners.convertHump">驼峰分割</el-button>
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
                  @click="handleCopy(row)"
                  >copy</el-button
                >
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="handleDisplay(row)"
                  >display</el-button
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
            <div class="dv-b">rgb转16进制</div>
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
}
</style>
