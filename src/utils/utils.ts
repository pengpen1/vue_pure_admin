// 去重
export const unique = arr => {
  return [...new Set(arr)];
};

// 防抖
/**
 *
 * @param func 函数
 * @param delay 延迟时间
 * @returns 防抖函数
 */
export function debounce(func, delay) {
  let timerId;
  let lastExecTime = 0;

  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime < delay) {
      // 在延迟时间内，取消上一次的执行计时器
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      func.apply(this, args);
      lastExecTime = currentTime;
    }, delay);
  };
}

// 节流
/**
 *
 * @param func 函数
 * @param delay 间隔时间
 * @returns 节流函数
 */
export function throttle(func, delay) {
  let isThrottled = false;

  return function (...args) {
    if (isThrottled) {
      return;
    }

    isThrottled = true;

    func.apply(this, args);

    setTimeout(() => {
      isThrottled = false;
    }, delay);
  };
}
