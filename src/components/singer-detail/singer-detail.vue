<template>
  <transition name="slide">
    <music-list v-if="songs.length > 0" :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from '@/components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {createSong} from 'api/song'
  import {STATUS_OK} from 'api/config'

  export default {
    computed: {
      ...mapGetters([
        'singer'
      ]),
      title(){
        return this.singer.name;
      },
      bgImage(){
        return this.singer.avatar;
      }
    },
    components:{
      MusicList
    },
    data() {
      return {
        songs: []
      };
    },
    created() {
      this._getSingerDetail();
    },
    methods: {
      _getSingerDetail() {
        if(!this.singer || !this.singer.id){
          this.$router.push('/singer');
          return;
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === STATUS_OK) {
            this.songs = this._normalizeSongs(res.data.list);
          }
        });
      },
      _normalizeSongs(list) {
        let ret = [];
        if(list.length > 0){
          list.forEach((item, index) => {
            let {musicData} = item; // => let musicData = item.musicData
            if(musicData.songid && musicData.albummid){
              ret.push(createSong(musicData))
            }
          })
        }
        // 忘了return，坑
        return ret;
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/strings'
  .slide-enter-active, .slide-leave-active
    transition all .3s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)

</style>
