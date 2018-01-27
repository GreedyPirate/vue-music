<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24">
    <p>{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
    export default {
      props:{
        title:{
          type:String,
          default:'正在载入...'
        }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/strings'
  .loading
    width 100%
    text-align center
    p
      line-height 20px
      font-size $font-size-small
      color $color-text-l
</style>
