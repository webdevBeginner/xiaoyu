<template>
  <div class="Revenue">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('可用收益')" left-arrow @click-left="onClickLeft"></van-nav-bar>
    <!-- 记录部分 -->
    <div v-show="!LOADING" class="history">
      <!-- 总收益 -->
      <div class="DetailTotal">
        <p>{{Data.total}}</p>
        <p>{{$t('总收益')}} (ZEC)</p>
      </div>
      <!-- 细则 -->
      <div v-if="Data.records.length" class="list">
        <div class="li" v-for="(item,index) in Data.records" :key="index">
          <div class="left">
            <p>[{{new Date(item.date) | formate}}]</p>
            <p>
              {{$t('收益：')}}
              <span>{{item.amount_double}} ZEC</span>
            </p>
          </div>
          <div class="right" @click="goRoute('detailRevenue','date', item.date)">{{$t('查看')}}</div>
        </div>
      </div>
      <div class="noData" v-if="!Data.records.length && !LOADING">
        <div class="img"></div>
        <p>{{$t('暂无数据')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { formateDate } from "@/utils/date";
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      Data: {
        total: 0,
        records: []
      }
    };
  },
  created() {
    this.init();
  },
  filters: {
    formate(time) {
      let date = new Date(time);
      return formateDate(date, "YYYY-MM-dd");
    }
  },
  computed: {
    ...mapState(["LOADING"]),
    ...mapGetters(["get_chickens"])
  },
  methods: {
    init() {
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "USER_INCOME_VIEW"
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.Data = data.Data;
            this.Data.records.length &&
              this.Data.records.map(_ => {
                _.date = formateDate(new Date(_.date), "YYYY-MM-dd");
              });
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    onClickLeft() {
      // this.$router.push({ name: "login" });
      window.history.go(-1);
    },
    // 路由链接
    goRoute(name, paramsName, params) {
      this.$router.push({
        name: name,
        params: { [paramsName]: params }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin.less";
.Revenue {
  height: 100%;
  display: flex;
  flex-direction: column;
  .van-icon {
    font-size: 0.45rem;
  }
  .history {
    padding: 0.24rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .DetailTotal {
      width: 6.86rem !important;
      height: 2.46rem !important;
      .bg-image("../../../../static/img/shouyi-bg");
      background-repeat: no-repeat;
      background-size: contain;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      p {
        line-height: 0.6rem;
        margin: 0;
        &:first-of-type {
          font-size: 0.48rem;
          color: #fff;
        }
        &:last-of-type {
          font-size: 0.3rem;
          color: #fff;
        }
        span {
          color: #999;
          font-size: 0.28rem;
        }
      }
    }
    .list {
      flex: 1;
      overflow: auto;
      padding: 0 0.4rem;
      margin-bottom: 0.2rem;
      .li {
        display: flex;
        justify-content: space-between;
        padding: 0.3rem 0;
        border-bottom: 1px solid #eee;
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
          width: 1.26rem;
          height: 0.56rem;
          line-height: 0.56rem;
          font-size: 0.3rem;
          color: #fff;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background: #2659ff;
          margin: auto 0;
          border-radius: 0.1rem;
        }
      }
    }
    .noData {
      margin: auto;
      .img {
        width: 2.3rem;
        height: 1.9rem;
        margin: 0.88rem auto 0.3rem;
        .bg-image("../../../../static/img/zanwushuju");
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