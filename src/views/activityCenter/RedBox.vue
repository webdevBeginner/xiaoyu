<template>
  <div class="redBoxClassname">
    <div v-show="redBoxindex && !flg && show">
      <div class="prize">
        <p>恭喜获得</p>
        <h3>{{money}}HGF</h3>
      </div>
      <div class="watch">
        <p>奖励已到账</p>
        <p>请前去查看</p>
      </div>
    </div>
    <img :src="redBoxSrc" class="redBox" v-if="show" />
    <img
      :src="require('#/img/activityCenter/kai.png')"
      @click="receiveRedbox"
      cl
      class="kai"
      v-show="!redBoxindex && flg && show"
    />
    <div v-show="!redBoxindex && flg && show">
      <img
        :src="require('#/img/activityCenter/lingquhongbao.png')"
        @click="receiveRedbox"
        class="redBoxbtn"
      />
    </div>
    <van-icon @click="closePop" class="close-popup" name="close" size=".6rem" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data () {
    return {
      flg: true,
      show: false,
      money: 0.00,
      redBoxArr: [
        require("#/img/activityCenter/hongbao.png"),
        require("#/img/activityCenter/hongbao2.png")
      ],
      redBoxindex: 0
    };
  },
  created () {
    this.mview.socket.send({
      data: {
        method: "REDPACKAGE_ACTIVITY_VIEW"
      },
      success: data => {
        this.$store.commit("hideLoading");
        if (data.Code == 0) {
          this.show = true
          this.flg = data.Data.flg
          this.money = this.flg ? 0 : data.Data.money
          this.redBoxindex = this.flg ? 0 : 1
        } else {
          this.show = false
          this.$toast(this.$t(data.Message));
        }
      }
    });
  },
  computed: {
    redBoxSrc () {
      return this.redBoxArr[this.redBoxindex];
    },
    // ...mapGetters(["get_activityListShowPop", "get_activityListComponentName"])
  },
  methods: {
    receiveRedbox () {
      // 领取红包
      this.flg = false
      this.redBoxindex = 1;
      this.mview.socket.send({
        data: {
          method: "REDPACKAGE_ACTIVITY_ACTION"
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.money = data.Data.money
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    closePop () {
      this.show = false
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
    position: relative;
  }
  .kai {
    width: 1.18rem;
    position: absolute;
    left: 3.16rem;
    top: 0.78rem;
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
    z-index: 9;
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
    z-index: 9;
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