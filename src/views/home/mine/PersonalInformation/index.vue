<template>
  <div class="register">
    <loading v-show="LOADING"></loading>
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('个人信息')" @click-left="onClickLeft" left-arrow />
    <div class="mine-content" v-show="!LOADING">
      <div class="image-yellow">
        <img :src="userInfo.avatar ? userInfo.avatar : base64" id="previewImg" />
        <input @change="uploadImg($event)" accept="image/*" name="file" type="file" />
      </div>
      <p>{{$t('点击上传头像')}}</p>

      <!-- 个人信息表单 -->
      <div class="userInfo">
        <van-field
          :label="$t('昵称')"
          :placeholder="$t('请输入昵称')"
          input-align="right"
          v-model="userInfo.nick_name"
        />
        <van-field
          :label="$t('邀请码')"
          :placeholder="$t('请输入邀请码')"
          input-align="right"
          readonly
          v-model="userInfo.invitedCode"
        />
        <van-button
          @click="submit"
          color="#EF314B"
          id="sureBtn"
          size="large"
          type="info"
        >{{$t('确定')}}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Clipic from "clipic";
const clipic = new Clipic();
export default {
  // SMS_EVERY_SEND
  data () {
    return {
      base64: require("#/img/morentouxiang@2x.png"),
      activeIcon: require("#/img/xuanze-dx@2x.png"),
      inactiveIcon: require("#/img/weixuanz-dx@2x.png"),
      showCalendar: false,
      userInfo: {
        nick_name: "",
        invitedCode: "",
        avatar: ''
      }
    };
  },
  computed: {
    ...mapState(["LOADING"]),
    ...mapGetters(["get_chickens"])
  },
  created () {
    this.init();
  },
  methods: {
    init () {
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "USER_INFO_VIEW"
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.userInfo = data.Data;
            localStorage.setItem("Avatar", this.userInfo.avatar);
            localStorage.setItem("nick_name", this.userInfo.nick_name);
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    onConfirm (date) {
      let MM =
        date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      this.userInfo.born_date = `${date.getFullYear()}-${MM}-${dd}`;
      this.showCalendar = false;
    },
    // 头像上传
    uploadImg (event) {
      const files = event.files || event.target.files;
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = img => {
        clipic.getImage({
          width: 500,
          height: 500,
          src: img.target.result,
          onDone: base64 => {
            this.userInfo.avatar = base64;
          }
        });
      };
      event.value = "";
    },
    // 提交表单
    submit () {
      let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (this.userInfo.email && !reg.test(this.userInfo.email)) {
        this.$toast(this.$t("请输入正确的邮箱格式"));
        return;
      }
      this.mview.socket.send({
        data: {
          method: "USER_INFO_EDIT",
          nick_name: this.userInfo.nick_name,
          avatar: this.userInfo.avatar
        },
        success: data => {
          if (data.Code == 0) {
            // 免登录
            this.init();
            this.$toast.success("更改成功！");
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    onClickLeft () {
      // this.$router.push({ name: "login" });
      window.history.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../../../style/mixin.less';
.register {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .mine-content {
    flex: 1;
    width: 100%;
    background-position: 0 100%;
    .image-yellow {
      position: relative;
      margin: 1rem auto 0;
      width: 1.16rem;
      height: 1.16rem;
      background: linear-gradient(
        0deg,
        rgba(249, 104, 107, 0.66) 0%,
        rgba(241, 65, 86, 0.66) 100%
      );
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      #previewImg {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        border-radius: 50% !important;
      }
      input {
        width: 100%;
        height: 1.24rem;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
      }
    }
    p {
      font-size: 0.24rem;
      color: #999;
    }
    .userInfo {
      width: 85%;
      margin: 0 auto;
      /deep/.van-cell__title {
        color: #101010;
        width: 1.8rem;
      }
      /deep/.van-field__body {
        height: 100%;
        font-size: 0.3rem;
        img {
          width: 0.3rem;
        }
      }
      #sureBtn {
        width: 5.08rem;
        line-height: 0.88rem;
        height: 0.88rem;
        margin-top: 1rem;
      }
    }
  }
}
</style>