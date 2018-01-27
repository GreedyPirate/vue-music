import * as types from './mutation-type'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [types.SET_FULLSCREEN](state, flag) {
    state.fullScreen = flag;
  },
  [types.SET_PLAYING](state, flag) {
    state.playing = flag;
  },
  [types.SET_PLAYLIST](state, playList) {
    state.playList = playList;
  },
  [types.SET_SEQUENCELIST](state, sequenceList) {
    state.sequenceList = sequenceList;
  },
  [types.SET_MODEL](state, model) {
    state.model = model;
  },
  [types.SET_CURRENTINDEX](state, index) {
    state.currentIndex = index;
  }
}

export default mutations
