<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active:currentPageIndex === index}" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {addClass} from 'common/js/dom'
  import BScroll from 'better-scroll'

  export default {
    props: {
      // 是否循环
      loop: {
        type: Boolean,
        default: true
      },
      // 是否自动播放
      autoPlay: {
        type: Boolean,
        default: true
      },
      // 轮播间隔
      interval: {
        type: Number,
        default: 2000
      }
    },
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    mounted() {
      // 底层是setTimeout 20ms
      this.$nextTick(() => {
        this._setSliderWidth();
        this._initSlider();
        if (this.autoPlay) {
          this._play();
        }
        window.addEventListener("resize", () => {
          if(!this.slider) return;
          this._setSliderWidth(true);
          this.slider.refresh();
        });
      });
    },
    methods: {
      /**
       * 设置每一个滑块的宽度
       * @param isResize 判断是否从窗口resize后进来的，
       *  如果是，没必要加2倍缓存图片的宽度,因为ready之后就缓存好了
       * @private
       */
      _setSliderWidth(isResize) {

        // 获取每一个滑块对象
        this.children = this.$refs.sliderGroup.children;
        this.dots = new Array(this.children.length);
        //debugger;
        // 保存group的总宽度
        let width = 0;
        // slider的宽度：100%
        let sliderWidth = this.$refs.slider.clientWidth;
        for (var i = 0, len = this.children.length; i < len; i++) {
          // 给每一个滑块设置宽度
          this.children[i].style.width = sliderWidth + 'px';
          // 设置样式
          addClass(this.children[i], 'slider-item');

          width += sliderWidth;
          // 循环为了缓存，需要左右滑块的宽度
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth;
        }

        // 把总宽度设置给滑块组
        this.$refs.sliderGroup.style.width = width + 'px';
      },
      /**
       * 初始化Slider
       * @private
       */
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
          },
          snapSpeed: 400
        });

        // 滚动结束时的监听,轮播主要靠这个方法
        this.slider.on("scrollEnd", () => {
          // currentPageIndex设置dot位置
          let pageIndex = this.slider.getCurrentPage().pageX;
          if (this.loop) {
            pageIndex -= 1;
          }
          this.currentPageIndex = pageIndex;

          // 滚动结束后，如果自动播放，继续滚动
          if(this.autoPlay){
            //清除timer，不然只执行一次setTimeOut
            clearTimeout(this.timer);
            //清除完timer，调play()
            this._play();
          }
        });
      },
      /**
       * 开始轮播
       * @private
       */
      _play() {
        // 获取要跳转的页数
        let pageIndex = this.slider.getCurrentPage().pageX
        if (this.loop) {
          pageIndex += 1;
        }

        this.timer = setTimeout(() => {
          // bs的goToPage方法 ，x 横轴的页数,y 纵轴的页数,time 动画执行的时间
          this.slider.goToPage(pageIndex, 0, 400);
        }, this.interval);
      }
    },
    destroyed() {
      clearTimeout(this.timer);
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/strings"
  .slider
    min-height 1px
    position relative
    .slider-group
      position relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float left
        box-sizing border-box
        overflow hidden
        text-align center
        a
          display block
          width 100%
          overflow hidden
          text-decoration: none
        img
          display block
          width 100%
    .dots
      position absolute
      left 0
      right 0
      bottom 12px
      text-align center
      font-size 0
      .dot
        display inline-block
        width 8px
        height 8px
        margin 0 4px
        border-radius 50%
        background-color $color-text-l
        &.active
          width 20px
          border-radius 5px
          background-color $color-text-ll
</style>
