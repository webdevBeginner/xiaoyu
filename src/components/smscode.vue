<template>
  <div class="smscode">
    <van-field
      :label="label"
      :placeholder="$t('请输入验证码')"
      @blur="changeCodeNum"
      @focus="get_moblie"
      center
      clearable
      v-model="userInfo.smscode"
    >
      <van-button :disabled="!isCode" @click="showCode" size="small" slot="button">
        <span v-if="isCode">{{$t('获取验证码')}}</span>
        <div v-else>
          <van-count-down :time="120*1000" format="ss" />
          <span>S</span>
        </div>
      </van-button>
    </van-field>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    userList: {
      required: true
    },
    label: {
      default: ""
    }
  },
  data () {
    return {
      isCode: true,
      show: false,
      userInfo: {
        moblie: "",
        smscode: ""
      }
    };
  },
  computed: {
    ...mapState(["lockPhone"])
  },
  methods: {
    changeCodeNum () {
      this.$emit("change-code", this.userInfo);
      console.log(this.userInfo);
    },
    get_moblie () {
      this.userInfo = JSON.parse(JSON.stringify(this.userList));
    },
    // 获取验证码
    showCode () {
      console.log(this.userList);
      this.userInfo = JSON.parse(JSON.stringify(this.userList));
      let reg = /^[1]([3-9])[0-9]{9}$/;
      if (this.userInfo.moblie === "") {
        this.$toast(this.$t("手机号不得为空"));
        return;
      }
      console.log(this.userInfo.moblie);
      if (this.userInfo.country === "+86") {
        if (!reg.test(this.userInfo.moblie)) {
          this.$toast(this.$t("请输入正确的手机号"));
          return;
        }
      }
      this.isCode = false;
      this.mview.socket.send({
        data: {
          method: "SMS_EVERY_SEND",
          username: this.userInfo.moblie,
          region: this.userInfo.country
        },
        success: data => {
          if (data.Code == 0) {
            this.$store.commit("showPhone", true);
            setTimeout(() => {
              this.isCode = true;
            }, 120 * 1000);
          } else {
            setTimeout(() => {
              this.isCode = true;
            }, 120 * 1000);
            this.$toast(this.$t(data.Message));
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import '../style/mixin.less';
.smscode {
  /deep/.van-cell {
    .van-field__button {
      height: 0.56rem;
      .van-button {
        font-size: 0.24rem;
        .van-count-down,
        span {
          color: #ef314b;
          line-height: 0.56rem;
          float: left;
          margin-right: 5px;
        }
      }
      .van-button--disabled {
        background: transparent !important;
      }
    }
  }
}
</style>