/**
 * 推荐页的请求api
 */
import jsonp from 'common/js/jsonp'
import axios from 'axios'
import {commonParams, option} from './config'

/**
 * 获取推荐数据(含轮播图)
 */
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  });

  return jsonp(url, data, option);
}

/**
 * 获取歌单数据
 */
export function getPlaylist() {

  const url = '/api/getPlaylist'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });
  /**
   * 为啥有两个return？
   * return new Promise为啥不行...
   * 为啥要{params: data}，简写data不行吗？
   */
  return axios.get(url, {params: data}).then((res) => {
    return Promise.resolve(res.data);
  }).catch((err) => {
    return Promise.reject(err.data);
  })
}
