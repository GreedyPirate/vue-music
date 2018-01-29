import * as types from './mutation-type'
import {playModel} from 'common/js/config'
import {shuffle} from "../common/js/utils"

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_CURRENTINDEX, index)
  if(state.model === playModel.random){
    let shuffledList = shuffle(list);
    commit(types.SET_PLAYLIST, shuffledList);
    index = findIndex(shuffledList, list[index]);
  }else{
    commit(types.SET_PLAYLIST, list);
  }
  commit(types.SET_FULLSCREEN, true);
  commit(types.SET_PLAYING, true);
  commit(types.SET_CURRENTINDEX, index)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_MODEL, playModel.random);
  commit(types.SET_SEQUENCELIST, list);
  let shuffledList = shuffle(list);
  commit(types.SET_PLAYLIST, shuffledList)
  // 点随机播放就进入全屏，和播放状态
  commit(types.SET_FULLSCREEN, true);
  commit(types.SET_PLAYING, true);
  commit(types.SET_CURRENTINDEX, 0)
}

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id;
  })
}
