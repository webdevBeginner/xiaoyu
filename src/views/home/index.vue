<template>
  <div class="home">
    <!-- <img width="100%" :src="require('#/img/home-top@2x.png')" /> -->

    <!-- {{$t('全球实时行情')}} -->

    <!-- 这里是下面的切换页面 -->
    <router-view />
    <van-tabbar :border="false" route v-if=" $route.meta.type === 2" v-model="active">
      <van-tabbar-item replace to="/home/Assets">
        <span>资产</span>
        <img
          :src="props.active ? require('#/img/act-zichan@2x.png') : require('#/img/zichan@2x.png')"
          slot="icon"
          slot-scope="props"
        />
      </van-tabbar-item>
      <van-tabbar-item replace to="/home/hgf">
        <span>工厂</span>
        <img
          :src="props.active ? require('#/img/act-gongchang@2x.png') : require('#/img/gongchang@2x.png')"
          slot="icon"
          slot-scope="props"
        />
      </van-tabbar-item>
      <van-tabbar-item replace to="/Shop">
        <span>{{$t('商城')}}</span>
        <img
          :src="props.active ? require('#/img/act-shangcheng@2x.png') : require('#/img/shangcheng@2x.png')"
          slot="icon"
          slot-scope="props"
        />
      </van-tabbar-item>
      <van-tabbar-item replace to="/home/mine">
        <span>{{$t('我的')}}</span>
        <img
          :src="props.active ? require('#/img/act-wode@2x.png') : require('#/img/wode@2x.png')"
          slot="icon"
          slot-scope="props"
        />
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      icon: {
        active: "/static/img/wode",
        inactive: "/static/img/act-wode"
      }
    };
  },
  methods: {}
};
</script>

<style lang="less" scoped>
@import '../../style/mixin.less';
.home {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
  img {
    height: 0.3rem;
  }
}
</style>