<template>
  <div class="m-header">
    <div class="icon"></div>
    <div class="text">Shelter</div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/strings'
  @import '../../common/stylus/mixin'

  .m-header
    position relative
    height 44px
    text-align center
    color $color-theme
    font-size 0
    .icon
      display inline-block
      vertical-align top
      margin-top 6px
      margin-right 9px
      width 30px
      height 32px
      bg-image('imgs/logo')
      background-size 30px 32px
    .text
      display inline-block
      vertical-align top
      line-height 44px
      font-size $font-size-large
</style>
