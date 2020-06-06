<template>
  <div class="home">
    <!-- <img width="100%" :src="require('#/img/home-top@2x.png')" /> -->

    <!-- {{$t('全球实时行情')}} -->

    <!-- 这里是下面的切换页面 -->
    <router-view />
    <van-tabbar v-if=" $route.meta.type === 2" :border="false" route v-model="active">
      <van-tabbar-item replace to="/home/Assets">
        <span>DeFi</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? require('#/img/act-zichan@2x.png') : require('#/img/zichan@2x.png')"
        />
      </van-tabbar-item>
      <van-tabbar-item replace to="/home/dao">
        <span>DAO</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? require('#/img/act-dao@2x.png') : require('#/img/dao@2x.png')"
        />
      </van-tabbar-item>
      <van-tabbar-item replace to="/myTeam">
        <span>{{$t('团队')}}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? require('#/img/act-tuandui@2x.png') : require('#/img/tuandui@2x.png')"
        />
      </van-tabbar-item>
      <van-tabbar-item replace to="/home/mine">
        <span>{{$t('我的')}}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? require('#/img/act-wode@2x.png') : require('#/img/wode@2x.png')"
        />
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
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
@import "../../style/mixin.less";
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