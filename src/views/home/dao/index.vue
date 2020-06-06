<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('DAO')">
      <template #right>
        <div class="history" @click="goRoute('history','method','QUERY_BUY_PRODUCT_LIST')"></div>
      </template>
    </van-nav-bar>
    <div class="main" v-show="!LOADING">
      <div class="ZEC" v-if="Data.money > 0">
        <div class="dao" v-for="item in 3" :key="item" :class="item === flyIndex ? 'feidao' : ''"></div>
        <div class="kuangji">
          <p v-for="item in 3" :key="item">
            <a v-if="badgeList.length">
              <span :class="huangguang === item ? 'ishuangguang' : ''"></span>
            </a>
          </p>
        </div>
      </div>
      <div class="NO_DAO" v-else></div>
      <div class="style">
        <div class="left">
          <p class="day">
            {{$t('投入本金：')}}
            <span>{{Data.money.toFixed( 8)}} ZEC</span>
          </p>
          <p class="day">
            {{$t('DAO收益：')}}
            <span>{{Number(income).toFixed( 8)}} ZEC</span>
          </p>
        </div>
        <div class="days watch" @click="goRoute('Revenue')">{{$t('查看')}}</div>
        <div class="days" v-if="Data.day">{{Data.day}}{{$t('天')}}</div>
      </div>
      <van-button color="#2659FF" plain class="exchange" @click="badgeRoute">{{$t('参与DAO')}}</van-button>
      <van-button color="#2659FF" plain class="exchange" @click="goMyBadge">{{$t('DAO列表')}}</van-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    const vm = this;
    return {
      // 星云列表
      Data: {
        day: 7,
        money: 0.0
      },
      id: 0,
      badgeList: [],
      huangguang: 1,
      huangguang_set: null,
      seconds_set: null,
      timer: null,
      income: 0,
      income_next: 0,
      flyIndex: 0
    };
  },
  computed: {
    ...mapState(["LOADING"]),
    ...mapGetters(["get_chickens"])
  },
  created() {
    this.init();
    this.seconds_set ? clearInterval(this.seconds_set) : null;
    this.seconds_set = null;
    this.huangguang_set ? clearInterval(this.huangguang_set) : null;
    this.huangguang_set = null;
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.huangguang_set);
    clearInterval(this.seconds_set);
    this.huangguang_set = null;
    this.seconds_set = null;
    this.timer = null;
  },
  methods: {
    // 初始化拿到当前的矿机产品
    init() {
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "PRODUCT_INDEX_VIEW"
        },
        success: data => {
          if (data.Code == 0) {
            this.Data = data.Data;
            this.Data.money = data.Data.money ? data.Data.money : 0;
            this.$store.commit("get_now_money", this.Data.money);
            this.initList();
            if (data.Data.money > 0) {
              this.get_eth();
              this.timer = setInterval(() => {
                const timer = setInterval(this.get_eth(), 60 * 1000);
                this.$once("hook:beforeDestroy", () => {
                  clearInterval(timer);
                });
              }, 60000);
            }
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    // 初始化拿到所有的矿机产品
    initList() {
      this.mview.socket.send({
        data: {
          method: "SYSTEM_PRODUCT_ALL"
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.badgeList = data.Data.list;
            this.badgeList.map(_ => {
              if (
                (_.min_amount <= this.Data.money &&
                  _.max_amount >= this.Data.money) ||
                this.Data.money >
                  this.badgeList[this.badgeList.length - 1].max_amount
              ) {
                this.id = _.id;
              }
            });
            this.$store.commit("get_badge_list", this.badgeList);
            this.$store.commit("get_now_id", this.id);
            if (this.Data.money > 0 && this.id) {
              setInterval(() => {
                if (this.flyIndex > 2) {
                  this.flyIndex = 1;
                } else {
                  this.flyIndex++;
                }
              }, 5000);
            }
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    // 每分钟的挖矿收益
    get_eth() {
      this.mview.socket.send({
        data: {
          method: "UPDATE_PRODUCT_INCOME_ACTION"
        },
        success: data => {
          let vm = this;
          if (data.Code == 0) {
            vm.income = data.Data.income ? data.Data.income : 0;
            vm.income_next = data.Data.income_next ? data.Data.income_next : 0;
            if (data.Data.income_next) {
              // 这里计算每秒钟的数据
              let price = data.Data.income_next - data.Data.income; //这里是他的差值
              let stride = +(price / 120).toFixed(8);
              let index = 0;
              vm.seconds_set = setInterval(() => {
                let next = Number(stride) + Number(vm.income);
                vm.income = next.toFixed(8);
              }, 500);
              setTimeout(() => {
                clearInterval(vm.seconds_set);
                vm.seconds_set = null;
                clearInterval(vm.huangguang_set);
                vm.huangguang_set = null;
              }, 59000);
              vm.huangguang_set = setInterval(() => {
                if (vm.huangguang > 2) {
                  vm.huangguang = 1;
                } else {
                  vm.huangguang++;
                }
              }, 2000);
            }
          } else {
            vm.$toast(vm.$t(data.Message));
          }
        }
      });
    },
    goRoute(name, paramsName, params) {
      this.$router.push({
        name: name,
        params: { [paramsName]: params }
      });
    },
    badgeRoute() {
      this.$router.push({
        name: "purchase"
      });
    },
    goMyBadge() {
      this.$router.push({
        name: "myBadge"
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../assets/font/font.css";
@import "../../../style/mixin.less";
.register {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  /deep/.van-nav-bar__right {
    bottom: 0.24rem;
    .history {
      width: 0.32rem;
      height: 0.32rem;
      line-height: 1rem;
      .bg-image("../../../../static/img/history");
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
  .main {
    flex: 1;
    padding-top: 0.8rem;
    p {
      margin: 0;
      font-size: 0.3rem;
    }
    .NO_DAO {
      width: 6.06rem;
      height: 4.84rem;
      margin: 0.5rem auto;
      .bg-image("../../../../static/img/NO_DAO");
      background-repeat: no-repeat;
      background-size: contain;
    }

    .ZEC {
      width: 6.06rem;
      height: 4.83rem;
      margin: 0.5rem auto;
      .bg-image("../../../../static/img/dipan");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: bottom;
      padding-top: 1rem;
      box-sizing: border-box;
      position: relative;
      // 会飞的球
      .dao {
        width: 1.1rem;
        height: 1.1rem;
        .bg-image("../../../../static/img/qiu");
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        position: absolute;
        z-index: 99;
        opacity: 0;
        &:nth-of-type(1) {
          @size: 58%;
          top: 1.78rem;
          right: 0.4rem;
          background-size: @size;
        }
        &:nth-of-type(2) {
          @size: 58%;
          top: 1.4rem;
          left: 0.42rem;
          background-size: @size;
        }
        &:nth-of-type(3) {
          @size: 58%;
          top: 2.64rem;
          left: 2.1rem;
          background-size: @size;
        }
      }
      .feidao {
        animation: fly 4.5s ease;
      }
      // 剩下的四个矿机
      .kuangji {
        margin-top: -2rem;
        position: relative;
        width: 100%;
        height: 100%;
        p {
          a {
            width: 1.12rem;
            height: 1.26rem;
            position: absolute;
            .bg-image("../../../../static/img/jishen");
            background-repeat: no-repeat;
            background-size: contain;
            span {
              position: absolute;
              width: 0.8rem;
              height: 1.1rem;
              .bg-image("../../../../static/img/languang");
              background-repeat: no-repeat;
              background-size: 100%;
              left: 0.18rem;
              top: -0.7rem;
            }
            .ishuangguang {
              .bg-image("../../../../static/img/huangguang");
            }
          }
          &:nth-of-type(1) {
            a {
              right: 0.4rem;
              bottom: -0.8rem;
            }
          }
          &:nth-of-type(2) {
            a {
              bottom: -0.4rem;
              left: 0.4rem;
            }
          }
          &:nth-of-type(3) {
            a {
              bottom: -1.66rem;
              left: 2.08rem;
            }
          }
        }
      }
    }
    .style {
      position: relative;
      .day {
        margin: 0 auto;
        line-height: 0.32rem;
        font-size: 0.3rem;
        font-family: "计算器类";
      }
      .days {
        min-width: 0.6rem;
        height: 0.32rem;
        line-height: 0.32rem;
        position: absolute;
        right: 0.92rem;
        bottom: -0.66rem;
        border: 1px solid #006fdf;
        color: #006fdf;
        border-radius: 5px;
        font-size: 0.24rem;
        padding: 0 4px;
      }
      .watch {
        bottom: -1.1rem;
      }
    }
    .exchange {
      width: 3.44rem;
      height: 0.82rem;
      line-height: 0.82rem;
      border-radius: 0.1rem;
      margin: 0.3rem auto 0;
      background: rgba(214, 177, 24, 0.01);
      color: #2659ff !important;
      display: flex;
      text-align: center;
      span {
        display: inline-block;
        width: 100%;
      }
    }
    .plain {
      margin-top: 0.1rem;
    }
    /deep/.van-button--disabled {
      background: transparent !important;
      border-color: #888 !important ;
      color: #888 !important ;
    }
  }
}
@keyframes fly {
  0% {
    transform: translateY(0rem);
    opacity: 1;
  }

  100% {
    transform: translateY(-2rem);
    background-size: 100%;
    opacity: 0;
  }
}
</style>