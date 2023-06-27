// 颜色转换相关工具函数
// 检测是否为16进制颜色
export const isHexadecimal = (str: string) => {
  if (!str) return false;
  return /^#?[0-9a-fA-F]+$/i.test(str);
};
// 是否为rgb
export const isRGB = (str: string) => {
  if (!str) return false;
  // const regex = /^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/;
  const regex = /^rgb\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\s*\)$/;
  return regex.test(str);
};
// 转rgb
export const hexToRgb = (hex: string) => {
  // 将16进制颜色代码转换为10进制整数
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  // 返回RGB格式颜色值
  return `rgb(${r}, ${g}, ${b})`;
};
// 转16进制
export const rgbToHex = (rgb: string) => {
  // 把 rgb 字符串转为数组,/,\s*/匹配逗号或者逗号后接0个或多个空隔
  const colors = rgb
    .substring(rgb.indexOf("(") + 1, rgb.lastIndexOf(")"))
    .split(/,\s*/);
  // 计算 R、G、B 分量的 16 进制值
  const r = parseInt(colors[0]).toString(16).padStart(2, "0");
  const g = parseInt(colors[1]).toString(16).padStart(2, "0");
  const b = parseInt(colors[2]).toString(16).padStart(2, "0");
  // 拼接为 #RRGGBB 的字符串
  return `#${r}${g}${b}`;
};
