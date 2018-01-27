import originJsonP from 'jsonp'

/**
 * 跨域请求
 * @param url 请求的url
 * @param data 参数，对象形式
 * @param option jsonp参数
 * @returns {Promise}
 */
export default function jsonp(url, data, option)
{
  url += '?' + param(data);
  /**
   * 使用Promise
   * resolve: 成功
   * reject: 失败
   */
  return new Promise((resolve, reject) => {
    originJsonP(url, option, (err, data) => {
      if (!err) { // 成功
        resolve(data);
      } else {
        reject(err);
      }
    });
  })
}

/**
 * 拼接参数
 * @param data {Object} 参数json对象
 */
function param(data) {
  let param = '';
  for (var k in data) {
    let val = data[k] === undefined ? '' : data[k];
    param += `&${k}=${encodeURIComponent(data[k])}`;
  }
  return param ? param.substring(1) : '';
}
