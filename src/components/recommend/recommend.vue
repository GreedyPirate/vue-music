<template>
  <div class="recommend">
    <!--层级一定要加对-->
    <scroll class="recommend-content" ref="scroll" :innerData="playList">
      <div>
        <!-- S=轮播图 -->
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <!-- needsclick 告诉fastclick需要别点击-->
                <img :src="item.picUrl" @load="loadImage" class="needsclick">
              </a>
            </div>
          </slider>
        </div>
        <!-- E=轮播图 -->
        <!-- S=推荐列表 -->
        <div class="recommend-list" >
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item in playList">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="info">
                <h2>{{item.creator.name}}</h2>
                <p>{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
        <!-- E=推荐列表 -->
      </div>
      <!-- S=加载图 -->
      <div class="loading-container" v-show="playList.length < 1">
        <loading></loading>
      </div>
      <!-- E=加载图 -->
    </scroll>
  </div>
</template>
<script type="text/ecmascript-6">
  import {getRecommend, getPlaylist} from 'api/recommend'
  import {STATUS_OK} from 'api/config'
  import slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'

  export default {
    data() {
      return {
        recommends: [],
        playList: [],
        checkLoaded: false
      }
    },
    components: {
      slider,
      Scroll,
      Loading
    },
    created() {
      this._getRecommends();
      // 加延时为了显示进度条，以后去掉
      setTimeout(() => {
        this._getPlaylist();
      },1000)
    },
    methods: {
      /**
       * jsonp获取数据
       * @private
       */
      _getRecommends() {
        getRecommend().then((res) => {
          if (res.code === STATUS_OK) {
            this.recommends = res.data.slider;
          }
        })
      },
      _getPlaylist() {
        getPlaylist().then((res) => {
          if (res.code === STATUS_OK) {
            this.playList = res.data.list;
          }
        })
      },
      /**
       * 监听第一张图片的加载事件，用于撑开BScroll高度
       */
      loadImage() {
        if(!this.checkLoaded){ //一张图片加载就可以撑开高度，刷新一次
          this.checkLoaded = true;
          this.$refs.scroll._refresh();
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/strings'
  .recommend
    position fixed
    top 88px
    bottom 0
    width 100%
    .recommend-content
      height 100%
      overflow hidden
      .slider-wrapper
        width 100%
        overflow hidden
        z-index 100
      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color $color-theme
          // item和list-title同级
        .item
          display flex
          padding 0 20px 20px 20px
          box-sizing border-box
          align-items center //水平居中
          .icon
            flex 0 0 60px
            width 60px
            margin-right 20px
          .info
            display: flex
            // 垂直flex
            flex-direction column
            justify-content center //垂直
            flex 1
            line-height 20px
            overflow hidden
            font-size $font-size-medium
            h2
              margin-bottom 10px
            p
              color $color-text-d
      .loading-container //水平垂直居中
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>

