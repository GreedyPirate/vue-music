# vue-music



> a music SPA

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

bug list

1.必须叫mutations，不然注册不成功，报错unknown mutation type

2.我们为什么需要缓存？假设我们有一个性能开销比较大的的计算属性 A，它需要遍历一个巨大的数组并做大量的计算。然后我们可能有其他的计算属性依赖于 A 。如果没有缓存，我们将不可避免的多次执行 A 的 getter！如果你不希望有缓存，请用方法来替代

3.better-scroll：父元素高度一定要大于子元素高度，才可以滚动

4.this.$refs.list是一个子组件，this.$refs.list.$el取的是子组件的挂载点dom

5.scroll组件的pos.y的值，往上滑，负数的值越大

6.拿到子组件的dom元素，就可以调用子组件的方法：this.$refs.scroll._refresh()
