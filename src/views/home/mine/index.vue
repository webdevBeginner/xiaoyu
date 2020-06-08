<template>
  <div class="mine-index">
    <!-- 头部 -->
    <div>
      <div class="mine-top">
        <div class="qiu qiu1"></div>
        <div class="qiu qiu2"></div>
        <div class="qiu qiu3"></div>
        <div class="qiu qiu4"></div>
        <div class="title"></div>
        <!-- 头像 -->
        <div class="image">
          <div class="image-yellow">
            <div class="image-linear">
              <van-image
                :src="Avatar ? Avatar : require('#/img/morentouxiang@2x.png')"
                height="1.2rem"
                round
                v-show="!LOADING"
                width="1.2rem"
              />
            </div>
          </div>
        </div>
        <!-- user_name -->
        <div class="user_name">{{nick_name}}</div>
      </div>
      <div class="mine-box">
        <div @click="goRoute('myTeam')" class="box">
          <div class="img img1"></div>
          <p>我的团队</p>
        </div>
        <div @click="goRoute('InvitationLink')" class="box">
          <div class="img img2"></div>
          <p>邀请好友</p>
        </div>
      </div>
      <div class="mine-content">
        <!-- <van-cell-group> -->
        <div style="position:relative">
          <div class="bg bg1" />
          <van-cell :title="$t('个人信息')" is-link to="/Information" />
        </div>
        <div style="position:relative">
          <div class="bg bg2" />
          <van-cell :title="$t('账号安全')" is-link to="/AccountSecurity" />
        </div>
        <div style="position:relative">
          <div class="bg bg3" />
          <van-cell :title="$t('实名认证')" is-link to="/AccountSecurity" />
        </div>
        <div style="position:relative">
          <div class="bg bg4" />
          <van-cell :title="$t('新手指南')" is-link to="/Guide" />
        </div>
        <div style="position:relative">
          <div class="bg bg5" />
          <van-cell :title="$t('账单明细')" is-link to="/BillDetails" />
        </div>
        <div style="position:relative">
          <div class="bg bg6" />
          <van-cell :title="$t('联系客服')" is-link to="/ContactCustomerService" />
        </div>
        <!-- </van-cell-group> -->
      </div>
    </div>
    <div class="share_link">
      <p class="link">{{$t('友情链接')}}</p>
      <div class="between">
        <div class="mango">
          <a @click="doCopy('https://guarda.com/shielded-wallet')" class="img"></a>
          <p>Mango</p>
        </div>
        <div class="mtoken">
          <a @click="doCopy('https://explorer.zcha.in')" class="img"></a>
          <p>{{$t('MToken')}}</p>
        </div>
        <div class="ZEC">
          <a @click="doCopy('https://explorer.zcha.in')" class="img"></a>
          <p>{{$t('ZEC浏览器')}}</p>
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
  data () {
    return {
      nick_name: "",
      Avatar: require("#/img/morentouxiang@2x.png")
    };
  },
  created () {
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
  mounted () {
    if (window.history && window.history.pushState) {
      // 向历史记录中插入了当前页
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
  },
  destroyed () {
    window.removeEventListener("popstate", this.goBack, false);
  },
  methods: {
    goBack () {
      // console.log("点击了浏览器的返回按钮");
      history.pushState(null, null, document.URL);
    },
    init () {
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
    doCopy (val) {
      if (window.plus) {
        plus.runtime.openURL(val);
      } else {
        document.addEventListener(
          "plusready",
          plus.runtime.openURL(val),
          false
        );
      }
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
    background: #ef314b;
    position: relative;
    .qiu {
      position: absolute;
      background-repeat: no-repeat;
      background-size: contain;
    }
    .qiu1 {
      width: 1.12rem;
      height: 1.28rem;
      left: 0;
      bottom: 0;
      .bg-image('../../../../static/img/wode-qiul');
    }
    .qiu2 {
      width: 0.94rem;
      height: 0.34rem;
      right: 0;
      bottom: 0;
      .bg-image('../../../../static/img/wode-qiur');
    }
    .qiu3 {
      width: 0.46rem;
      height: 0.46rem;
      right: 1.8rem;
      bottom: 1.8rem;
      .bg-image('../../../../static/img/qiu1');
    }
    .qiu4 {
      width: 0.46rem;
      height: 0.46rem;
      left: 2rem;
      bottom: 1.5rem;
      .bg-image('../../../../static/img/qiu2');
    }
    .title {
      text-align: left;
      font-size: 0.36rem;
      color: #fff;
      padding: 1rem 0 0 0.3rem;
      font-weight: 500;
    }
    .image {
      margin: 0.18rem;
      .image-yellow {
        width: 1.42rem;
        height: 1.42rem;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        .image-linear {
          background: linear-gradient(
            0deg,
            rgba(249, 104, 107, 1) 0%,
            rgba(241, 65, 86, 1) 100%
          );
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        /deep/.van-image {
          border: 1px solid #fff;
          margin: 0.11rem;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 1rem !important;
            height: 1rem !important;
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
  .mine-box {
    display: flex;
    justify-content: space-between;
    background: #f8f8f8;
    padding: 0.4rem 0.32rem 0;
    .box {
      width: 48%;
      height: 1.22rem;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 7px 0px rgba(126, 126, 126, 0.19);
      border-radius: 0.2rem;
      display: flex;
      justify-content: space-between;
      .img {
        width: 0.72rem;
        height: 0.72rem;
        background-repeat: no-repeat;
        background-size: contain;
        margin: 0.24rem 0.34rem;
      }
      .img1 {
        .bg-image('../../../../static/img/tuandui');
      }
      .img2 {
        .bg-image('../../../../static/img/yaoqing');
      }
      p {
        color: #101010;
        text-align: left;
        font-size: 0.3rem;
        margin: 0;
        flex: 1;
        line-height: 1.22rem;
        align-items: center;
      }
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
      .bg-image('../../../../static/img/gerenxinxi');
    }
    .bg2 {
      .bg-image('../../../../static/img/zhanghaoanquan');
    }
    .bg3 {
      .bg-image('../../../../static/img/shimingrenzheng');
    }
    .bg4 {
      .bg-image('../../../../static/img/xinshouzhinan');
    }
    .bg5 {
      .bg-image('../../../../static/img/zhangdanmingxi');
    }
    .bg6 {
      .bg-image('../../../../static/img/lianxikefu');
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
      .bg-image('../../../../static/img/youqinglianjie');
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
        .bg-image('../../../../static/img/Mango');
        background-repeat: no-repeat;
        background-size: 0.7rem 0.8rem;
        background-position: center;
      }
      .mtoken .img {
        .bg-image('../../../../static/img/MToken');
        background-repeat: no-repeat;
        background-size: 0.96rem;
        background-position: center;
      }
      .ZEC .img {
        .bg-image('../../../../static/img/ZEC');
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