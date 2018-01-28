/**
 * 返回max，min之间的一个随机数
 * max-min+1为什么+1？ random到不了1
 * @param max
 * @param min
 */
function getShuffle(max, min) {
  return Math.floor(min + Math.random() * (max - min + 1));
}


/**
 * 打乱数组顺序
 * @param arr
 */
export function shuffle(arr) {
  if (arr.length === 1) return arr[1];
  for (let i = 0, len = arr.length; i < len; i++) {
    let j = getShuffle(0, i);
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}
