<template>
  <div class="detailRevenue">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t(title)" left-arrow @click-left="onClickLeft"></van-nav-bar>
    <!-- 记录部分 -->
    <div v-show="!LOADING && Data" class="history">
      <!-- 总收益 -->
      <div class="DetailTotal">
        <p>{{Data.total}}</p>
        <p v-if="Data.date">
          {{Data.date}} {{$t('总收益')}}
          <span>(ZEC)</span>
        </p>
        <p v-else-if="$route.params.methods">
          {{$t('赠送')}}
          <span>(ZEC)</span>
        </p>
        <p v-else>
          {{$t('余额')}}
          <span>(ZEC)</span>
        </p>
      </div>
      <!-- 细则 -->
      <van-tabs v-if="Data.teams" v-model="activeName">
        <van-tab :title="$t('个人收益')" name="a">
          <div v-if="Data.incomes.length" class="list">
            <div class="li" v-for="(item,index) in Data.incomes" :key="index">
              <div class="left">
                <p>[{{$t(item.comments)}}]</p>
                <p>
                  <span>{{item.direction ? `+${item.amount_double}` : `-${item.amount_double}`}} ZEC</span>
                </p>
              </div>
              <div class="right">{{new Date(item.create_date) | formate}}</div>
            </div>
          </div>
          <div class="noData" v-if="!Data.incomes.length && !LOADING">
            <div class="img"></div>
            <p>{{$t('暂无数据')}}</p>
          </div>
        </van-tab>
        <van-tab :title="$t('团队收益')" name="b">
          <div v-if="Data.teams.length" class="list">
            <div class="li" v-for="(item,index) in Data.teams" :key="index">
              <div class="left">
                <p>[{{$t(item.comments)}}]</p>
                <p>
                  <span>{{item.direction ? `+${item.amount_double}` : `-${item.amount_double}`}} ZEC</span>
                </p>
              </div>
              <div class="right">{{new Date(item.create_date) | formate}}</div>
            </div>
          </div>
          <div class="noData" v-if="!Data.teams.length && !LOADING">
            <div class="img"></div>
            <p>{{$t('暂无数据')}}</p>
          </div>
        </van-tab>
        <van-tab :title="$t('直推收益')" name="c">
          <div v-if="Data.pushs.length" class="list">
            <div class="li" v-for="(item,index) in Data.pushs" :key="index">
              <div class="left">
                <p>[{{$t(item.comments)}}]</p>
                <p>
                  <span>{{item.direction ? `+${item.amount_double}` : `-${item.amount_double}`}} ZEC</span>
                </p>
              </div>
              <div class="right">{{new Date(item.create_date) | formate}}</div>
            </div>
          </div>
          <div class="noData" v-if="!Data.pushs.length && !LOADING">
            <div class="img"></div>
            <p>{{$t('暂无数据')}}</p>
          </div>
        </van-tab>
      </van-tabs>
      <div class="auto" v-else>
        <div v-if="Data.incomes.length" class="list">
          <div class="li" v-for="(item,index) in Data.incomes" :key="index">
            <div class="left">
              <p>[{{$t(item.comments)}}]</p>
              <p>
                <span>{{item.direction ? `+${item.amount_double}` : `-${item.amount_double}`}} ZEC</span>
              </p>
            </div>
            <div class="right">{{new Date(item.create_date) | formate}}</div>
          </div>
        </div>
        <div class="noData" v-if="!Data.incomes.length && !LOADING">
          <div class="img"></div>
          <p>{{$t('暂无数据')}}</p>
        </div>
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
      activeName: "a",
      Data: {
        total: 6.370165,
        title: "",
        type: 4,
        incomes: [],
        pushs: [],
        teams: []
      }
    };
  },
  created() {
    if (this.$route.params.date) {
      this.title = "收益详情";
      this.init();
    } else if (this.$route.params.methods) {
      this.title = "赠送记录";
      this.initList(this.$route.params.methods);
    } else {
      this.title = "可用余额";
      this.initList("USER_ACCOUNT_DATEILS");
    }
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
  methods: {
    init() {
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "DAY_INCOME_VIEW",
          date: formateDate(new Date(this.$route.params.date), "YYYY-MM-dd")
        },
        success: data => {
          if (data.Code == 0) {
            this.$store.commit("hideLoading");
            this.Data = data.Data;
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    initList(methods) {
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: methods
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.Data = data.Data;
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    onClickLeft() {
      // this.$router.push({ name: "login" });
      window.history.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin.less";
.detailRevenue {
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
      width: 6.86rem;
      height: 2.46rem;
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
        color: #fff;
        font-size: 0.3rem;
        &:first-of-type {
          font-size: 0.48rem;
        }
      }
    }
    .van-tabs {
      flex: 1;
      overflow: hidden;
      /deep/.van-tab {
        &:nth-of-type(1)::after,
        &:nth-of-type(2)::after {
          position: absolute;
          right: 0;
          top: 10px;
          height: 0.64rem;
          width: 2px;
          border-radius: 50%;
          background: #eee;
          display: block;
          content: " ";
        }
      }
      /deep/.van-tabs__line {
        transform: translateX(74px) translateX(-50%);
      }
      /deep/.van-tabs__content {
        height: 100%;
        overflow: auto;
      }
    }
    .auto {
      flex: 1;
      overflow: auto;
    }
    .list {
      padding: 0 0.4rem 1rem;
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
              color: #000;
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
</style>