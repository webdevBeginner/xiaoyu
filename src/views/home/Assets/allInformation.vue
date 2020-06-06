<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('全部资讯')" left-arrow @click-left="onClickLeft"></van-nav-bar>
    <!-- 内容部分 -->
    <div class="mine-content">
      <van-tabs v-model="active" animated>
        <van-tab :title="$t('公告')">
          <div v-if="adv_list.length">
            <div
              class="advisory_content"
              v-for="(item,index) in adv_list"
              :key="index"
              @click="goRoute('informationDetail','item',item)"
            >
              <div class="adv_act">
                <div class="adv_title">{{item.title}}</div>
                <p class="adv_cont">{{item.content}}</p>
                <div class="act_bottom">
                  <span>{{$t('来自')}}{{item.author}}</span>
                  <span>{{new Date(item.date) | formate}}</span>
                </div>
              </div>
              <div class="adv_img">
                <img :src="item.icon ? item.icon : require('#/img/gonggao@2x.png')" alt />
              </div>
            </div>
          </div>
          <div v-if="!adv_list.length && !LOADING" class="noData">
            <div class="img"></div>
            <p>{{$t('暂无公告')}}</p>
          </div>
        </van-tab>
        <van-tab :title="$t('新闻')">
          <div class="auto" v-if="adv_list.length">
            <div
              class="advisory_content"
              v-for="(item,index) in adv_list"
              :key="index"
              @click="goRoute('informationDetail','item',item)"
            >
              <div class="adv_act">
                <div class="adv_title">{{item.title}}</div>
                <p class="adv_cont">{{item.content}}</p>
                <div class="act_bottom">
                  <span>{{$t('来自')}}{{item.author}}</span>
                  <span>{{new Date(item.date) | formate}}</span>
                </div>
              </div>
              <div class="adv_img">
                <img :src="item.icon ? item.icon : require('#/img/gonggao@2x.png')" alt />
              </div>
            </div>
          </div>
          <div v-if="!adv_list.length && !LOADING" class="noData">
            <div class="img"></div>
            <p>{{$t('暂无新闻')}}</p>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { formateDate } from "@/utils/date";
import { mapGetters, mapState } from "vuex";
export default {
  // SMS_EVERY_SEND
  data() {
    return {
      active: 0,
      //   公告
      adv_list: []
    };
  },
  created() {
    this.get_news();
  },
  watch: {
    active(val) {
      this.get_news();
    }
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
  methods: {
    onClickLeft() {
      window.history.go(-1);
    },
    get_news() {
      this.adv_list = [];
      this.$store.commit("showLoading");
      this.mview.socket.send({
        data: {
          method: "NEWS_VIEW",
          type: this.active + 1,
          page: 1,
          count: 10
        },
        success: data => {
          this.$store.commit("hideLoading");
          if (data.Code == 0) {
            this.adv_list = data.Data.lists;
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
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
      height: 1.89rem;
      width: 90%;
      background: #fff;
      border-radius: 0.2rem;
      padding: 0.18rem;
      margin-bottom: 0.3rem;
      box-sizing: border-box;
      display: flex;
      .adv_act {
        flex: 1;
        .adv_title {
          width: 3.8rem;
          font-size: 0.3rem;
          text-align: left;
          line-height: 0.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .adv_cont {
          color: #999;
          font-size: 0.24rem;
          text-align: left;
          margin: 0;
          width: 3.8rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .act_bottom {
          width: 3.8rem;
          display: flex;
          justify-content: space-between;
          color: #999;
          font-size: 0.22rem;
          line-height: 0.6rem;
          span {
            &:first-of-type {
              width: 1.2rem;
              overflow: hidden;
              text-align: left;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
      .adv_img {
        width: 2.26rem;
        height: 100%;
        border: 1px solid rgba(255, 227, 72, 1);
        border-radius: 0.2rem;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
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
        .bg-image("../../../../static/img/zanwu");
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }
}
</style>