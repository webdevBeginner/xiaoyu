<template>
  <div class="redBoxClassname">
    <!-- 已开奖 -->
    <div v-show="showPageIndex == 2">
      <div class="prize">
        <transition
            name="fade"
            enter-active-class="fadeInUp"
          >
            <p
              v-show="showAnimated2"
              style="animation-duration: 2.5s"
            >恭喜获得</p>
          </transition>

          <transition
            name="zoom"
            enter-active-class="zoomIn"
          >
            <h3
              v-show="showAnimated2"
              style="animation-duration: 1s"
            >{{money}}HGF</h3>
          </transition>
      </div>
      <div class="watch">
        <p>奖励已到账</p>
        <p>请前去查看</p>
      </div>
      
      <transition
        name="bounce"
        enter-active-class="bounceIn"
      >
        <img
          v-show="showAnimated2"
          style="animation-duration: 2.5s"
          :src="redBoxSrc"
          class="redBox"
        />
      </transition>

    </div>

    <!--  待开奖 -->
    <div v-show="showPageIndex == 1">
      <img
        :src="redBoxSrc"
        class="redBox"
      />
      <transition
        name="zoom"
        enter-active-class="zoomIn"
      >
        <img
          :src="require('#/img/activityCenter/hongbao-bottom.png')"
          class="hongbao-bottom"
          @click="handleClick(index)"
          v-show="showAnimated"
          style="animation-duration: 0.3s"
        />
      </transition>

      <transition
        name="flip"
        enter-active-class="flipInY"
      >
        <img
          :src="require('#/img/activityCenter/kai.png')"
          @click="receiveRedbox"
          class="kai"
          v-show="showAnimated"
          style="animation-duration:1s"
        />
      </transition>
      <transition
        name="flip"
        enter-active-class="bounceIn"
      >
        <img
          :src="require('#/img/activityCenter/lingquhongbao.png')"
          @click="receiveRedbox"
          class="redBoxbtn"
          v-show="showAnimated"
          style="animation-duration:2.5s"
        />
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flg: true,
      show: false,
      money: 0.0,
      redBoxArr: [
        require("#/img/activityCenter/hongbao.png"),
        require("#/img/activityCenter/hongbao2.png")
      ],
      redBoxindex: 0,

      showAnimated: false, // 动画开关
      showAnimated2: false, // 第二页动画开关
      showPageIndex: 1 // 当前页码
    };
  },
  created() {
    // this.mview.socket.send({
    //   data: {
    //     method: "REDPACKAGE_ACTIVITY_VIEW"
    //   },
    //   success: data => {
    //     this.$store.commit("hideLoading");
    //     if (data.Code == 0) {
    var data = {
      Data: {
        flg: true,
        money: 10
      }
    };
    this.show = true;
    this.flg = data.Data.flg;
    this.money = this.flg ? 0 : data.Data.money;
    this.redBoxindex = this.flg ? 0 : 1;
    //   } else {
    //     this.show = false
    //     this.$toast(this.$t(data.Message));
    //   }
    // }
    // });
  },
  mounted() {
    this.showAnimated = true;
  },
  computed: {
    redBoxSrc() {
      return this.redBoxArr[this.redBoxindex];
    }
  },
  methods: {
    receiveRedbox() {
      // 领取红包
      this.showPageIndex = 2; // 当前页码
      this.showAnimated2 =  true; // 第二页动画开关
      this.redBoxindex = 1;
      return false;

      this.flg = false;
      this.mview.socket.send({
        data: {
          method: "REDPACKAGE_ACTIVITY_ACTION"
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.money = data.Data.money;
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.redBoxClassname {
  position: relative;
  height: 9rem;
  .redBox {
    z-index: 100;
    width: 100%;
    position: relative;
  }
  .kai {
    z-index: 110;
    width: 1.18rem;
    position: absolute;
    left: 3.16rem;
    top: 0.78rem;
  }
  .hongbao-bottom {
    z-index: 90;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 2.7rem;
  }
  .redBoxbtn {
    position: absolute;
    z-index: 130;
    width: 50%;
    display: block;
    margin: -33px auto 0;
    left: 0;
    right: 0;
  }
  .prize {
    position: absolute;
    width: 100%;
    top: 2.3rem;
    z-index: 200;
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
  .watch {
    position: absolute;
    width: 100%;
    top: 5.16rem;
    z-index: 209;
    p {
      margin: 0;
      padding: 0;
      font-size: 0.36rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #fdf343;
      line-height: 0.48rem;
      text-align: center;
    }
  }
}
</style>