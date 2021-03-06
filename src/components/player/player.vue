<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="closeFull">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdRoate">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <div class="time time-l">{{formatTime(currentTime)}}</div>
            <div class="progress-bar-wrapper">
              <progress-bar :precent="barPrecent" @progressChange="onProgressChange"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeModel">
              <i :class="modelIcon"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="intoFullScreen">
        <div class="icon">
          <img :class="cdRoate" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <div class="name"></div>
          <div class="desc"></div>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="barPrecent">
            <i @click.stop="togglePlay" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <div class="icon-playlist"></div>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @canplay="onReady"
           :error="onError" @timeupdate="updateTime" @ended="onEnd"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {playModel} from 'common/js/config'
  import {shuffle} from 'common/js/utils'

  const transform = prefixStyle('transform');
  const transitionDuration = prefixStyle('transitionDuration');
  export default {
    data() {
      return {
        songReady: false,
        currentTime: 0,
        radius: 32
      }
    },
    components: {
      ProgressBar,
      ProgressCircle
    },
    computed: {
      ...mapGetters(['fullScreen', 'playList', 'playing', 'currentSong', 'currentIndex', 'model', 'sequenceList']),
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play';
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
      },
      modelIcon() {
        for (let key in playModel) {
          if (playModel[key] === this.model) {
            return `icon-${key}`;
          }
        }
      },
      cdRoate() {
        return this.playing ? 'play' : 'play pause'
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      barPrecent() {
        return this.currentTime / this.currentSong.duration;
      }
    },
    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULLSCREEN',
        setPlaying: 'SET_PLAYING',
        setCurrentIndex: 'SET_CURRENTINDEX',
        setModel: 'SET_MODEL',
        setPlayList: 'SET_PLAYLIST'
      }),
      closeFull() {
        // error: this.fullScreen=false
        this.setFullScreen(false);
      },
      intoFullScreen() {
        this.setFullScreen(true);
      },
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      _getPosAndScale() {
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        return {
          x,
          y,
          scale
        }
      },
      /**
       * 点击播放暂停
       * 通过mutation来改变playing状态，然后监听playing，来控制播放还是暂停
       */
      togglePlay() {
        if (!this.songReady) return;
        // 取反
        this.setPlaying(!this.playing);
      },
      next() {
        if (!this.songReady) return;
        let index = this.currentIndex + 1;
        if (index === this.playList.length) {
          //最后一首歌
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          togglePlay();
        }
        this.songReady = false;
      },
      prev() {
        if (!this.songReady) return;
        let index = this.currentIndex - 1;
        if (index === -1) {
          //最后一首歌
          index = this.playList.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          togglePlay();
        }
        this.songReady = false;
      },
      onReady() {
        this.songReady = true;
      },
      onError() {
        // todo ...
        this.songReady = true;
      },
      onEnd() {
        if(this.model === playModel.loop){
          // 循环播放
          this.loop()
        }else{
          this.next();
        }
      },
      loop(){
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
      },
      /**
       * 原生事件，监听事件的改变
       * @param e
       */
      updateTime(e) {
        // 该时间是一个时间戳，要格式化
        this.currentTime = e.target.currentTime;
      },
      /**
       * 子组件拖动进度条，重置audio的currentTime
       * @param newPrecent
       */
      onProgressChange(newPrecent) {
        this.$refs.audio.currentTime = this.currentSong.duration * newPrecent;
        // 如果暂停了，拖动结束后播放
        if (!this.playing) {
          this.togglePlay();
        }
      },
      formatTime(interval) {
        interval = interval | 0; // =Math.floor
        const minute = interval / 60 | 0;
        const second = this._padZero(interval % 60);
        return `${minute}:${second}`
      },
      changeModel() {
        // 改变模式
        let model = (this.model + 1) % 3;
        this.setModel(model);
        let list = [];
        // 相应的改变歌曲
        if(model === playModel.random){
          list = shuffle(this.sequenceList);
        }else {
          list = this.sequenceList;
        }
        this.setPlayList(list);
        // 重置currentIndex
        this.resetIndex();
        // 开始播放
        this.setPlaying(true);
      },
      resetIndex(){
        let index = this.playList.findIndex((item) => {
          // 查找索引，返回的是布尔值，一开始写成一个=了
          return item.id === this.currentSong.id;
        });
        this.setCurrentIndex(index);
      },
      _padZero(num, n = 2) {
        let len = num.toString().length;
        while (len < 2) {
          num = '0' + num;
          len++;
        }
        return num;
      },
      show(list) {
        for(let i=0, len=list.length; i<len; i++){
          console.log(list[i])
        }
      }
    },
    watch: {
      currentSong(newVal, oldVal) {
        if(newVal.id === oldVal.id) return;
        // 加延时，歌曲还没加载过来
        this.$nextTick(() => {
          this.$refs.audio.play();
        })
      },
      playing(isPlayingNow) {
        this.$nextTick(() => {
          let player = this.$refs.audio;
          // 这里注意，新的值是true，说明它以前是false，是被pause的，现在应该play
          isPlayingNow ? player.play() : player.pause();
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"
  @import "~common/stylus/strings"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
