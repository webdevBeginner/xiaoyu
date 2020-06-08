<template>
  <div class="activityList-content">
    <van-nav-bar :title="$t('活动中心')" @click-left="onClickLeft" left-arrow />
    <!-- 活动中心首页列表 -->
    <ol>
      <li>
        <div>
          <img :src="require('#/img/activityCenter/qianghongbao.png')" />
          <p class="cont">每日红包大放送</p>
        </div>
        <div class="describe">
          <van-row>
            <van-col span="12">
              <span>活动期间，平台每日投放大量HGF大红包</span>
            </van-col>
            <van-col span="12">
              <van-button @click="fnShowPop('RedBox')" class="btn" type="primary">点我，领取</van-button>
            </van-col>
          </van-row>
        </div>
      </li>

      <li>
        <div>
          <img :src="require('#/img/activityCenter/zadan.png')" />
        </div>
        <div class="describe">
          <van-row>
            <van-col span="12">
              <span>活动期间，每日可砸3次HGF金蛋</span>
            </van-col>
            <van-col span="12">
              <van-button @click="fnShowPop('HitEggs')" class="btn" type="primary">点我，砸蛋</van-button>
            </van-col>
          </van-row>
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data () {
    return {
      listArr: [{}],
    };
  },
  // computed: {
  //   ...mapGetters(["get_activityListShowPop", "get_activityListComponentName"])
  // },
  methods: {
    fnShowPop (name) {

      this.$store.commit("get_activityListShowPop", true);
      this.$store.commit("get_activityListComponentName", name);
    },
    onClickLeft () {
      // this.$router.push({ name: "login" });
      window.history.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.activityList-content {
  ol {
    margin: 0.38rem auto;
    li {
      width: 6.86025rem;
      height: 4.66rem;
      margin: 0 auto 0.57rem;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 3px 5px 0px rgba(105, 105, 105, 0.35);
      border-radius: 20px;
      position: relative;
      img {
        width: 100%;
      }
      .cont {
        margin: 0;
        position: absolute;
        right: 0.4rem;
        top: 0.54rem;
        font-size: 0.7rem;
        font-family: PingFang SC;
        font-weight: 800;
        color: rgba(255, 223, 73, 1);
        text-shadow: 0px 4px 2px rgba(14, 14, 14, 0.75);
      }
      .describe {
        padding: 0.3rem 0.37rem 0;
        font-size: 0.25rem;
        line-height: 0.35rem;
        .van-col:first-child {
          text-align: left;
        }
        .van-col:last-child {
          text-align: right;
        }
        .btn {
          width: 2.27rem;
          height: 0.55rem;
          line-height: 0.55rem;
          border: 0;
          background: rgba(239, 49, 75, 1);
          border-radius: 0.27rem;
          font-size: 0.28rem;
          font-family: PingFang SC;
          font-weight: 800;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
}
</style>