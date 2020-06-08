<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('消息中心')" @click-left="onClickLeft" left-arrow></van-nav-bar>
    <!-- 内容部分 -->
    <div class="mine-content">
      <div v-if="adv_list.length">
        <div
          :key="index"
          @click="goRoute('informationDetail','item',item)"
          class="advisory_content"
          v-for="(item,index) in adv_list"
        >
          <div class="dian" v-if="!item.status"></div>
          <div class="adv_title">
            <span>{{item.type ? '通知': '公告'}}</span>
            <span :class="item.status ? 'yidu':'weidu'">{{item.status? '已读' : '未读'}}</span>
          </div>
          <p class="adv_cont">{{item.content}}</p>
          <div class="act_bottom">
            <span>{{new Date(item.create_date) | formate}}</span>
            <span>{{$t('查看详情>>')}}</span>
          </div>
        </div>
      </div>
      <div class="noData" v-if="!adv_list.length && !LOADING">
        <div class="img"></div>
        <p>{{$t('暂无公告')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { formateDate } from "@/utils/date";
import { mapGetters, mapState } from "vuex";
export default {
  // SMS_EVERY_SEND
  data () {
    return {
      active: 0,
      //   公告
      adv_list: []
    };
  },
  created () {
    this.get_news();
  },
  watch: {
    active (val) {
      this.get_news();
    }
  },
  filters: {
    formate (time) {
      let date = new Date(time);
      return formateDate(date, "YYYY-MM-dd hh:mm");
    }
  },
  computed: {
    ...mapState(["LOADING"])
  },
  methods: {
    onClickLeft () {
      window.history.go(-1);
    },
    get_news () {
      this.adv_list = [];
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "USER_MESSAGE_VIEW",
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.adv_list = data.Data.messages;
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    // 路由链接
    goRoute (name, paramsName, params) {
      this.$router.push({
        name: name,
        params: { [paramsName]: params }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../../style/mixin.less';
.register {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .van-icon {
    font-size: 0.45rem;
  }
  /deep/.mine-content {
    flex: 1;
    overflow: hidden;
    background: #f8f8f8;
    .van-tabs {
      height: 100%;
      display: flex;
      flex-direction: column;
      .van-tabs__content {
        flex: 1;
        overflow-y: auto;
      }
    }
    .advisory_content {
      margin: 0.2rem auto 0;
      width: 90%;
      background: #fff;
      border-radius: 0.2rem;
      padding: 0.4rem;
      margin-bottom: 0.3rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      box-shadow: 0px 3px 5px 0px rgba(105, 105, 105, 0.35);
      border-radius: 0.2rem;
      position: relative;
      .dian {
        position: absolute;
        width: 0.12rem;
        height: 0.12rem;
        background: #ef314b;
        border-radius: 50%;
        left: 0.18rem;
        top: 0.18rem;
      }
      .adv_title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.2rem;
        span:first-child {
          width: 3.18rem;
          font-size: 0.36rem;
          text-align: left;
          line-height: 0.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .yidu {
          font-size: 0.24rem;
          color: #999;
        }
        .weidu {
          font-size: 0.24rem;
          color: #ef314b;
        }
      }
      .adv_cont {
        color: #101010;
        font-size: 0.3rem;
        text-align: left;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .act_bottom {
        display: flex;
        justify-content: space-between;
        color: #999;
        font-size: 0.24rem;
        line-height: 0.6rem;
        span {
          &:first-of-type {
            overflow: hidden;
            text-align: left;
          }
          &:last-child {
            color: #ef314b;
          }
        }
      }
    }
    .noData {
      color: #999;
      font-size: 0.32rem;
      .img {
        width: 1.34rem;
        height: 1.34rem;
        margin: 3.5rem auto 0;
        .bg-image('../../../../static/img/zanwu');
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }
}
</style>