<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <div class="team_top_bg">
      <div class="team_top">
        <div class="team_top_title">
          <div @click="onClickLeft" class="left"></div>
          <p class="title">我的团队</p>
          <div @click="jump" class="share"></div>
        </div>
        <div @click="Financial" class="image">
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
            <a v-if="userInfo.level > 0">
              Lv
              <span>{{userInfo.level}}</span>
            </a>
          </div>
        </div>
        <div class="user_name">
          <span>{{userInfo.nickname}}</span>
          <p @click="getTeam(1)">{{$t('验证')}}</p>
        </div>
        <!-- message -->
        <div class="message">
          <div class="total left">
            <p>{{userInfo.pushNum}}</p>
            <p>{{$t('直推人数')}}</p>
          </div>
          <div class="total">
            <p>{{userInfo.team_number}}</p>
            <p>{{$t('团队人数')}}</p>
          </div>
        </div>
      </div>
      <div class="message message_black">
        <div class="total">
          <p>{{userInfo.team_activity}}</p>
          <p>{{$t('团队活跃度')}}</p>
        </div>
        <div class="total">
          <p>{{userInfo.max_activity}}</p>
          <p>{{$t('大区活跃度')}}</p>
        </div>
        <div class="total">
          <p>{{userInfo.min_activity}}</p>
          <p>{{$t('小区活跃度')}}</p>
        </div>
      </div>
      <div style="flex:1; overflow: auto">
        <!-- 伞下团队 -->
        <loading v-show="LOADING"></loading>
        <div class="Teams" v-if="userInfo.lists.length">
          <div
            :class="item.team_asset > 0 ? 'has-cell' : ''"
            :key="index"
            class="cell"
            v-for="(item,index) in userInfo.lists"
          >
            <!-- 使用 title 插槽来自定义标题 -->
            <div class="image-linear">
              <van-image
                :src="item.avatar ? item.avatar : require('#/img/morentouxiang@2x.png')"
                fit="contain"
                height=".98rem"
                round
                width=".98rem"
              />
              <a v-if="item.level > 0">
                Lv
                <span>{{item.level}}</span>
              </a>
            </div>
            <div class="content">
              <p class="nickname">
                {{(/^[1]([3-9])[0-9]{9}$/.test(item.nickname)) ? item.nickname.substr(0, 3) +
                "****" +
                item.nickname.substr(7) : item.nickname}}
              </p>
              <p class="number">{{item.activity}}</p>
              <p class="number">{{$t('团队活跃度')}}</p>
              <p class="number">{{$t('社区人数：')}}{{item.team_number}}</p>
              <p
                :class="item.team_asset > 0 ? 'isUser' : ''"
                class="noUser"
              >{{item.team_asset > 0 ? $t('有效用户') : $t('无效用户')}}</p>
            </div>
          </div>
        </div>
        <div class="noData" v-else>
          <img :src="require('#/img/yaoqingxiaohuoban@2x.png')" alt />
          <p>{{$t('快去邀请你的小伙伴吧！')}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  // SMS_EVERY_SEND
  data () {
    return {
      Avatar: require("#/img/morentouxiang@2x.png"),
      userInfo: {
        nickname: "",
        lists: []
      }
    };
  },
  computed: {
    ...mapState(["LOADING"]),
    ...mapGetters(["get_chickens"])
  },
  created () {
    localStorage.getItem("Avatar")
      ? (this.Avatar = localStorage.getItem("Avatar"))
      : this.init();
    localStorage.getItem("Team")
      ? (this.userInfo = JSON.parse(localStorage.getItem("Team")))
      :
      this.getTeam();
  },
  methods: {
    onClickLeft () {
      // this.$router.push({ name: "login" });
      window.history.go(-1);
    },
    init () {
      this.mview.socket.send({
        data: {
          method: "USER_INFO_VIEW"
        },
        success: data => {
          if (data.Code == 0) {
            // 判断当前存储中有没有头像   如果有头像并且存储的头像和service端的头像一样，将头像直接用cash中的替换
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
    // 获取伞下团队
    getTeam (val) {
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "USER_TEAM_VIEW",
          username: localStorage.getItem("username")
        },
        success: data => {
          if (data.Code == 0) {
            this.$store.commit("hideLoading");
            if (val) {
              this.$toast(this.$t("验证成功！"));
            }
            this.userInfo = data.Data;
            localStorage.setItem("Team", JSON.stringify(this.userInfo));
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },

    Financial () {
      this.$router.push({ name: "Financial" });
    },
    // 跳转到邀请码页面
    jump () {
      this.$router.push({ path: "/InvitationLink" });
    },
    // 查看详情页
    watchDownTeamDetails (user_name) {
      this.$router.push({
        path: `/home/team/${user_name}`,
        params: { user_name }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../../../style/mixin.less';
.register {
  height: 100%;
  // .bg-image("../../../../static/img/beijing-register");
  overflow: hidden;
  .team_top_bg {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-size: 100%;
    .team_top {
      width: 100%;
      height: 5rem;
      background: #ef314b;
    }
    .team_top_title {
      width: 100%;
      height: 0.86rem;
      line-height: 0.86rem;
      font-size: 0.34rem;
      display: flex;
      justify-content: space-between;
      color: #fff;
      padding: 0.8rem 0.3rem;
      box-sizing: border-box;
      align-items: baseline;
      .title {
        margin: 0;
        line-height: 0.36rem;
      }
      .left {
        width: 0.18rem;
        height: 0.32rem;
        margin: auto 0;
        .bg-image('../../../../../static/img/back');
        background-repeat: no-repeat;
        background-size: contain;
      }
      .share {
        width: 0.27rem;
        height: 0.32rem;
        margin: auto 0;
        .bg-image('../../../../../static/img/fenxian');
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
    .image {
      margin: 0 0.18rem;
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
      height: 0.6rem;
      color: #fff;
      line-height: 0.6rem;
      font-size: 0.32rem;
      position: relative;
      p {
        position: absolute;
        margin: 0;
        font-size: 0.22rem;
        line-height: 0.3rem;
        padding: 0 0.14rem;
        right: 0.8rem;
        top: 0.1rem;
        border: 1px solid #fff;
        border-radius: 5px;
      }
    }
    .message {
      width: 6.86rem;
      margin: 0.1rem auto 0;
      color: #fff;
      opacity: 0.91;
      border-radius: 0.2rem;
      display: flex;
      justify-content: space-between;
      .total {
        width: 50%;
        font-size: 0.28rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        p {
          margin: 0;
          line-height: 0.5rem;
          color: #fff;
          &:first-of-type {
            font-size: 0.34rem;
          }
          span {
            color: #999;
            font-size: 0.24rem;
          }
        }
      }
      .left {
        position: relative;
      }
      .left::after {
        position: absolute;
        right: 0;
        top: 25%;
        height: 0.6rem;
        width: 2px;
        border-radius: 50%;
        background: #fff;
        display: block;
        content: ' ';
      }
    }
    .message_black {
      width: 100%;
      border-bottom: 1px solid #ececec;
      margin: 0.1rem 0;
      .total {
        padding: 0.1rem 0;
        position: relative;
        p {
          color: #101010;
          font-size: 0.22rem !important;
          line-height: 0.3rem;
        }
        &:not(:last-child)::after {
          position: absolute;
          right: 0;
          top: 25%;
          height: 0.4rem;
          width: 2px;
          border-radius: 40%;
          background: #ececec;
          display: block;
          content: ' ';
        }
      }
    }
    .Teams {
      width: 100%;
      flex: 1;
      padding: 0.32rem 0.32rem 1.2rem;
      box-sizing: border-box;
      overflow: hidden;
      .cell {
        padding: 0 0.4rem 0.4rem;
        color: #101010;
        border: 1px solid #888;
        border-radius: 0.2rem;
        margin-bottom: 0.3rem;
        width: 48%;
        float: left;
        box-sizing: border-box;

        &:nth-of-type(odd) {
          margin-right: 4%;
        }
      }
      .has-cell {
        border-color: #2659ff;
      }
      .image-linear {
        width: 1.48rem;
        height: 1.48rem;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        position: relative;
        a {
          position: absolute;
          display: inline-block;
          color: #000;
          background: #ffe400;
          width: 0.28rem;
          height: 0.28rem;
          line-height: 0.28rem;
          font-weight: 900;
          border: 1px solid #1e46c8;
          border-radius: 50%;
          right: 0.3rem;
          bottom: 0.2rem;
          font-size: 0.2rem;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            font-size: 0.14rem;
          }
        }
      }

      .content {
        font-size: 0.3rem;
        margin: 0;
        text-align: center;
        p {
          margin: 0;
        }
        .nickname {
          width: 80%;
          margin: 0 auto;
          line-height: 0.5rem;
          height: 0.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .number {
          font-size: 0.24rem;
          color: #999;
        }
        .noUser {
          width: 1.74rem;
          height: 0.5rem;
          line-height: 0.5rem;
          font-size: 0.24rem;
          color: #999;
          background: #eaeaea;
          margin: 0.1rem auto 0;
          border-radius: 0.1rem;
          padding: 2px 0.16rem;
        }
        .isUser {
          background: #c2e0ff;
          color: #2659ff;
        }
      }
    }
    .noData {
      padding-top: 1.4rem;
      img {
        height: 2.7rem;
      }
      p {
        font-size: 0.28rem;
        color: #b2b2b2;
      }
    }
  }
}
</style>