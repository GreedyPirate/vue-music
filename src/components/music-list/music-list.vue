<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgImg" ref="bgImg">
      <div class="play-wrapper">
        <div class="play" ref="playBtn" v-show="songs.length > 0">
          <i class="icon-play"></i>
          <span class="text" @click="startRandom">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="shelter" ref="shelter"></div>
    <scroll :innerData="songs"
            :probe-type="probeType"
            :listenScroll="listenScroll"
            @onScroll="scroll"
            class="list"
            ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="onSelect"></song-list>
      </div>
      <div class="loading-wrapper" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script type="text/ecmascript-6">
  import Scroll from "base/scroll/scroll"
  import SongList from "base/song-list/song-list"
  import Loading from "base/loading/loading"
  import {mapActions} from 'vuex'
  import {mapGetters} from 'vuex'
  import {playModel} from 'common/js/config'

  const TOP_HEIGHT = 40;

  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {
        scrollY:0
      }
    },
    created(){
      this.probeType = 3
      this.listenScroll = true
    },
    mounted(){
      // 列表区顶部偏移
      this.$refs.list.$el.style.top = `${this.$refs.bgImg.clientHeight}px`;
      // 计算幕布最大偏移高度
      this.imgHeight = this.$refs.bgImg.clientHeight;
      this.minHeight = -this.imgHeight + TOP_HEIGHT;
    },
    comupted:{
      ...mapGetters(['model'])
    },
    methods:{
      ...mapActions(['selectPlay', 'randomPlay']),
      scroll(pos) {
        this.scrollY = pos.y;
      },
      // 回退
      back() {
        this.$router.back();
      },
      onSelect(item,index) {
        this.selectPlay({
          list:this.songs,
          index
        });
      },
      startRandom() {
        if(this.model === playModel.random) return;
        this.randomPlay({
          list:this.songs
        });
      }
    },
    components:{
      Scroll,
      SongList,
      Loading
    },
    computed:{
      bgImg() {
        return `background-image:url(${this.bgImage})`
      }
    },
    watch:{
      scrollY(newY) {
        // 不能超过某一高度
        let translateY = Math.max(this.minHeight, newY);
        // 父元素没动，拿一个div当幕布，用黑色背景，动态增加高度
        this.$refs.shelter.style.transform = `translate3d(0,${translateY}px,0)`;

        // 解决滑动到顶部，图片没有盖住列表文字
        let zIndex = 0, imgStyle = this.$refs.bgImg.style;


        // 下拉缩放,写在这是因为要设置zIndex
        let scale = 1, blur = 0;
        let percent = Math.abs(newY / this.$refs.bgImg.clientHeight); // 缩放百分比公式
        if(newY > 0){
          scale += percent;
          zIndex = 30;
        }else {
          blur = Math.min(20, percent * 20);
        }
        imgStyle.transform = `scale(${scale})`;
        // 仅ios
        this.$refs.filter.webkitBackdropFilter = `blur(${blur}px)`;



        if(newY < this.minHeight){ //滑的超出了顶部
          // 这里看图片原来的高度css怎么写的
          imgStyle.paddingTop = 0;
          imgStyle.height = `${TOP_HEIGHT}px`;
          zIndex = 30;
          this.$refs.playBtn.style.display = 'none';
        }else {
          // 设置回去
          imgStyle.paddingTop = '70%';
          imgStyle.height = 0;
          this.$refs.playBtn.style.display = 'block';
        }
        imgStyle.zIndex = zIndex;
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/strings"
  @import "~common/stylus/mixin"

  .music-list
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 100
    background-color $color-background
    .back
      position absolute
      top 0
      left 6px
      z-index: 50
      .icon-back
        display inline-block
        padding 10px
        font-size $font-size-large-x
        color $color-theme
    .title
      position absolute
      top 0
      left: 10%;
      width 80%
      line-height 40px
      z-index 40
      no-wrap()
      text-align center
      font-size $font-size-large
      color $color-text
    .bg-image
      position relative
      width 100%
      height 0
      padding-top 70%
      transform-origin top
      background-size cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .shelter
      position relative
      height 100%
      background $color-background
    .list
      position fixed
      top 0
      bottom 0
      width 100%
      background $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-wrapper
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>
