<template>
  <div class="detailRevenue">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t(title)" @click-left="onClickLeft" left-arrow>
      <template #right>
        <van-icon name="question-o" size="18" />
      </template>
    </van-nav-bar>
    <!-- 记录部分 -->
    <div class="history" v-show="!LOADING && Data">
      <!-- 总收益 -->
      <div :class="totalList.length <= 2 ?'lessTotal' :''" class="DetailTotal">
        <div :key="index" class="Detail" v-for="(item,index) in totalList">
          <p>{{Data[item.name]}}</p>
          <p>{{$t(item.title)}}</p>
        </div>
      </div>
      <div class="list" v-if="Data.incomes.length">
        <div :key="index" class="li" v-for="(item,index) in Data.incomes">
          <div class="left">
            <p>[{{$t(item.comments)}}]</p>
            <p>
              <span>{{item.direction ? `+${item.amount_double}` : `-${item.amount_double}`}} HGF</span>
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
</template>

<script>
import { formateDate } from "@/utils/date";
import { mapGetters, mapState } from "vuex";
export default {
  data () {
    return {
      activeName: "a",
      totalList: [],
      Data: {
        total: 0.00,
        title: "",
        type: 4,
        incomes: [],
        pushs: [],
        teams: []
      }
    };
  },
  created () {
    this.initList(this.$route.params.methods);
    switch (this.$route.params.methods) {
      case 'USER_ACCOUNT_DATEILS_VIEW':
        this.title = "资产记录";
        this.totalList = [
          { title: '可用资产', name: 'usable' },
          { title: '锁定资产', name: 'locked' },
          { title: '冻结资产', name: 'freezen' },
        ]
        break;
      case 'USER_HONOR_VIEW':
        this.title = "荣誉值记录";
        this.totalList = [
          { title: '荣誉值', name: 'honor' }
        ]
        break;
      case 'QUERY_BUY_PRODUCT_VIEW':
        this.title = "活跃度记录";
        this.totalList = [
          { title: '基础活跃度', name: 'activity' },
          { title: '推广活跃度', name: 'promotionActivity' },
        ]
        break;
      case 'REGISTRATION_AWARD_VIEW':
        this.title = "贡献度记录";
        this.totalList = [
          { title: '贡献度', name: 'total' }
        ]
        break;
      default:
        this.title = '记录'
    }
  },
  filters: {
    formate (time) {
      let date = new Date(time);
      return formateDate(date, "YYYY-MM-dd hh:mm");
    }
  },
  computed: {
    ...mapState(["LOADING"]),
    ...mapGetters(["get_chickens"])
  },
  methods: {
    initList (methods) {
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
    onClickLeft () {
      // this.$router.push({ name: "login" });
      window.history.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../../style/mixin.less';
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      .bg-image('../../../../static/img/shouyi-bg');
      background-repeat: no-repeat;
      background-size: contain;
      margin: 0 auto;
      box-sizing: border-box;
      .Detail {
        position: relative;
        width: 100%;
        p {
          line-height: 0.6rem;
          margin: 0;
          color: #fff;
          font-size: 0.3rem;
        }
        &:not(:last-child)::after {
          position: absolute;
          right: 0;
          top: 20%;
          height: 0.7rem;
          width: 2px;
          border-radius: 40%;
          background: #c6c6c6;
          display: block;
          content: ' ';
        }
      }
    }
    .lessTotal {
      p:first-child {
        font-size: 0.48rem !important;
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
          content: ' ';
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
      flex: 1;
      overflow: auto;
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
              color: #ef314b;
            }
          }
        }
        .right {
          display: flex;
          align-items: flex-end;
          color: #333;
          font-size: 0.28rem;
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
    .bg-image('../../../../static/img/zanwushuju');
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