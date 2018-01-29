<template>
  <div class="progress-bar" ref="progressBar" @click="moveTo">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn">
        <div class="progress-btn"
             @touchstart.prevent="touchstart"
             @touchmove.prevent="touchmove"
             @touchend.prevent="touchend"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'

  //小球宽度，参见css
  const PROCESS_BTN_WIDTH = 16;
  const transform = prefixStyle('transform');

  export default {
    props:{
      precent:{
        type:Number,
        default:0
      }
    },
    created(){
      // 给init初始化，否则watch里undefined，if一样通过
      this.touch = {
        init:false
      };
    },
    methods:{
      touchstart(e) {
        // 记录开始拖动
        this.touch.init = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.origin = this.$refs.progress.clientWidth;
      },
      touchmove(e) {
        if (!this.touch.init) {
          return;
        }
        const barWidth = this.$refs.progressBar.clientWidth - PROCESS_BTN_WIDTH;
        // 防止向左拖动
        let newWidth = Math.max(0,this.touch.origin + e.touches[0].pageX - this.touch.startX);
        // 防止向右拖动超出边界
        let offsetMove = Math.min(barWidth, newWidth);
        this._offsetChange(offsetMove);
      },
      touchend() {
        // 记录拖动结束
        this.touch.init = false;
        this._tellParent();
      },
      // 点击事件
      moveTo(e) {
        /*//获取progressBar的点击时的偏移量即可
        this._offsetChange(e.offsetX);*/
        let react = this.$refs.progressBar.getBoundingClientRect();
        let offset = e.pageX - react.left;
        this._offsetChange(offset);
        this._tellParent();
      },
      // emit事件
      _tellParent() {
        // 告诉父组件我拖动了多少百分比，定位歌曲时间
        const barWidth = this.$refs.progressBar.clientWidth - PROCESS_BTN_WIDTH;
        // 此时已拖动结束，直接取progress的宽度
        let newWidth = this.$refs.progress.clientWidth;
        let newPrecent = newWidth / barWidth;
        this.$emit('progressChange', newPrecent)
      },
      _offsetChange(offsetWidth) {
        //3.设置进度条偏移
        this.$refs.progress.style.width = `${offsetWidth}px`;
        //4.设置小球偏移
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
      }
    },
    watch:{
      precent(newVal){
        // 在拖动结束后也要设置
        if(newVal > 0 && !this.touch.init){
          //1.获取总宽度，除去小球宽度
          const barWidth = this.$refs.progressBar.clientWidth - PROCESS_BTN_WIDTH;
          //2.使用百分比计算宽度
          const offsetWidth = barWidth * newVal;
          this._offsetChange(offsetWidth);
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/strings"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
