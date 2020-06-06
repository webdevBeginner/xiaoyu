<template>
  <div class="redBoxClassname">
    <div>
      <div class="prize">
        <p>恭喜获得</p>
        <h3>100HGF</h3>
      </div>
      <img :src="redBoxSrc" class="redBox" />
    </div>

    <div v-show="!redBoxindex">
      <img
        :src="require('#/img/activityCenter/lingquhongbao.png')"
        @click="receiveRedbox"
        class="redBoxbtn"
      />
    </div>
    <van-icon name="close" @click="closePop" class="close-popup" size=".6rem" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      redBoxArr: [
        require("#/img/activityCenter/hongbao.png"),
        require("#/img/activityCenter/hongbao2.png")
      ],
      redBoxindex: 0
    };
  },
  computed: {
    redBoxSrc() {
      return this.redBoxArr[this.redBoxindex];
    },
    ...mapGetters(["get_activityListShowPop", "get_activityListComponentName"])
  },
  methods: {
    receiveRedbox() {
      // 领取红包
      this.redBoxindex = 1;
    },
    closePop() {
      this.$store.commit("get_activityListShowPop", false);
      this.$store.commit("get_activityListComponentName", "");
    }
  }
};
</script>

<style lang="less" scoped>
.redBoxClassname {
  position: relative;
  .redBox {
    width: 100%;
  }
  .redBoxbtn {
    width: 50%;
    margin: 0 auto;
    display: block;
    transform: translateY(-33px);
  }
  .close-popup {
    &::before {
      color: #fff;
    }
  }
  .prize {
    position: absolute;
    width: 100%;
    top: 2.3rem;
    p {
      margin: 0;
      padding: 0;
      height: 0.26rem;
      font-size: 0.27rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(225, 20, 37, 1);
      line-height: 0.36rem;
      text-align: center;
    }
    h3 {
      margin: 0;
      padding: 0;
      height: 0.49rem;
      font-size: 0.66rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(225, 20, 37, 1);
      line-height: 0.89rem;
      text-align: center;
    }
  }
}
</style>