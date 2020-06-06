<template>
  <div class="home-index" ref="home">
    <div class="home-top">
      <div class="top">
        <p class="logo"></p>
        <div class="languageChose">
          <a :class="{isact : isAct}" @click="changeLanguage"></a>
        </div>
      </div>
      <div class="THWJ" @scroll="scrollChange">
        <!-- 总资产那个黑框框 -->
        <div class="zongzichan">
          <!-- 总资产上面 -->
          <div class="top">
            <p>
              {{$t('我的总资产')}}
              <!-- 可见不可见的切换 -->
              <a :class="{iskejian: isKejian}" @click="changeWatch"></a>
            </p>
          </div>
          <!-- 总资产内容 -->
          <div class="content" style="margin-bottom: .3rem">
            <div>
              <p
                style="margin: .1rem 0"
                class="yellowColor"
                v-if="!isKejian"
              >{{Number(assetsTotal).toFixed(3).slice(0,-1)}}</p>
              <p style="margin: .1rem 0" v-else class="yellowColor">******</p>
              <!-- USDT -->
              <p style="margin:0" class="whiteColor">{{$t('总资产')}} (ZEC)</p>
            </div>
          </div>
          <!-- WJ和USDT的余额 -->
          <div class="zichan-bottom">
            <div class="money" @click="goRoute('history','method','QUERY_BUY_PRODUCT_LIST')">
              <p
                v-if="!isKejian"
                class="yellowColor"
              >{{Number(productTotal).toFixed(3).slice(0,-1)}}</p>
              <p v-else class="yellowColor">******</p>
              <p class="danwei">ZDAO</p>
            </div>
            <div class="money" @click="goRoute('detailRevenue')">
              <p
                v-if="!isKejian"
                style="margin-left: -10%;"
                class="yellowColor"
              >{{Number(zecTotal).toFixed(3).slice(0,-1)}}</p>
              <p v-else style="margin-left: -10%" class="yellowColor">******</p>
              <p style="margin-left: -10%;padding: 0 .5rem" class="danwei">
                {{$t('可用')}}
                <span v-if="!isAct">(ZEC)</span>
              </p>
            </div>
            <!-- 赠送 -->
            <div
              class="money"
              @click="goRoute('detailRevenue','methods','REGISTRATION_AWARD_LIST')"
            >
              <p
                v-if="!isKejian"
                style="margin-left: -10%;"
                class="yellowColor"
              >{{Number(giveZec).toFixed(3).slice(0,-1)}}</p>
              <p v-else style="margin-left: -10%" class="yellowColor">******</p>
              <p style="margin-left: -10%;padding: 0 .5rem" class="danwei">
                {{$t('赠送')}}
                <span v-if="!isAct">(ZEC)</span>
              </p>
            </div>
          </div>
        </div>
        <!-- 底部可以滑动的东西 -->
        <div class="scroll-bottom">
          <div class="background">
            <!-- 通知公告 -->
            <div class="swipe">
              <van-icon name="volume-o"></van-icon>
              <swiper :options="swiperOption" ref="swipe">
                <swiper-slide v-for="(item, index) in notic_list" :key="index">
                  <p class="swiper-no-swiping">{{item}}</p>
                </swiper-slide>
              </swiper>
            </div>

            <!-- 充值和提现按钮 -->
            <div class="buttons">
              <div class="pic-button" @click="goRoute('recharge')">
                <p class="pic chongzhi"></p>
                <p>{{$t('充值')}}</p>
              </div>
              <div class="pic-button" @click="goRoute('cashWithdrawal')">
                <p class="pic zhuanzhang"></p>
                <p>{{$t('转账')}}</p>
              </div>
              <div class="pic-button" @click="hangqingShow = true">
                <p class="pic hangqing"></p>
                <p>{{$t('行情')}}</p>
              </div>
            </div>

            <!-- 咨询 -->
            <div class="advisory">
              <div class="adv_top">
                <p>{{$t('资讯')}}</p>
                <p @click="goRoute('allInformation')">{{$t('更多资讯')}}>></p>
              </div>
              <div v-if="adv_list.length" class="flex">
                <div
                  class="advisory_content"
                  v-for="(item,index) in adv_list"
                  :key="index"
                  @click="goRoute('informationDetail','item',item)"
                >
                  <div class="adv_act">
                    <div class="adv_title">{{item.title}}</div>
                    <p class="adv_cont">{{item.content}}</p>
                    <div class="act_bottom">
                      <span>{{$t('来自')}}{{item.author}}</span>
                      <span>{{new Date(item.date) | formate}}</span>
                    </div>
                  </div>
                  <div class="adv_img">
                    <img :src="item.icon ? item.icon : require('#/img/gonggao@2x.png')" alt />
                  </div>
                </div>
              </div>
              <div class="noData" v-if="!adv_list.length">
                <div class="img"></div>
                <p>{{$t('暂无数据')}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <van-popup v-model="hangqingShow">
        <div class="mes_title">{{$t('行情')}}</div>
        <div class="mes">
          <div class="mes_once" v-for="(item,index) in QuotationList" :key="index">
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
              class="mes_press"
              :class="+item.daily_rate>=0 ? 'class1' : 'class2'"
            >{{(+item.daily_rate).toFixed(2)}}%</div>
          </div>
        </div>
        <van-button
          class="mes_btn"
          type="info"
          color="#006FDF"
          size="large"
          @click="hangqingShow = false"
        >{{$t('确定')}}</van-button>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { mapGetters, mapState } from "vuex";
import { formateDate } from "@/utils/date";
export default {
  components: { swiper, swiperSlide },
  data() {
    return {
      imgList: ["BTC", "ETH", "ZEC", "BCH", "LTC", "EOS", "XRP"],
      isKejian: false,
      isAct: false,
      hangqingShow: false,
      value: 0,
      price_time: "",
      notice_time: "",
      notic_list: ["", `用户132****2312提现200ZEC`],
      assetsTotal: 0,
      productTotal: 0,
      zecTotal: 0,
      giveZec: 0,
      swiperOption: {
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        loop: false,
        noSwiping: true,
        direction: "vertical",
        autoplay: false
      },
      adv_list: [],
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
  watch: {
    hangqingShow(val) {
      if (val) {
        this.price_view();
        this.price_time = setInterval(this.price_view, 10 * 1000);
      } else {
        clearInterval(this.price_time);
      }
    }
  },
  created() {
    this.isAct = localStorage.getItem("language") === "en" ? true : false;
    this.user_asset_view();
    this.news_list.length ? (this.adv_list = this.news_list) : this.get_news();
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
  },
  mounted() {
    if (window.history && window.history.pushState) {
      // 向历史记录中插入了当前页
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
    this.notice_view();
    this.notice_time = setInterval(this.notice_view, 30 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.notice_time);
  },
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
  },

  filters: {
    formate(time) {
      let date = new Date(time);
      return formateDate(date, "YYYY-MM-dd hh:mm");
    }
  },
  methods: {
    scrollChange(e) {
      let scrollTop = e.target.scrollTop;
      if (scrollTop < 20) {
        this.$refs.home.className = "home-index";
      } else {
        this.$refs.home.className = "home1-index";
      }
    },
    // 更换是否可见状态
    changeWatch() {
      this.isKejian = !this.isKejian;
    },
    //获取总资产的数据
    user_asset_view() {
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "USER_ASSET_VIEW"
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.assetsTotal = data.Data.assetsTotal;
            this.productTotal = data.Data.productTotal;
            this.zecTotal = data.Data.zecTotal;
            this.giveZec = data.Data.giveZec;
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    // 这里是行情的数据
    price_view() {
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

    // 这里是公告的数据
    notice_view() {
      this.mview.socket.send({
        data: {
          method: "NOTICE_VIEW"
        },
        success: data => {
          if (data.Code == 0) {
            // 这里要传递一个参数，就是当前的数据
            let notice = "";
            let obj = data.Data;
            obj.date =
              localStorage.getItem("language") === "en"
                ? formateDate(new Date(obj.date), "MM-dd hh:mm")
                : formateDate(new Date(obj.date), "MM月dd日hh时mm分");
            notice =
              localStorage.getItem("language") === "en"
                ? `User ${obj.username[0] +
                    obj.username.replace(/.(?=.)/g, "*")} ${this.$t(
                    this.get_chickens(obj.action, "revenueList").name
                  )}${obj.amount}${
                    this.get_chickens(obj.coin_type, "coinKeyType").name
                  }`
                : `用户${obj.username[0] +
                    obj.username.replace(/.(?=.)/g, "*")} ${
                    this.get_chickens(obj.action, "revenueList").name
                  }${obj.amount}${
                    this.get_chickens(obj.coin_type, "coinKeyType").name
                  }`;
            this.get(notice);
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    get(notice) {
      this.value++;
      this.$refs.swipe.swiper.activeIndex = this.value;
      this.notic_list.splice(this.notic_list.length - 1, 0, notice);
      this.$refs.swipe.swiper.slideNext();
    },
    // 当前的新闻
    get_news() {
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "NEWS_VIEW",
          type: 3,
          page: 1,
          count: 4
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.adv_list = data.Data.lists;
            this.$store.commit("get_news_list", this.adv_list);
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    // 切换语言
    changeLanguage() {
      this.isAct = !this.isAct;
      // this.$router.push('')
      this.$i18n.locale = this.isAct ? "en" : "zh";
      localStorage.setItem("language", this.isAct ? "en" : "zh");
      this.notice_view();
    },
    // 路由链接
    goRoute(name, paramsName, params) {
      this.$router.push({
        name: name,
        params: { [paramsName]: params }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin.less";
.home-index {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #000;
  &::before {
    content: " ";
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
  background: #000;
  &::before {
    content: " ";
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
    .logo {
      width: 2.04rem;
      height: 0.78rem;
      line-height: 0.4rem;
      .bg-image("../../../../static/img/logo-home");
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
        .bg-image("../../../../static/img/zhongwen");
        background-size: contain;
        background-repeat: no-repeat;
      }
      .isact {
        .bg-image("../../../../static/img/yingwen");
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
    height: 4.7rem;
    margin: 0.5rem 0.3rem 0;
    background: #2659ff;
    border-radius: 0.3rem;
    box-shadow: 0px 0px 0.18rem 0px rgba(82, 11, 20, 0.13);
    position: static;
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
          .bg-image("../../../../static/img/kejian");
          background-repeat: no-repeat;
          background-size: contain;
          margin: 0 0.1rem;
        }
        .iskejian {
          .bg-image("../../../../static/img/bukejian");
        }
      }
    }
    .content {
      // margin-left: 1.72rem;
      font-size: 0.48rem;
      display: flex;
      justify-content: center;
      position: relative;
      // margin-left: 45%;
      a {
        display: inline-block;
        width: 0.44rem;
        height: 0.44rem;
        .bg-image("../../../../static/img/NOG");
        background-repeat: no-repeat;
        background-size: contain;
      }
      .yellowColor {
        margin: 0.3rem 0;
      }
      .whiteColor {
        color: #fff;
        font-size: 0.28rem;
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
        padding: 0 0.2rem;
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
          content: " ";
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
  .bg-image("../../../../static/img/banhu");
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  top: 3.8rem;
  .background {
    width: 100%;
    margin-top: 0.7rem;
    padding: 0 0.3rem 0.5rem;
    box-sizing: border-box;
    background-color: rgb(251, 248, 251);
    z-index: 1;
  }
}
.swipe {
  text-align: left;
  margin-bottom: 0.3rem;
  border-radius: 5px;
  color: #333;
  font-size: 0.24rem;
  height: 0.5rem;
  line-height: 0.5rem;
  padding: 0 0.1rem;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  .van-icon {
    margin: auto;
  }
  .swiper-container {
    margin-left: 0.1rem;
    flex: 1;
    p {
      margin: 0;
      width: 6.5rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.buttons {
  display: flex;
  justify-content: space-between;
  margin: 0.3rem 0.5rem;
  .pic-button {
    width: 1.5rem;
    p {
      margin: 0;
      font-size: 0.3rem;
    }
    .pic {
      width: 0.84rem;
      height: 0.84rem;
      background-repeat: no-repeat;
      background-size: contain;
      margin: auto;
    }
    .chongzhi {
      .bg-image("../../../../static/img/chongzhi");
    }
    .zhuanzhang {
      .bg-image("../../../../static/img/zhuanzhang");
    }
    .hangqing {
      .bg-image("../../../../static/img/hangqing");
    }
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
    p {
      font-size: 0.24rem;
      color: #999;
      line-height: 1;
      height: 0.28rem;
      margin: 0.1rem 0;
      &:first-of-type {
        font-size: 0.32rem;
        color: #333;
        margin-left: 0.1rem;
        position: relative;
        &::before {
          content: " ";
          position: absolute;
          width: 3px;
          height: 0.28rem;
          background: #2659ff;
          left: -0.1rem;
          top: 0;
        }
      }
    }
  }
  .advisory_content {
    margin-top: 0.2rem;
    height: 1.89rem;
    width: 100%;
    background: #fff;
    border-radius: 0.2rem;
    padding: 0.18rem;
    box-sizing: border-box;
    display: flex;
    .adv_act {
      flex: 1;
      .adv_title {
        width: 3.8rem;
        font-size: 0.3rem;
        text-align: left;
        line-height: 0.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .adv_cont {
        color: #999;
        font-size: 0.24rem;
        text-align: left;
        margin: 0;
        width: 3.8rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .act_bottom {
        width: 3.8rem;
        display: flex;
        justify-content: space-between;
        color: #999;
        font-size: 0.22rem;
        line-height: 0.6rem;
        span {
          &:first-of-type {
            width: 1.2rem;
            overflow: hidden;
            text-align: left;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .adv_img {
      width: 2.26rem;
      height: 100%;
      border: 1px solid rgba(255, 227, 72, 1);
      border-radius: 0.2rem;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.van-popup {
  width: 6rem;
  max-height: 15.4rem;
  border-radius: 0.14rem;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  display: flex;
  flex-direction: column;
  .mes_title {
    font-size: 0.34rem;
    line-height: 1.04rem;
    border-bottom: 1px solid #bbb;
  }
  .mes {
    width: 90%;
    margin: 0 auto;
    flex: 1;
    overflow: auto;
    .mes_once {
      font-size: 0.3rem;
      line-height: 1.04rem;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #d8d8d8;
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
        .bg-image("../../../../static/img/up");
      }
      .class2 {
        color: #1ccc0a;
        .bg-image("../../../../static/img/xia");
      }
    }
  }
  .mes_btn {
    width: 88%;
    height: 0.88rem;
    line-height: 0.88rem;
    margin: 0.48rem auto;
  }
}
.noData {
  margin: auto;
  .img {
    width: 2.3rem;
    height: 1.9rem;
    margin: 0rem auto 0.3rem;
    .bg-image("../../../../static/img/zanwushuju");
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