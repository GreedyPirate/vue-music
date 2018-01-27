<template>
  <div class="singer">
    <listview :data="singerList" @selectSinger="selectSinger"></listview>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import {getSingerList, Singer} from 'api/singer'
  import {STATUS_OK} from 'api/config'
  import Listview from 'base/listview/listview'
  import {mapMutations} from 'vuex'

  const HOT_NAME = '热门';
  const HOT_LEN = 10; //取前10位歌手做热门

  export default {
    data() {
      return {
        singerList: []
      }
    },
    components: {
      Listview
    },
    created() {
      this._getSingerList();
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer);
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === STATUS_OK) {
            this.singerList = this._normalizeSinger(res.data.list);
          }
        });
      },
      /**
       * 将歌手按首字母聚合，并排序
       * @param list
       * @private
       */
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        };
        list.forEach((item, index) => {
          if (index < HOT_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }));
          }
          // 首字母
          let mapKey = item.Findex;
          // 不存在的新建一个
          if (!map[mapKey]) {
            map[mapKey] = {
              title: mapKey,
              items: []
            }
          }
          // 已存在的push
          map[mapKey].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }));
        });

        // 把聚合好的数据，分开到hot 和 首字母数组
        let hot = [], ret = [];
        for (let key in map) {
          let val = map[key];
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val);
          }
        }
        //对ret数组排序
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });
        return hot.concat(ret);
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .singer
    position absolute
    top 88px
    bottom 0
    width 100%
</style>
