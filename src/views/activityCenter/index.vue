<template>
  <div class="activityList-content">

    <!-- 活动中心首页列表 -->
    <activity-list></activity-list>

    <!-- 弹出层 - 拆红包 砸金蛋-->
    <van-popup
      :close-on-click-overlay="false"
      :safe-area-inset-bottom="true"
      class="w100"
      overlay-class="shadeClassname"
      v-model="$store.state.activityListShowPop"
    >
      <component :is="$store.state.activityListComponentName"></component>

      <van-icon
        @click="closePop()"
        class="close-popup"
        name="close"
        size=".6rem"
      />
    </van-popup>
  </div>
</template>

<script>
import HitEggs from "./HitEggs";
import RedBox from "./RedBox";
import ActivityList from "./ActivityList";

export default {
  components: { RedBox, HitEggs, ActivityList },
  methods: {
    closePop() {
      this.$store.commit("SETOPTIONS", {
        activityListShowPop: false,
        activityListComponentName: ""
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin.less";

.activityList-content {
  .shadeClassname {
    background-color: rgba(0, 0, 0, 0.38);
  }
  .w100 {
    width: 100%;
    background-color: transparent;
  }
}

.close-popup {
  &::before {
    color: #fff;
  }
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

/*弹层动画（从上往下）*/
.fadeIn {
  -webkit-animation: fadeInDown 0.3s;
  animation: fadeInDown 0.3s;
}

@keyframes fadeInDown {
  0% {
    -webkit-transform: translate3d(0, -20%, 0);
    -webkit-transform: translate3d(0, -20%, 0);
    transform: translate3d(0, -20%, 0);
    transform: translate3d(0, -20%, 0);
    opacity: 0;
  }
  100% {
    -webkit-transform: none;
    transform: none;
    opacity: 1;
  }
}
</style>