<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-icon name="arrow-left" color="#fff" @click="onClickLeft" />
    <p>{{$t('助记词备份')}}</p>
    <div class="mine-content">
      <Words
        v-if="!add_show && word_list.length"
        :password="password"
        :word="word"
        :word_list="word_list"
      ></Words>
    </div>
    <Charge v-if="add_show" @cash-pwd="sure_btn" btn_mes="确定" @close-pay="closePay()"></Charge>
  </div>
</template>

<script>
import { formateDate } from "@/utils/date";
import { mapGetters, mapState } from "vuex";
export default {
  // USER_INVITE_VIEW
  data() {
    return {
      add_show: true,
      password: "",
      word: "",
      word_list: []
    };
  },
  computed: {
    ...mapState(["LOADING"]),
    ...mapGetters(["get_chickens"])
  },
  created() {},
  methods: {
    // 获取助记词
    sure_btn(val) {
      this.password = val;
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "QUERY_USER_WORD",
          password: val
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.word = data.Data.words.trim();
            this.word_list = this.word.split(" ");
            this.add_show = false;
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    closePay() {
      window.history.go(-1);
      this.password = "";
    },
    onClickLeft() {
      window.history.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../style/mixin.less";
.register {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #000;
  p {
    margin: 0;
    font-size: 0.48rem;
    color: #2659ff;
    font-weight: 900;
  }
  .van-icon {
    display: inline-block;
    text-align: left;
    font-size: 0.4rem;
    height: 1.2rem;
    line-height: 1.5rem;
    padding-left: 0.3rem;
  }
  .mine-content {
    flex: 1;
    overflow: hidden;
    padding: 0 0.3rem 0.3rem;
  }
}
</style>