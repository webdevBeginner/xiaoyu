<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('账号安全')" left-arrow @click-left="onClickLeft" />
    <div class="mine-content">
      <van-cell-group>
        <van-cell :title="$t('修改密码')" is-link to="/editLogin" />
        <van-cell :title="$t('清除缓存')" is-link @click="clearStorage" />
        <van-cell
          :title="$t('检测更新')"
          :value="$t('当前版本 v') +version"
          is-link
          @click="showToast('当前已是最近版本！')"
        />
        <!-- <van-switch-cell v-model="isLock" :title="$t('手势密码')" @change="setLockPwd" /> -->
      </van-cell-group>
    </div>
    <div class="bottom" @click="LogOut">{{$t('退出账号')}}</div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      version: "",
      isLock: false
    };
  },
  created() {
    this.version = process.env.VUE_APP_VERSION;
    console.log(localStorage.getItem("lock"));
    this.isLock = Boolean(localStorage.getItem("lock"));
  },
  computed: {
    ...mapState(["UPDATE"])
  },
  watch: {
    isLock(val) {
      if (val) {
        localStorage.setItem("lock", val);
      } else {
        localStorage.removeItem("lock");
      }
    }
  },
  methods: {
    onClickLeft() {
      window.history.go(-1);
    },
    // 退出登录
    LogOut() {
      this.mview.socket.listen.onclose();
      localStorage.removeItem("isRember");
      localStorage.removeItem("Avatar");
      localStorage.removeItem("Team");
      localStorage.removeItem("nick_name");
      this.$store.commit("get_now_id", 0);
      // this.$router.push({
      //   name: this.isLock ? "LockLogin" : "login"
      // });
      this.$router.push({ name: "login" });
    },
    // 清除缓存
    clearStorage() {
      this.mview.socket.listen.onclose();
      this.$store.commit("get_news_list", []);
      localStorage.removeItem("Avatar");
      localStorage.removeItem("Team");
      localStorage.removeItem("nick_name");
      this.$store.commit("get_now_id", 0);
      this.$toast(this.$t("缓存清除成功！"));
    },
    setLockPwd(val) {
      console.log(val);
      if (val) {
        this.$router.push({
          name: "LockLogin",
          params: {
            type: 1
          }
        });
      }
    },
    showToast(text) {
      if (
        localStorage.getItem("version") &&
        process.env.VUE_APP_VERSION != localStorage.getItem("version")
      ) {
        this.$store.commit("showUpdate", true);
      } else {
        this.$toast(this.$t(text));
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../style/mixin.less";
.register {
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
  .mine-content {
    width: 90%;
    padding-left: 5%;
  }
  .bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 0.98rem;
    line-height: 0.98rem;
    background: #fff;
    color: #101010;
    font-size: 0.3rem;
  }
  .van-hairline--top-bottom::after {
    border-color: transparent;
  }
}
</style>