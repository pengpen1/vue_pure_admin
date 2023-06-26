// 转换字符串用到的工具函数
// 大写
export const toUpperCase = (str: string) => {
  return str.replace(/([a-z]+)/g, function (match, p1) {
    return p1.toUpperCase();
  });
};
// 小写
export const toLowerCase = (str: string) => {
  return str.replace(/([A-Z]+)/g, function (match, p1) {
    return p1.toLowerCase();
  });
};
// 首字母大写
export const capitalizeWords = (text: string, delimiter = " ") => {
  return text
    .split(delimiter)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(delimiter);
};
// 加分割符，默认下划线
export const toUnderline = (text: string, delimiter = "_") => {
  return text
    .split(" ")
    .map(word => word.toLowerCase())
    .join(delimiter);
};
// 转驼峰
export const camelize = (str: string) => {
  // (?:)非捕获组，^\w匹配开头的单个字母、[A-Z]单个大写字母、\b\w一个单词的开头、\s+个或多个连续的空格或制表符
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    // (?:) 表示非捕获组，即在正则表达式的匹配过程中不用作为捕获组返回，也就是没有p1,p2
    // 当前匹配的字符串是 " "，则直接返回一个空字符串
    if (+match === 0) return "";
    // index是表示当前匹配子字符串在原字符串中的起始位置
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

// 转驼峰
export const toCamelCase = (str: string) => {
  const result: string = camelize(str);
  return result.charAt(0).toLowerCase() + result.slice(1);
};
// 不是驼峰转驼峰，是驼峰转成空格分隔
export const toConvertHump = (text: string) => {
  const isCamelCase = /^[a-z][A-Za-z0-9]*$/.test(text);
  if (isCamelCase) {
    // 是驼峰转换成空格拼接
    return text.replace(/[A-Z]/g, match => ` ${match.toLowerCase()}`);
  } else {
    // 不是驼峰转换成驼峰
    // return text.replace(/(?:^\w|[A-Z])/g, (match, index) =>
    //   index === 0 ? match.toLowerCase() : ` ${match.toLowerCase()}`
    // );
    return toCamelCase(text);
  }
};
