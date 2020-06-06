<template>
  <div class="myPhone">
    <van-field
      v-model="userInfo.moblie"
      :readonly="lockPhone"
      type="tel"
      @blur="changePhoneNum"
      :placeholder="$t('请输入手机号')"
    >
      <span slot="button" size="small" type="primary" @click="show=true">{{userInfo.country}}</span>
    </van-field>
    <van-action-sheet v-model="show" :actions="actions" @select="onSelect" />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["userList"],
  data() {
    return {
      show: false,
      actions: [
        { name: "+86", color: "#000" },
        { name: "+66" },
        { name: "+60" },
        { name: "+84" },
        { name: "+65" },
        { name: "+62" },
        { name: "+95" },
        { name: "+852" },
        { name: "+853" },
        { name: "+855" }
      ],
      userInfo: {
        moblie: "",
        country: "+86"
      }
    };
  },
  computed: {
    ...mapState(["lockPhone"])
  },
  watch: {
    showPhone(val) {
      console.log(val);
    }
  },

  created() {
    console.log(this.lockPhone);
    this.$store.commit("showPhone", false);
    this.userInfo = JSON.parse(JSON.stringify(this.userList));
  },
  methods: {
    changePhoneNum() {
      this.$emit("change-info", this.userInfo);
    },
    onSelect(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.userInfo.country = item.name;
      this.show = false;
      this.actions.map(_ => {
        if (_.name === item.name) {
          _.color = "#000";
        } else {
          delete _.color;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin.less";
/deep/.myPhone {
  .van-cell {
    margin-bottom: 0.2rem;
    background-repeat: no-repeat;
    background-size: 0.5rem;
    background-position: left;
    .bg-image("../../static/img/shoujihao"); //小手机
    .van-field__body {
      flex-direction: row-reverse;
      -ms-flex-direction: row-reverse;
      .van-field__button {
        padding-left: 0;
        padding-right: 0.5rem;
        .bg-image("../../static/img/down"); //小箭头
        background-repeat: no-repeat;
        background-size: 0.14rem;
        background-position: 80% center;
        line-height: 0.56rem;
      }
    }
    .van-action-sheet__item {
      border-bottom: 1px solid #f7f1f1f1;
    }
    .van-cell:not(:last-child)::after {
      border-color: #515151;
      left: 0;
    }
  }
}
</style>