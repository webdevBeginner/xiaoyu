<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('团队等级说明')" left-arrow @click-left="onClickLeft" />
    <div class="list">
      <div class="li" v-for="(item,index) in badgeList" :key="index">
        <div class="now" v-if="item.now">{{$t('当前级别')}}</div>
        <div class="img" :class="'z' +item.level "></div>
        <div class="content">
          <div class="title" :class="item.act ? 'act-title' : ''">
            <span>{{item.title}}：</span>
            <p>
              Z
              <span>{{item.level}}</span>
            </p>
          </div>
          <div v-html="item.content" class="remark"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // SMS_EVERY_SEND
  data() {
    return {
      // 当前的理财规则
      nowLevel: 2,
      // 所有的理财规则
      badgeList: [
        {
          level: 1,
          title: `${this.$t("第一级别")}`,
          content: `1、${this.$t("直推3个有效用户")}</br>2、${this.$t(
            "团队业绩≥300ZEC"
          )}`
        },
        {
          level: 2,
          title: `${this.$t("第二级别")}`,
          content: `1、${this.$t("三个部门中任意产生一个Z1")}</br>2、${this.$t(
            "团队业绩≥1000ZEC"
          )}`
        },
        {
          level: 3,
          title: `${this.$t("第三级别")}`,
          content: `1、${this.$t("三个部门中各产生一个Z1")}</br>2、${this.$t(
            "团队业绩≥2000ZEC"
          )}`
        },
        {
          level: 4,
          title: `${this.$t("第四级别")}`,
          content: `1、${this.$t("三个部门中各产生一个Z3")}</br>2、${this.$t(
            "团队业绩≥3000ZEC"
          )}`
        },
        {
          level: 5,
          title: `${this.$t("第五级别")}`,
          content: `1、${this.$t("三个部门中各产生三个Z4")}`
        }
      ]
    };
  },
  created() {
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
    onClickLeft() {
      window.history.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin.less";
.register {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .list {
    flex: 1;
    overflow: auto;
    padding: 0 0.5rem;
    margin-bottom: 0.3rem;
    .li {
      display: flex;
      justify-content: space-between;
      padding: 0.36rem 0 0.2rem;
      border-bottom: 1px solid #eee;
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
        background: #2659ff;
        box-shadow: 4px 0px 0px 0px rgba(0, 0, 0, 0.35);
        border-radius: 0px 0.16rem 0.16rem 0px;
      }
      .img {
        width: 1.27rem;
        height: 1.3rem;
        margin-right: 0.42rem;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
      }
      .z1 {
        .bg-image("../../../../static/img/z1");
      }
      .z2 {
        .bg-image("../../../../static/img/z2");
      }
      .z3 {
        .bg-image("../../../../static/img/z3");
      }
      .z4 {
        .bg-image("../../../../static/img/z4");
      }
      .z5 {
        .bg-image("../../../../static/img/z5");
      }
      .content {
        flex: 1;
        text-align: left;
        color: #999;
        .title {
          font-size: 0.32rem;
          color: #101010;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          p {
            margin: 0;
            color: #ef314b;
            display: flex;
            justify-content: flex-start;
            align-items: flex-end;
            font-size: 0.3rem;
            span {
              font-size: 0.24rem;
            }
          }
        }
        .act-title {
          color: #000;
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