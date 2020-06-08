<template>
  <div class="home-index" ref="home">
    <div class="home-top">
      <div class="top">
        <p class="logo"></p>
      </div>
      <div @scroll="scrollChange" class="THWJ">
        <!-- 总资产那个黑框框 -->
        <div class="zongzichan">
          <div class="bg left_qiu"></div>
          <div class="bg right_qiu"></div>
          <!-- 总资产内容 -->
          <div class="content" style="margin-bottom: .3rem">
            <div @click="goRoute('detailRevenue','methods','USER_ACCOUNT_DATEILS_VIEW')">
              <p
                class="yellowColor"
                style="margin: .1rem 0"
              >{{Number(hgfTotal).toFixed(3).slice(0,-1)}}</p>
              <!-- USDT -->
              <p class="whiteColor" style="margin:0">{{$t('资产')}} (HGF)</p>
            </div>
          </div>
          <!-- WJ和USDT的余额 -->
          <div class="zichan-bottom">
            <div @click="goRoute('detailRevenue','methods','USER_HONOR_VIEW')" class="money">
              <p class="yellowColor">{{Number(honor).toFixed(3).slice(0,-1)}}</p>
              <p class="danwei">荣誉值</p>
            </div>
            <div @click="goRoute('detailRevenue','methods','QUERY_BUY_PRODUCT_VIEW')" class="money">
              <p
                class="yellowColor"
                style="margin-left: -10%;"
              >{{Number(activityNum).toFixed(3).slice(0,-1)}}</p>
              <p class="danwei" style="margin-left: -10%;padding: 0 .5rem">{{$t('活跃度')}}</p>
            </div>
            <!-- 赠送 -->
            <div
              @click="goRoute('detailRevenue','methods','REGISTRATION_AWARD_VIEW')"
              class="money"
            >
              <p
                class="yellowColor"
                style="margin-left: -10%;"
              >{{Number(contribution).toFixed(3).slice(0,-1)}}</p>
              <p class="danwei" style="margin-left: -10%;padding: 0 .5rem">{{$t('贡献度')}}</p>
            </div>
          </div>
        </div>
        <!-- 底部可以滑动的东西 -->
        <div class="scroll-bottom">
          <div class="background">
            <!-- 充值和提现按钮 -->
            <div class="buttons">
              <div @click="goRoute('recharge')" class="pic-button">
                <p class="pic chongzhi"></p>
                <p>{{$t('充值')}}</p>
              </div>
              <div @click="goRoute('cashWithdrawal')" class="pic-button">
                <p class="pic zhuanzhang"></p>
                <p>{{$t('转账')}}</p>
              </div>
              <div @click="goRoute('activityCenter')" class="pic-button">
                <p class="pic huodong"></p>
                <p>{{$t('活动')}}</p>
              </div>
              <div @click="goRoute('allInformation')" class="pic-button">
                <p class="pic xiaoxi"></p>
                <p>{{$t('消息')}}</p>
                <div class="msg" v-if="count">{{count}}</div>
              </div>
            </div>
            <!-- 下面的轮播图 -->
            <div class="lazy_swiper">
              <van-swipe :autoplay="3000">
                <van-swipe-item
                  :key="index"
                  @click="goRoute('informationDetail','item',image)"
                  v-for="(image, index) in advertise"
                >
                  <img v-lazy="image.img" />
                </van-swipe-item>
              </van-swipe>
            </div>
            <!-- 咨询 -->
            <div class="advisory">
              <div class="adv_top">
                <p>{{$t('行情')}}</p>
              </div>
              <div class="flex" v-if="QuotationList.length">
                <div class="mes">
                  <div :key="index" class="mes_once" v-for="(item,index) in QuotationList">
                    <div class="mes_name">
                      <img
                        :src="imgList.findIndex(_=>_===item.type) > -1 ? require('#/img/'+item.type+'@2x.png') : require('#/img/BTC@2x.png')"
                        alt
                      />
                      {{item.name}}
                    </div>
                    <div
                      class="mes_money"
                    >{{String(item.price).indexOf('.') > 0 ? item.price.toFixed( 6-String(item.price).indexOf('.')) : item.price.toFixed(6-String(item.price).length)}}USDT</div>
                    <div
                      :class="+item.daily_rate>=0 ? 'class1' : 'class2'"
                      class="mes_press"
                    >{{(+item.daily_rate).toFixed(2)}}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { formateDate } from "@/utils/date";

export default {
  data () {
    return {
      imgList: ["BTC", "ETH", "ZEC", "BCH", "LTC", "EOS", "XRP"],
      price_time: "",
      hgfTotal: 0,
      honor: 0,
      activityNum: 0,
      contribution: 0,
      count: 0,
      advertise: [],
      obj: {
        time: "",
        top: "昨日收益"
      },
      QuotationList: []
    };
  },
  computed: {
    ...mapState(["LOADING", "news_list"]),
    ...mapGetters(["get_chickens"])
  },
  created () {
    this.isAct = localStorage.getItem("language") === "en" ? true : false;
    this.user_asset_view();
    let prevday = new Date().getTime() - 24 * 3600 * 1000 * 2;
    let YY = new Date(prevday).getFullYear();
    let MM =
      new Date(prevday).getMonth() + 1 > 9
        ? new Date(prevday).getMonth() + 1
        : "0" + (new Date(prevday).getMonth() + 1);
    let DD =
      new Date(prevday).getDate() + 1 > 9
        ? new Date(prevday).getDate() + 1
        : "0" + (new Date(prevday).getDate() + 1);
    this.obj.time = YY + "-" + MM + "-" + DD;
    this.price_view();
    this.price_time = setInterval(this.price_view, 10 * 1000);
  },
  mounted () {
    if (window.history && window.history.pushState) {
      // 向历史记录中插入了当前页
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
  },
  beforeDestroy () {
    clearInterval(this.price_time)
    this.price_time = null
  },
  destroyed () {
    window.removeEventListener("popstate", this.goBack, false);
  },

  filters: {
    formate (time) {
      let date = new Date(time);
      return formateDate(date, "YYYY-MM-dd hh:mm");
    }
  },
  methods: {
    scrollChange (e) {
      let scrollTop = e.target.scrollTop;
      if (scrollTop < 20) {
        this.$refs.home.className = "home-index";
      } else {
        this.$refs.home.className = "home1-index";
      }
    },
    //获取总资产的数据
    user_asset_view () {
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "USER_ASSET_VIEW"
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.hgfTotal = data.Data.hgfTotal;
            this.honor = data.Data.honor;
            this.activityNum = data.Data.activityNum;
            this.contribution = data.Data.contribution;
            this.advertise = data.Data.advertise
            this.count = data.Data.count
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    // 这里是行情的数据
    price_view () {
      // PRICE_VIEW
      this.mview.socket.send({
        data: {
          method: "PRICE_VIEW"
        },
        success: data => {
          if (data.Code == 0) {
            this.QuotationList = data.Data.coinprice;
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },

    // 路由链接
    goRoute (name, paramsName, params) {
      this.$router.push({
        name: name,
        params: { [paramsName]: params }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../../style/mixin.less';
.home-index {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  &::before {
    content: ' ';
    opacity: 1;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
.home1-index {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  &::before {
    content: ' ';
    opacity: 1;
    width: 100%;
    height: 1.5rem;
    background: #000;
    position: absolute;
    top: 0;
    left: 0;
  }
}
.home-top {
  height: 100%;
  overflow: hidden;
  font-size: 0.4rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  z-index: 1;
  .top {
    display: flex;
    justify-content: space-between;
    padding: 0.7rem 0.3rem 0;
    background: #ef314b;
    .logo {
      width: 2.04rem;
      height: 0.78rem;
      line-height: 0.4rem;
      .bg-image('../../../../static/img/logo-home');
      background-repeat: no-repeat;
      background-size: contain;
      margin: 0;
    }
    .languageChose {
      margin-top: 0.1rem;
      a {
        display: inline-block;
        width: 0.38rem;
        height: 0.35rem;
        .bg-image('../../../../static/img/zhongwen');
        background-size: contain;
        background-repeat: no-repeat;
      }
      .isact {
        .bg-image('../../../../static/img/yingwen');
      }
    }
  }
  .THWJ {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    position: relative;
  }
  .zongzichan {
    height: 3.7rem;
    padding: 0.5rem 0.3rem 0;
    position: relative;
    background: #ef314b;
    .bg {
      position: absolute;
      width: 1.14rem;
      height: 2.3rem;
      background-size: contain;
      background-repeat: no-repeat;
    }
    .left_qiu {
      .bg-image('../../../../static/img/zuobiande');
      left: 0;
      bottom: 0;
    }
    .right_qiu {
      width: 0.8rem;
      height: 2.54rem;
      .bg-image('../../../../static/img/youbiande ');
      right: 0;
      bottom: 1.08rem;
    }
    .top {
      display: flex;
      justify-content: space-between;
      color: #fff;
      font-size: 0.28rem;
      padding: 0;
      p {
        margin: 0.33rem 0 0 0.35rem;
        color: #fff;
        a {
          display: inline-block;
          width: 0.35rem;
          height: 0.2rem;
          .bg-image('../../../../static/img/kejian');
          background-repeat: no-repeat;
          background-size: contain;
          margin: 0 0.1rem;
        }
        .iskejian {
          .bg-image('../../../../static/img/bukejian');
        }
      }
    }
    .content {
      font-size: 0.48rem;
      display: flex;
      justify-content: center;
      position: relative;
      a {
        display: inline-block;
        width: 0.44rem;
        height: 0.44rem;
        .bg-image('../../../../static/img/NOG');
        background-repeat: no-repeat;
        background-size: contain;
      }
      .yellowColor {
        margin: 0.3rem 0;
        font-size: 0.78rem;
      }
      .whiteColor {
        color: #fff;
        font-size: 0.36rem;
      }
      .duihuan {
        font-size: 0.14rem;
        font-weight: normal;
        color: #000;
        border: 1px solid #000;
        border-radius: 5px;
        line-height: 0.24rem;
        height: 0.24rem;
        padding: 1px 5px;
        text-align: center;
        margin-left: 1.48rem;
        margin-top: 0.78rem;
        position: absolute;
        left: 3.2rem;
      }
    }
    .zichan-bottom {
      position: relative;
      display: flex;
      justify-content: space-between;
      font-size: 0.3rem;
      z-index: 2;
      p {
        margin: 0;
        color: #fff;
      }
      .money {
        width: 50%;
        position: relative;
        &:first-of-type::after,
        &:nth-of-type(2)::after {
          position: absolute;
          right: 0;
          top: 10%;
          height: 0.7rem;
          width: 2px;
          border-radius: 50%;
          background: #c6c6c6;
          display: block;
          content: ' ';
        }
      }
      .danwei {
        font-size: 0.28rem;
        line-height: 0.4rem;
        span {
          font-size: 0.24rem;
          color: #fff;
        }
      }
    }
  }
  // background: pink;
}
.scroll-bottom {
  flex: 1;
  width: 100%;
  position: absolute;
  top: 3.4rem;
  padding: 0 0 0.5rem;
  box-sizing: border-box;
  background: #fff;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  z-index: 1;
}
.buttons {
  display: flex;
  justify-content: space-between;
  margin: 0.3rem;
  .pic-button {
    width: 1.5rem;
    position: relative;
    p {
      margin: 0;
      font-size: 0.24rem;
    }
    .pic {
      width: 0.98rem;
      height: 0.98rem;
      background-repeat: no-repeat;
      background-size: contain;
      margin: auto;
    }
    .chongzhi {
      .bg-image('../../../../static/img/chongzhi');
    }
    .zhuanzhang {
      .bg-image('../../../../static/img/zhuanzhang');
    }
    .huodong {
      .bg-image('../../../../static/img/huodong');
    }
    .xiaoxi {
      .bg-image('../../../../static/img/xiaoxi');
    }
    .msg {
      position: absolute;
      right: 0.1rem;
      top: 0;
      background: #ff0000;
      border-radius: 0.16rem;
      font-size: 0.24rem;
      color: #fff;
      border: 1px solid #fff;
      padding: 0 8px;
      line-height: 0.3rem;
    }
  }
}
/deep/.lazy_swiper {
  width: 100%;
  height: 2.86rem;
  background: #f7f7f7;
  display: flex;
  justify-content: center;
  align-items: center;
  .van-swipe {
    width: 7.14rem;
    height: 2.76rem;
  }
  .van-swipe-item {
    width: 7.14rem;
  }
  img {
    width: 98%;
    height: 2.36rem;
    margin: 0 1%;
    border-radius: 0.3rem;
  }
  /deep/.van-swipe__indicators {
    bottom: 0.1rem;
  }
}
.advisory {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.4rem;
  .adv_top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0;
    padding: 0;
    overflow: hidden;
    border-bottom: 1px solid #ececec;
    p {
      height: 0.28rem;
      line-height: 1;
      margin: 0.34rem 0.3rem;
      font-size: 0.32rem;
      color: #333;
      margin-left: 0.74rem;
      position: relative;
      &::before {
        content: ' ';
        position: absolute;
        width: 0.32rem;
        height: 0.32rem;
        left: -0.4rem;
        top: -2px;
        .bg-image('../../../../static/img/hangqing');
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }
  .mes {
    width: 90%;
    margin: 0 auto;
    flex: 1;
    overflow: auto;
    .mes_once {
      font-size: 0.3rem;
      line-height: 1.24rem;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
      .mes_name {
        width: 1.6rem;
        display: flex;
        justify-content: flex-start;
        height: 0.56rem;
        margin: auto;
        margin-right: 0.2rem;
        line-height: 0.56rem;
        img {
          width: 0.56rem;
          margin-right: 0.1rem;
          vertical-align: middle;
        }
      }
      .mes_money {
        text-align: left;
        flex: 1;
      }
      .mes_press {
        // width: 1rem;
        padding-right: 0.3rem;
        text-align: right;
        background-repeat: no-repeat;
        background-size: 0.24rem;
        background-position: right center;
      }
      .class1 {
        color: red;
        .bg-image('../../../../static/img/up');
      }
      .class2 {
        color: #1ccc0a;
        .bg-image('../../../../static/img/xia');
      }
    }
  }
}

.noData {
  margin: auto;
  .img {
    width: 2.3rem;
    height: 1.9rem;
    margin: 0rem auto 0.3rem;
    .bg-image('../../../../static/img/zanwushuju');
    background-repeat: no-repeat;
    background-size: contain;
  }
  p {
    color: #4f5260;
    font-size: 0.4rem;
    margin: 0;
  }
}
@media screen and (min-width: 768px) and (max-width: 1024px) {
  .van-popup {
    max-height: 7.4rem;
  }
}
</style>