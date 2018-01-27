<template>
  <scroll class="listview"
          ref="listview"
          :listenScroll="true"
          :probeType="3"
          @onScroll="listOnScroll">
    <!-- S=歌手列表 -->
    <ul>
      <li class="group" v-for="group in data" ref="group">
        <h2 class="group-title">{{group.title}}</h2>
        <ul>
          <li class="group-item" @click="selectSinger(item)" v-for="item in group.items">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- E=歌手列表 -->

    <!-- S=字母表 -->
    <div class="shortcut-wrapper">
      <ul>
        <li class="shortcut"
            v-for="(item,index) in shortcuts"
            @touchstart.stop.prevent="onShortcutStart"
            @touchmove.stop.prevent="onShortcutMove"
            :data-index="index"
            :class="{'current':currentShortcutIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
    <!-- S=字母表 -->

    <div class="list-fixed" ref="fixed" v-show="getFixedTitle">
      <div class="fixed-title">{{getFixedTitle}}</div>
    </div>
    <div class="loading-wrapper" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getAttr} from 'common/js/dom'
  import Loading from 'base/loading/loading'

  /**
   * 左右联动思路
   * 1.滑动(点击)shortcut，主要是获取到index，再调用scrollTo方法，
   * 滑动的index获取思路也很简单，记录开始的index，pageY，结束的pageY，计算滑动了几个index：(pageY1-pageY2)/每个高度，相加index
   * 2，滑动listview，和饿了么类似，一开始就计算一个区间数组[0,760,1030...],根据BScroll的onScroll事件获取pos.y,watch pas.y变量，
   * 看它落在哪个区间了，获得index，最后还是调用scrollTo方法
   */

  const SHORT_HEIGHT = 18; // 每一个字母的高度为18px

  const TITLE_HEIGHT = 30;
  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        scrollY: -1,
        currentShortcutIndex: 0,
        diff: -1
      }
    },
    components: {
      Scroll,
      Loading
    },
    created() {
      //为什么要写在created，而不是data，这个自定义变量不需要和dom绑定，不watch
      this.touch = {};
      this.listenerScroll = true;
      this.heightRegion = [];
    },
    computed: {
      shortcuts() {
        let arr = new Array();
        this.data.forEach((item, index) => {
          arr.push(item.title.substr(0, 1));
        });
        return arr;
      },
      getFixedTitle() {
        if (this.scrollY > 0) return '';
        let result = this.data[this.currentShortcutIndex] ?
          this.data[this.currentShortcutIndex].title : '';
        return this.data[this.currentShortcutIndex] ?
          this.data[this.currentShortcutIndex].title : '';
      }
    },
    methods: {
      /**
       * 点击shortcut，滚动列表
       * bug  this.maxScrollY = this.wrapperHeight - this.scrollerHeight;
       * @param e
       */
      onShortcutStart(e) {
        let touchedIndex = getAttr(e.target, 'index'); //第几个被点击了
        touchedIndex = parseInt(touchedIndex); // 是字符串...
        let beginTouch = e.touches[0]; //0表示手指触控点
        this.touch.y1 = beginTouch.pageY;
        this.touch.touchedIndex = touchedIndex;

        this._scrollTo(touchedIndex);
      },
      /**
       * 滑动shortcut，滚动列表
       * 记录start和end的pageY，相减除以一个shortcut的高度，计算偏移量，滚动到dom
       * @param e
       */
      onShortcutMove(e) {
        let endTouch = e.touches[0];
        this.touch.y2 = endTouch.pageY;
        let offset = (this.touch.y2 - this.touch.y1) / SHORT_HEIGHT | 0; // |0 等于math.floor,向下取整
        let endIndex = this.touch.touchedIndex + offset;
        this._scrollTo(endIndex);
      },
      listOnScroll(pos) {
        this.scrollY = pos.y;
      },
      selectSinger(item){
        this.$emit("selectSinger",item)
      },
      _scrollTo(index) {
        //拉到最上面和最下面的边界处理
        if (index < 0) {
          index = 0;
          return;
        } else if (index > this.heightRegion.length - 2) {
          index = this.heightRegion[length - 2];
        }
        console.log(index)
        /*
        点击shortcut也要改变scrollY，不然不变色
        直接给heightRegion的上限就行
         */
        this.scrollY = -this.heightRegion[index];
        this.$refs.listview.iscrollToElement(this.$refs.group[index], 0); // 0表示动画时间
      },
      _caclHeightList() {
        this.heightRegion = []; //每次都清空
        let height = 0;
        this.heightRegion.push(height);
        let groups = this.$refs.group;
        groups.forEach((item, index) => {
          height += item.clientHeight;
          this.heightRegion.push(height);
        });
      }
    },
    watch: {
      data() {
        //还是watch一下，dom渲染的时机不对，导致高度没获取到，刷新一下
        setTimeout(() => {
          this.$refs.listview._refresh();
          this._caclHeightList();
        }, 20)
      },
      /**
       * 监听滑动y轴的位置，可以计算shortcut高亮索引
       * @param currentPosY
       */
      scrollY(currentPosY) {
        let scroll = this.$refs.scroll;
        if (currentPosY > 0) {
          this.currentShortcutIndex = 0;
          return;
        }
        for (let i = 0, len = this.heightRegion.length - 1; i < len; i++) {
          let fontHeight = this.heightRegion[i];
          let nextHeight = this.heightRegion[i + 1];
          if (-currentPosY >= fontHeight && -currentPosY < nextHeight) {
            this.currentShortcutIndex = i;
            this.diff = nextHeight + currentPosY
            return;
          }
        }
        this.currentShortcutIndex = this.heightRegion.length - 2; // 当滚动到底部，且-newY大于最后一个元素的上限
      },
      // 实现固定标题栏，有样式bug
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
        if (this.fixedTop === fixedTop) {
          return;
        }
        this.fixedTop = fixedTop;
       // this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/strings"
  .listview
    width 100%
    height 100%
    overflow hidden
    background-color $color-background
    .group
      padding-bottom 30px
    .group-title
      height 30px
      line-height 30px
      padding-left 20px
      color $color-text-l
      font-size $font-size-small
      background $color-highlight-background
    .group-item
      padding 20px 0 0 30px
      display flex
      align-items center
      .avatar
        border-radius 50%
        width 50px
        height 50px
      .name
        margin-left 20px
        font-size $font-size-medium
        color $color-text-l
    .shortcut-wrapper
      position absolute
      right 0
      top 50%
      transform translateY(-50%)
      width 20px
      padding 20px 0
      border-radius 10px
      text-align center
      background-color $color-background-d
      .shortcut
        padding 3px
        font-size $font-size-small
        color $color-text-l
        &.current
          color $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-wrapper
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
