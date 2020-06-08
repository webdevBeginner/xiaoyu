<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('未来工场')">
      <template #right>
        <div @click="goRoute('history','method','QUERY_BUY_PRODUCT_LIST')" class="history"></div>
      </template>
    </van-nav-bar>

    <!-- 这里显示所有的矿机轮播 -->
    <div class="HGF">
      <van-swipe class="my-swipe" indicator-color="#EF314B">
        <van-swipe-item :key="index" v-for="(item,index) in HGFList">
          <div class="dipan">
            <div :class="item.name" class="kuangji">
              <p :key="g+i" class="guang" v-for="(g,i) in item.guang_num">
                <!-- <a
                  :class="item === flyIndex ? 'feidao' : ''"
                  :key="item"
                  class="dao"
                  v-for="item in 3"
                ></a>-->
              </p>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="main" v-show="!LOADING">
      <!-- <div :class="item === flyIndex ? 'feidao' : ''" :key="item" class="dao" v-for="item in 3"></div>
        <div class="kuangji">
          <p :key="item" v-for="item in 3">
            <a v-if="badgeList.length">
              <span :class="baiguang === item ? 'isbaiguang' : ''"></span>
            </a>
          </p>
      </div>-->

      <!-- 下面投入本金的地方 -->
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
        <div @click="goRoute('Revenue')" class="days watch">{{$t('查看')}}</div>
        <div class="days" v-if="Data.day">{{Data.day}}{{$t('天')}}</div>
      </div>
      <van-button @click="badgeRoute" class="exchange" color="#EF314B" plain>{{$t('参与DAO')}}</van-button>
      <van-button @click="goMyBadge" class="exchange" color="#EF314B" plain>{{$t('DAO列表')}}</van-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapGetters } from "vuex";
export default {
  data () {
    const vm = this;
    return {
      // 星云列表
      Data: {
        day: 7,
        money: 0.0
      },
      id: 0,
      badgeList: [],
      baiguang: 1,
      baiguang_set: null,
      seconds_set: null,
      timer: null,
      income: 0,
      income_next: 0,
      flyIndex: 0,


      // 矿机列表
      HGFList: [
        {
          name: 'yiji',
          guang_num: 2,
        }, {
          name: 'yiji',
          guang_num: 2,
        }, {
          name: 'zhongji',
          guang_num: 4,
        }, {
          name: 'jinjie',
          guang_num: 6,
        }, {
          name: 'gaoji',
          guang_num: 6,
        }, {
          name: 'jingying',
          guang_num: 7,
        }, {
          name: 'chaoji',
          guang_num: 7,
        }, {
          name: 'zhuanjia',
          guang_num: 8,
        }
      ]
    };
  },
  computed: {
    ...mapState(["LOADING"]),
    ...mapGetters(["get_chickens"])
  },
  created () {
    this.init();
    this.seconds_set ? clearInterval(this.seconds_set) : null;
    this.seconds_set = null;
    this.baiguang_set ? clearInterval(this.baiguang_set) : null;
    this.baiguang_set = null;
  },
  beforeDestroy () {
    clearInterval(this.timer);
    clearInterval(this.baiguang_set);
    clearInterval(this.seconds_set);
    this.baiguang_set = null;
    this.seconds_set = null;
    this.timer = null;
  },
  methods: {
    // 初始化拿到当前的矿机产品
    init () {
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
    initList () {
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
    get_eth () {
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
                clearInterval(vm.baiguang_set);
                vm.baiguang_set = null;
              }, 59000);
              vm.baiguang_set = setInterval(() => {
                if (vm.baiguang > 2) {
                  vm.baiguang = 1;
                } else {
                  vm.baiguang++;
                }
              }, 2000);
            }
          } else {
            vm.$toast(vm.$t(data.Message));
          }
        }
      });
    },
    goRoute (name, paramsName, params) {
      this.$router.push({
        name: name,
        params: { [paramsName]: params }
      });
    },
    badgeRoute () {
      this.$router.push({
        name: "purchase"
      });
    },
    goMyBadge () {
      this.$router.push({
        name: "myBadge"
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../../assets/font/font.css';
@import '../../../style/mixin.less';
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
      .bg-image('../../../../static/img/history');
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
  .HGF {
    width: 100%;
    height: 6.2rem;
    margin: 0.5rem auto;
    padding-top: 1rem;
    box-sizing: border-box;
    position: relative;
    .my-swipe .van-swipe-item {
      color: #fff;
      font-size: 20px;
      height: 6.2rem;
      line-height: 6.2rem;
      text-align: center;
      .dipan {
        width: 100%;
        height: 6.3rem;
        .bg-image('../../../../static/img/dipan');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: 0 70%;
      }
      .kuangji {
        position: relative;
        margin: auto;
        width: 5.9rem;
        height: 3.3rem;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: bottom;
        padding-top: 20%;
        .guang {
          position: absolute;
          background-repeat: no-repeat;
          background-size: contain;
        }
        .isbaiguang {
          .bg-image('../../../../static/img/baiguang');
        }
      }
      .yiji {
        .bg-image('../../../../static/img/yiji');
        p {
          width: 1.04rem;
          height: 1.5rem;
          .bg-image('../../../../static/img/hongguang');
          &:nth-child(1) {
            left: 0.96rem;
            top: 0.92rem;
          }
          &:nth-child(2) {
            left: 1.66rem;
            top: 0.7rem;
          }
        }
      }
      .zhongji {
        width: 7.34rem;
        height: 3.4rem;
        padding-top: 23%;
        .bg-image('../../../../static/img/zhongji');
        p {
          .bg-image('../../../../static/img/lvguang');
          &:nth-child(1) {
            width: 0.26rem;
            height: 0.46rem;
            left: 2.26rem;
            top: 1.72rem;
          }
          &:nth-child(2) {
            width: 0.54rem;
            height: 0.88rem;
            left: 2.86rem;
            bottom: 0.32rem;
          }
          &:nth-child(3) {
            width: 0.54rem;
            height: 0.88rem;
            left: 3.14rem;
            bottom: 0.44rem;
          }
          &:nth-child(4) {
            .bg-image('../../../../static/img/lvguang_ce');
            width: 1.18rem;
            height: 1.4rem;
            right: 0.82rem;
            top: -2px;
          }
        }
      }
      .jinjie {
        width: 7.1rem;
        height: 4.26rem;
        padding-top: 10%;
        .bg-image('../../../../static/img/jinjie');
        p {
          width: 0.76rem;
          height: 1.44rem;
          .bg-image('../../../../static/img/languang');
          &:nth-child(1) {
            left: 1rem;
            bottom: 0.56rem;
          }
          &:nth-child(2) {
            left: 2.48rem;
            top: 1.14rem;
          }
          &:nth-child(3) {
            width: 0.54rem;
            height: 0.96rem;
            left: 3.44rem;
            bottom: 0.6rem;
          }
          &:nth-child(4) {
            width: 0.34rem;
            height: 0.9rem;
            right: 1.98rem;
            top: 1.72rem;
          }
          &:nth-child(5) {
            width: 0.34rem;
            height: 0.9rem;
            right: 1.3rem;
            top: 2.04rem;
          }
          &:nth-child(6) {
            width: 0.52rem;
            height: 0.9rem;
            right: 0.18rem;
            top: 2.2rem;
          }
        }
      }
      .gaoji {
        width: 6.9rem;
        height: 4.26rem;
        padding-top: 10%;
        .bg-image('../../../../static/img/gaoji');
        p {
          width: 0.76rem;
          height: 1.34rem;
          .bg-image('../../../../static/img/ziguang');
          &:nth-child(1) {
            left: 0.22rem;
            bottom: 0.86rem;
          }
          &:nth-child(2) {
            left: 2.28rem;
            top: 1.18rem;
          }
          &:nth-child(3) {
            width: 0.54rem;
            height: 0.96rem;
            left: 3.26rem;
            bottom: 0.6rem;
          }
          &:nth-child(4) {
            width: 0.54rem;
            height: 0.96rem;
            left: 2.56rem;
            top: 0.86rem;
          }
          &:nth-child(5) {
            width: 0.54rem;
            height: 0.96rem;
            right: 1.82rem;
            top: 2rem;
          }
          &:nth-child(6) {
            width: 0.52rem;
            height: 0.9rem;
            right: 0.16rem;
            top: 2.14rem;
          }
        }
      }
      .jingying {
        width: 6.7rem;
        height: 4.26rem;
        padding-top: 16%;
        .bg-image('../../../../static/img/jingying');
        p {
          width: 0.56rem;
          height: 1.34rem;
          .bg-image('../../../../static/img/chengguang');
          &:nth-child(1) {
            left: 0.36rem;
            bottom: 0.6rem;
          }
          &:nth-child(2) {
            width: 0.76rem;
            left: 0.5rem;
            top: 0.7rem;
          }
          &:nth-child(3) {
            left: 2.22rem;
            top: 1.74rem;
          }
          &:nth-child(4) {
            width: 0.46rem;
            height: 1.1rem;
            right: 2.46rem;
            top: 1.26rem;
          }
          &:nth-child(5) {
            width: 0.46rem;
            height: 1.1rem;
            right: 1.64rem;
            top: 1.7rem;
          }
          &:nth-child(6) {
            width: 0.76rem;
            right: 1.06rem;
            top: 2.7rem;
          }
          &:nth-child(7) {
            width: 0.76rem;
            right: 0.2rem;
            top: 2.5rem;
          }
        }
      }
      .chaoji {
        width: 100%;
        height: 4.26rem;
        padding-top: 16%;
        .bg-image('../../../../static/img/chaoji');
        p {
          width: 0.56rem;
          height: 1.34rem;
          .bg-image('../../../../static/img/huangguang');
          &:nth-child(1) {
            left: 0.42rem;
            bottom: 1.26rem;
          }
          &:nth-child(2) {
            width: 0.76rem;
            left: 0.74rem;
            top: 0.1rem;
          }
          &:nth-child(3) {
            right: 2.2rem;
            top: -0.68rem;
          }
          &:nth-child(4) {
            right: 1.22rem;
            top: -0.24rem;
          }
          &:nth-child(5) {
            width: 1.2rem;
            height: 1.68rem;
            right: 1.56rem;
            top: 0.44rem;
          }
          &:nth-child(6) {
            right: 2.34rem;
            bottom: 0.22rem;
          }
          &:nth-child(7) {
            right: 0.62rem;
            bottom: 0.84rem;
          }
        }
      }
      .zhuanjia {
        width: 99%;
        height: 4.26rem;
        padding-top: 16%;
        .bg-image('../../../../static/img/zhuanjia');
        p {
          width: 0.76rem;
          height: 1.34rem;
          .bg-image('../../../../static/img/huangguang');
          &:nth-child(1) {
            .bg-image('../../../../static/img/chengguang');
            width: 0.84rem;
            height: 2rem;
            left: 0.42rem;
            bottom: 1.06rem;
          }
          &:nth-child(2) {
            .bg-image('../../../../static/img/languang');
            width: 0.68rem;
            height: 1.38rem;
            left: 0.84rem;
            top: 1.16rem;
          }
          &:nth-child(3) {
            left: 2.58rem;
            top: 0.2rem;
          }
          &:nth-child(4) {
            .bg-image('../../../../static/img/ziguang');
            left: 3.1rem;
            top: 2.24rem;
          }
          &:nth-child(5) {
            right: 2.16rem;
            top: 0.18rem;
          }
          &:nth-child(6) {
            .bg-image('../../../../static/img/chengguang');
            width: 0.58rem;
            right: 2.16rem;
            bottom: 0.22rem;
          }
          &:nth-child(7) {
            .bg-image('../../../../static/img/languang');
            width: 0.84rem;
            height: 2rem;
            right: 1rem;
            bottom: 0.9rem;
          }
          &:nth-child(8) {
            right: 0.12rem;
            bottom: 1.84rem;
          }
        }
      }
    }
    // 会飞的球
    .dao {
      width: 1.1rem;
      height: 1.1rem;
      .bg-image('../../../../static/img/qiu');
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
          .bg-image('../../../../static/img/jishen');
          background-repeat: no-repeat;
          background-size: contain;
          span {
            position: absolute;
            width: 0.8rem;
            height: 1.1rem;
            .bg-image('../../../../static/img/languang');
            background-repeat: no-repeat;
            background-size: 100%;
            left: 0.18rem;
            top: -0.7rem;
          }
          .isbaiguang {
            .bg-image('../../../../static/img/baiguang');
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
  .main {
    // flex: 1;
    // padding-top: 0.8rem;
    margin-top: 1rem;
    p {
      margin: 0;
      font-size: 0.3rem;
    }
    .NO_DAO {
      width: 6.06rem;
      height: 4.84rem;
      margin: 0.5rem auto;
      .bg-image('../../../../static/img/NO_DAO');
      background-repeat: no-repeat;
      background-size: contain;
    }

    .style {
      position: relative;
      .day {
        margin: 0 auto;
        line-height: 0.32rem;
        font-size: 0.3rem;
        font-family: '计算器类';
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
      color: #ef314b !important;
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