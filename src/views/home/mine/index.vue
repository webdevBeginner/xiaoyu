<template>
  <div class="mine-index">
    <!-- 头部 -->
    <div>
      <div class="mine-top">
        <div class="title"></div>
        <!-- 头像 -->
        <div class="image">
          <div class="image-yellow">
            <div class="image-linear">
              <van-image
                v-show="!LOADING"
                round
                width="1.2rem"
                height="1.2rem"
                :src="Avatar ? Avatar : require('#/img/morentouxiang@2x.png')"
              />
            </div>
          </div>
        </div>
        <!-- user_name -->
        <div class="user_name">{{nick_name}}</div>
      </div>
      <div class="mine-content">
        <!-- <van-cell-group> -->
        <div style="position:relative">
          <div class="bg bg3" />
          <van-cell :title="$t('邀请链接')" is-link to="/InvitationLink" />
        </div>
        <div style="position:relative">
          <div class="bg bg5" />
          <van-cell :title="$t('账号安全')" is-link to="/AccountSecurity" />
        </div>
        <div style="position:relative">
          <div class="bg bg7" />
          <van-cell :title="$t('账单明细')" is-link to="/BillDetails" />
        </div>
        <div style="position:relative">
          <div class="bg bg8" />
          <van-cell :title="$t('联系客服')" is-link to="/ContactCustomerService" />
        </div>
        <div style="position:relative">
          <div class="bg bg9" />
          <van-cell :title="$t('备份助记词')" is-link to="/remarkWord" />
        </div>
        <!-- </van-cell-group> -->
      </div>
    </div>
    <div class="share_link">
      <p class="link">{{$t('友情链接')}}</p>
      <div class="between">
        <div class="mango">
          <a @click="doCopy('https://guarda.com/shielded-wallet')" class="img"></a>
          <p>Wallet</p>
        </div>
        <div class="mtoken">
          <a @click="doCopy('https://explorer.zcha.in')" class="img"></a>
          <p>{{$t('ZEC浏览器')}}</p>
        </div>
        <div class="huoBi">
          <a @click="doCopy('https://m.huobi.me/zh-cn/')" class="img"></a>
          <p>{{$t('火币')}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { ImagePreview } from "vant";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      nick_name: "",
      Avatar: require("#/img/morentouxiang@2x.png")
    };
  },
  created() {
    if (localStorage.getItem("nick_name")) {
      this.Avatar = localStorage.getItem("Avatar");
      this.nick_name = localStorage.getItem("nick_name");
    } else {
      this.init();
    }
  },
  computed: {
    ...mapState(["LOADING"]),
    ...mapGetters(["get_chickens"])
  },
  mounted() {
    if (window.history && window.history.pushState) {
      // 向历史记录中插入了当前页
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
  },
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
  },
  methods: {
    goBack() {
      // console.log("点击了浏览器的返回按钮");
      history.pushState(null, null, document.URL);
    },
    init() {
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "USER_INFO_VIEW"
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            localStorage.setItem("nick_name", data.Data.nick_name);
            this.nick_name = data.Data.nick_name;
            // 再次判断当前接口中的头像是不是为‘’，如果为空，用默认头像保存下来
            if (data.Data.avatar === "") {
              // 将默认头像保存到localStorage中
              localStorage.setItem("Avatar", this.Avatar);
            } else {
              localStorage.setItem("Avatar", data.Data.avatar);
              this.Avatar = data.Data.avatar;
            }
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    doCopy(val) {
      if (window.plus) {
        plus.runtime.openURL(val);
      } else {
        document.addEventListener(
          "plusready",
          plus.runtime.openURL(val),
          false
        );
      }

      // this.$copyText(val).then(
      //   e => {
      //     // success
      //     this.$toast({
      //       /*这是使用了element-UI的信息弹框*/
      //       message: this.$t("下载链接复制成功，请在浏览器中打开下载！")
      //     });
      //   },
      //   e => {
      //     // fail
      //     this.$toast({
      //       message: this.$t("复制失败，请手动选择复制！")
      //     });
      //   }
      // );
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin.less";
.mine-index {
  color: #fff;
  height: 100%;
  position: relative;
  background: #eee;
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .mine-top {
    width: 100%;
    height: 4.44rem;
    background: #000;
    .title {
      text-align: left;
      font-size: 0.36rem;
      color: #000;
      padding: 1rem 0 0 0.3rem;
      font-weight: 500;
    }
    .image {
      margin: 0.18rem;
      .image-yellow {
        width: 1.72rem;
        height: 1.72rem;
        background: rgba(38, 89, 255, 0.42);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        .image-linear {
          width: 1.48rem;
          height: 1.48rem;
          background: #2659ff;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        /deep/.van-image {
          background: #000;
          border: 1px solid #fff;
          margin: 0.11rem;
          img {
            width: 0.8rem !important;
            height: 0.98rem !important;
            margin: 0.2rem auto;
          }
        }
      }
    }
    .user_name {
      height: 0.4rem;
      color: #fff;
      font-size: 0.32rem;
    }
  }
  .mine-content {
    width: 100%;
    margin: 0 auto 0.2rem;
    background: #f8f8f8;
    padding: 0.3rem 0.6rem 0.2rem 1.2rem;
    box-sizing: border-box;
    .bg {
      position: absolute;
      left: -0.7rem;
      top: 0.34rem;
      width: 0.4rem;
      height: 0.4rem;
      background-repeat: no-repeat;
      background-size: contain;
    }
    .bg1 {
      .bg-image("../../../../static/img/tuandui");
    }
    .bg3 {
      .bg-image("../../../../static/img/yaoqinghaoyou");
    }
    .bg4 {
      .bg-image("../../../../static/img/gerenxinxi");
    }
    .bg5 {
      .bg-image("../../../../static/img/zhanghaoanquan");
    }
    .bg7 {
      .bg-image("../../../../static/img/zhangdanmingxi");
    }
    .bg8 {
      .bg-image("../../../../static/img/lianxikefu");
    }
    .bg9 {
      .bg-image("../../../../static/img/beifen");
    }
  }
  .share_link {
    flex: 1;
    background: #f8f8f8;
    height: 2.8rem;
    margin-bottom: 1rem;
    p {
      margin: 0;
      font-size: 0.3rem;
      color: #101010;
    }
    .link {
      text-align: left;
      line-height: 0.8rem;
      padding-left: 1.2rem;
      .bg-image("../../../../static/img/youqinglianjie");
      background-repeat: no-repeat;
      background-size: 0.36rem;
      background-position: 0.5rem center;
    }
    .between {
      display: flex;
      // justify-content: space-between;
      justify-content: space-around;
      .img {
        display: inline-block;
        width: 1.04rem;
        height: 1.04rem;
        background: #fff;
        border-radius: 0.1rem;
        box-shadow: 0px 0px 9px 0px rgba(0, 111, 223, 0.22);
      }
      .mango .img {
        .bg-image("../../../../static/img/Mango");
        background-repeat: no-repeat;
        background-size: 1rem;
        background-position: center;
      }
      .mtoken .img {
        .bg-image("../../../../static/img/MToken");
        background-repeat: no-repeat;
        background-size: 0.96rem;
        background-position: center;
      }
      .huoBi .img {
        .bg-image("../../../../static/img/huoBi");
        background-repeat: no-repeat;
        background-size: 0.96rem;
        background-position: center;
      }
      p {
        line-height: 0.8rem;
      }
    }
  }
}
</style>