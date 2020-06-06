<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('资讯详情')" left-arrow @click-left="onClickLeft" />
    <div v-show="!LOADING" class="mine-content">
      <div class="title">{{news.title}}</div>
      <div class="from">
        <span>来自{{news.author}}</span>
        <span>{{new Date(news.date) | formate}}</span>
      </div>
      <div class="artcal" v-html="news.details"></div>
    </div>
  </div>
</template>

<script>
import { formateDate } from "@/utils/date";
import { mapState } from "vuex";
export default {
  // SMS_EVERY_SEND
  data() {
    return {
      news: {}
    };
  },
  filters: {
    formate(time) {
      let date = new Date(time);
      return formateDate(date, "YYYY-MM-dd hh:mm");
    }
  },
  computed: {
    ...mapState(["LOADING"])
  },
  created() {
    this.$store.commit("showLoading");
    this.mview.socket.send({
      data: {
        method: "NEW_DETAIL_VIEW",
        type: this.$route.params.item.type,
        id: this.$route.params.item.id
      },
      success: data => {
        this.$store.commit("hideLoading");
        if (data.Code == 0) {
          this.news = data.Data.news;
        } else {
          this.$notify(data.Message);
        }
      }
    });
  },
  methods: {
    onClickLeft() {
      // this.$router.push({ name: "login" });
      window.history.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin.less";
.register {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .mine-content {
    padding: 0.36rem 0.66rem;
    text-align: left;
    overflow: auto;
    background: #f8f8f8;
    flex: 1;
    .title {
      font-size: 0.32rem;
    }
    .from {
      color: #999;
      font-size: 0.22rem;
      margin-top: 0.5rem;
      margin-bottom: 0.3rem;
      display: flex;
      justify-content: space-between;
    }
    .artcal {
      color: #999;
      font-size: 0.3rem;
    }
  }
}
</style>