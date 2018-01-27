<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props:{
      probeType:{
        type:Number,
        default:1
      },
      click:{
        type:Boolean,
        default:true
      },
      innerData:{
        type:Array,
        default:null
      },
      listenScroll:{
        type:Boolean,
        default:false //是否需要监听onScroll事件
      }
    },
    mounted(){
      this.$nextTick(() => {
        this._initScroll();
      })
    },
    methods:{
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper,{
          probeType:this.probeType,
          click:this.click
        });
        // 是否需要监听滚动事件，需要就emit出去
        if(this.listenScroll){
          let me = this;
          this.scroll.on('scroll',(pos) => {
            //这里的this在on函数里
            me.$emit('onScroll',pos);
          })
        }
      },
      _enable() {
        this.scroll && this.scroll.enable();
      },
      _disable() {
        this.scroll && this.scroll.disable();
      },
      _refresh() {
        this.scroll && this.scroll.refresh();
      },
      iscrollToElement(){
        // 为什么一定要改变this？
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      },
      iscrollTo(){
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      }
    },
    watch:{
      innerData() {
        setTimeout(() => {
          this._refresh();
        },20);
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
