<template>
  <div class="tab">
    <router-link tag="div" class="item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>

  </div>
</template>
<script type="text/ecmascript-6">
  export default {}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/strings"

  .tab
    display flex
    height 44px
    line-height 44px
    font-size $font-size-medium
    .item
      flex 1
      text-align center
      .tab-link
        padding-bottom 5px
        color $color-text-l
      &.router-link-active
          .tab-link
            color $color-theme
            border-bottom 2px solid $color-theme
</style>
