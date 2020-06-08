<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('团队规则')" @click-left="onClickLeft" left-arrow />
    <div class="list">
      <div :key="index" class="li" v-for="(item,index) in badgeList">
        <div class="now" v-if="item.now">{{$t('当前级别')}}</div>
        <div class="top">
          <div :class="item.name+'xing'" class="img"></div>
          <div class="content">
            <div :class="item.act ? 'act-title' : ''" class="title">
              <span>{{item.title}}</span>
            </div>
            <div class="remark" v-html="item.content"></div>
          </div>
        </div>
        <div class="bottom">{{item.reward}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // SMS_EVERY_SEND
  data () {
    return {
      // 当前的理财规则
      nowLevel: 2,
      // 所有的理财规则
      badgeList: [
        {
          level: 1,
          name: 'yi',
          title: `${this.$t("初级创业者")}`,
          content: `1、${this.$t("团队总活跃度 500 点")}</br>2、${this.$t(
            "有效直推 20 人"
          )}`,
          reward: '奖励初级矿机一台+全球交易手续费分红5%'
        },
        {
          level: 2,
          name: 'er',
          title: `${this.$t("中级创业者")}`,
          content: `1、${this.$t("团队总活跃度达到 2000 点")}</br>2、${this.$t(
            "小区活跃度达到 20%"
          )}`,
          reward: '奖励中级矿机一台+全球交易手续费分红20%'
        },
        {
          level: 3,
          name: 'san',
          title: `${this.$t("高级创业者")}`,
          content: `1、${this.$t("团队总活跃度达到 8000 点")}</br>2、${this.$t(
            "小区活跃度达到 25%"
          )}`,
          reward: '奖励高级矿机一台+全球交易手续费分红15%'
        },
        {
          level: 4,
          name: 'si',
          title: `${this.$t("梦想创业者")}`,
          content: `1、${this.$t("团队总活跃度达到 100000 点")}</br > 2、${this.$t(
            "小区活跃度达到 25%"
          )}`,
          reward: '奖励超级矿机一台+全球交易手续费分红10%'
        }
      ]
    };
  },
  created () {
    this.mview.socket.send({
      data: {
        method: "USER_LEVEL_VIEW"
      },
      success: data => {
        if (data.Code == 0) {
          this.nowLevel = data.Data.level;
          let arr = [];
          this.badgeList.map(_ => {
            _["act"] = _.level > this.nowLevel ? false : true;
            if (_.level === this.nowLevel) {
              _["now"] = true;
            }
            arr.push(_);
          });
          this.badgeList = arr;
        } else {
          this.$toast(this.$t(data.Message));
        }
      }
    });
  },
  methods: {
    onClickLeft () {
      window.history.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../../style/mixin.less';
.register {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .list {
    flex: 1;
    overflow: auto;
    padding: 0 0.32rem;
    margin-top: 0.3rem;
    .li {
      padding: 0.36rem 0 0;
      background: #fff;
      border-radius: 0.2rem;
      margin-bottom: 0.4rem;
      box-shadow: 0px 3px 5px 0px rgba(105, 105, 105, 0.35);
      position: relative;
      .now {
        position: absolute;
        left: -0.5rem;
        top: 0.24rem;
        height: 0.36rem;
        line-height: 0.36rem;
        color: #fff;
        font-size: 0.2rem;
        padding: 0 0.1rem;
        background: #ef314b;
        box-shadow: 4px 0px 0px 0px rgba(0, 0, 0, 0.35);
        border-radius: 0px 0.16rem 0.16rem 0px;
      }
      .top {
        display: flex;
        justify-content: space-between;
        padding-bottom: 0.3rem;
      }
      .bottom {
        line-height: 1.04rem;
        color: #101010;
        font-size: 0.3rem;
        border-top: 1px solid #ececec;
      }
      .img {
        width: 1.98rem;
        height: 1.84rem;
        margin-left: 0.2rem;
        margin-right: 0.42rem;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
      }
      .yixing {
        .bg-image('../../../../static/img/yixing');
      }
      .erxing {
        .bg-image('../../../../static/img/erxing');
      }
      .sanxing {
        .bg-image('../../../../static/img/sanxing');
      }
      .sixing {
        .bg-image('../../../../static/img/sixing');
      }
      .content {
        flex: 1;
        text-align: left;
        color: #101010;
        .title {
          font-size: 0.32rem;
          color: #101010;
        }
        .remark {
          padding-top: 0.2rem;
          font-size: 0.24rem;
          line-height: 0.4rem;
        }
      }
    }
  }
}
</style>