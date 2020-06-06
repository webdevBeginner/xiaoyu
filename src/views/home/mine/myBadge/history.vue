<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t(title)" left-arrow @click-left="onClickLeft" />
    <div class="mine-content">
      <div v-if="Data.record.length" class="list">
        <div class="li" v-for="(item,index) in Data.record" :key="index">
          <div class="left">
            <p>[{{$t(item.comments)}}]</p>
            <p>
              <span>{{item.direction ? `+${item.amount_double}` : `-${item.amount_double}`}} ZEC</span>
            </p>
          </div>
          <div class="right">{{new Date(item.create_date) | formate}}</div>
        </div>
      </div>
      <div class="noData" v-if="!Data.record.length && !LOADING">
        <div class="img"></div>
        <p>{{$t('暂无记录')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { formateDate } from "@/utils/date";
import { mapGetters, mapState } from "vuex";
export default {
  // USER_INVITE_VIEW
  data() {
    return {
      title: "",
      Data: {
        record: []
      }
    };
  },
  filters: {
    formate(time) {
      let date = new Date(time);
      return formateDate(date, "YYYY-MM-dd hh:mm");
    }
  },
  computed: {
    ...mapState(["LOADING"]),
    ...mapGetters(["get_chickens"])
  },
  created() {
    switch (this.$route.params.method) {
      case "QUERY_BUY_PRODUCT_LIST":
        this.title = "购买记录";
        break;
      case "USER_VAULT_VIEW":
        this.title = "玩家金库";
        break;
      case "USER_CASH_VIEW":
        this.title = "现金钱包";
        break;
      case "USER_GAME_VIEW":
        this.title = "游戏钱包";
        break;
      case "USER_MALL_VIEW":
        this.title = "商城钱包";
        break;
    }
    this.init();
  },
  methods: {
    init() {
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: this.$route.params.method
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.Data.record = data.Data.list;
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
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
  .mine-content {
    flex: 1;
    overflow: auto;
    width: 100%;
    .list {
      flex: 1;
      overflow: auto;
      color: #101010;
      padding: 0 0.4rem;
      margin-bottom: 0.2rem;
      .li {
        display: flex;
        justify-content: space-between;
        padding: 0.3rem 0;
        border-bottom: 1px solid #ececec;
        .left {
          text-align: left;
          p {
            margin: 0;
            line-height: 0.5rem;
            font-size: 0.3rem;
            &:first-of-type {
              font-size: 0.28rem;
            }
            span {
              color: #2659ff;
            }
          }
        }
        .right {
          display: flex;
          align-items: flex-end;
          color: #999;
          font-size: 0.24rem;
        }
      }
    }
    .noData {
      margin: auto;
      .img {
        width: 4.5rem;
        height: 4.38rem;
        margin: 0.88rem auto 0.3rem;
        .bg-image("../../../../../static/img/no-history");
        background-repeat: no-repeat;
        background-size: contain;
      }
      p {
        color: #4f5260;
        font-size: 0.4rem;
        margin: 0;
      }
    }
  }
}
</style>