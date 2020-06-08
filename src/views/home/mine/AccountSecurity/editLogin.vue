<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('修改密码')" @click-left="onClickLeft" left-arrow />
    <div class="mine-content">
      <div class="usernameWrap">
        <van-field
          :placeholder="$t('请输入旧的密码')"
          class="pd"
          type="password"
          v-model="registerInfo.old_password"
        />
        <van-field
          :placeholder="$t('请输入6-16位的新密码')"
          class="pd"
          type="password"
          v-model="registerInfo.new_password"
        />
        <van-field
          :placeholder="$t('请再次输入新密码')"
          class="pd"
          type="password"
          v-model="registerInfo.re_password"
        />
      </div>
      <van-button
        @click="sureAndLogin"
        class="loginBtn"
        color="#EF314B"
        size="large"
        type="info"
      >{{$t('确定')}}</van-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  // SMS_EVERY_SEND
  data () {
    return {
      registerInfo: {
        old_password: "",
        new_password: "",
        re_password: ""
      }
    };
  },
  computed: {
    ...mapState(["LOADING"])
  },
  methods: {
    onClickLeft () {
      // this.$router.push({ name: "login" });
      window.history.go(-1);
    },
    // 确定并登录
    sureAndLogin () {
      let reg_pwd = /[A-Za-z0-9]$/;
      if (this.registerInfo.old_password === "") {
        this.$toast(this.$t("旧密码不得为空"));
        return;
      }
      if (this.registerInfo.new_password === "") {
        this.$toast(this.$t("密码不得为空"));
        return;
      } else if (
        6 > this.registerInfo.new_password.length ||
        16 < this.registerInfo.new_password.length
      ) {
        this.$toast(this.$t("密码长度为6~16位"));
        return;
      } else if (!reg_pwd.test(this.registerInfo.new_password)) {
        this.$toast(this.$t("密码只能输入数字和字母"));
        return;
      }
      if (this.registerInfo.re_password === "") {
        this.$toast(this.$t("请再次输入新登录密码"));
        return;
      }
      if (this.registerInfo.new_password !== this.registerInfo.re_password) {
        this.$toast(this.$t("两次密码输入不一致"));
        return;
      }
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "USER_PASSWORD_EDIT",
          old_password: this.registerInfo.old_password,
          new_password: this.registerInfo.new_password,
          re_password: this.registerInfo.re_password
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.mview.socket.listen.onclose();
            localStorage.removeItem("isRember");
            localStorage.removeItem("Avatar");
            this.$router.push("/login");
          } else {
            this.$toast(this.$t(data.Message));
            this.registerInfo.old_password = "";
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../../../style/mixin.less';
.register {
  height: 100%;
  overflow: hidden;
  .mine-content {
    width: 80%;
    margin: 0.8rem auto;
    // padding-left: 5%;
    // box-sizing: border-box;
    .usernameWrap {
      margin: auto;
      width: 5.7rem;
      .yanzhengma {
        color: #fff;
      }
      /deep/.pd {
        input {
          padding-left: 0.6rem;
        }
      }
      /deep/.van-cell {
        margin-bottom: 0.2rem;
        background-repeat: no-repeat;
        background-size: 0.4rem;
        background-position: left;
        &:nth-of-type(1) {
          background-size: 0.35rem;
          .bg-image('../../../../../static/img/jiumima');
        }
        &:nth-of-type(2) {
          background-size: 0.44rem;
          .bg-image('../../../../../static/img/mima');
        }
        &:nth-of-type(3) {
          .bg-image('../../../../../static/img/mima-sure');
        }
      }
    }
    .loginBtn {
      width: 5.7rem;
      margin-top: 0.2rem;
    }
  }
}
</style>