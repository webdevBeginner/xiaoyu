<template>
  <div class="hitEggsClassname">
    <div class="hitEggsClassnameBox">
      <van-row v-show="!isPrize" type="flex" justify="space-around" class="flexeggs">
        <van-col v-for="(item, index) in eggsArr" :key="item.id" span="6">
          <img :src="item.path" @click="handleClick(index)" />
          <div>砸我</div>
        </van-col>
      </van-row>

      <div v-show="isPrize" class="prize">
        <div>
          <p>恭喜获得</p>
          <h3>100HGF</h3>
        </div>
        <img :src="require('#/img/activityCenter/zakai.png')" />
      </div>
    </div>

    <van-icon name="close" @click="closePop()" class="close-popup" size=".6rem" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const eggsImgPath = [
  require("#/img/activityCenter/eggs.png"),
  require("#/img/activityCenter/eggs2.jpg"),
  require("#/img/activityCenter/zakai.png")
];

export default {
  data() {
    return {
      eggsArr: [
        { id: 1001, threshold: 5, path: eggsImgPath[0] },
        { id: 1002, threshold: 5, path: eggsImgPath[0] },
        { id: 1003, threshold: 5, path: eggsImgPath[0] }
      ],
      // switchEvent: false,
      isPrize: false
    };
  },
  computed: {
    ...mapGetters(["get_activityListShowPop", "get_activityListComponentName"])
  },
  methods: {
    closePop(val) {
      this.$store.commit("get_activityListShowPop", false);
      this.$store.commit("get_activityListComponentName", "");
    },

    handleClick(index, event) {
      // if (this.switchEvent) return false;
      let threshold = this.eggsArr[index].threshold;
      this.eggsArr[index].threshold = --threshold;

      switch (threshold) {
        case 2:
          this.eggsArr[index].path = eggsImgPath[1];
          break;
        case 0:
          // this.eggsArr[index].path = eggsImgPath[2];
          this.isPrize = true;
          break;
      }
    }
  }
};
</script>


<style lang="less" scoped>
.hitEggsClassname {
  .hitEggsClassnameBox {
    height: 8rem;
    display: flex;
    align-items: center;
  }
  .flexeggs {
    .van-col {
      img {
        width: 100%;
      }
      div {
        width: 1.2rem;
        height: 0.52rem;
        padding: 0;
        border: 1px solid rgba(247, 179, 3, 1);
        border-radius: 10px;
        font-size: 0.36rem;
        font-family: PingFang SC;
        font-weight: 800;
        color: rgba(247, 179, 4, 1);
        line-height: 0.52rem;
        text-align: center;
        margin: 0 auto;
      }
    }
  }

  .prize {
    position: relative;
    height: 8rem;
    div {
      position: absolute;
      width: 100%;
      top: 1rem;
      p {
        margin: 0;
        padding: 0;
        height: 0.56rem;
        font-size: 0.56rem;
        font-family: PingFang SC;
        font-weight: 800;
        color: rgba(247, 179, 4, 1);
        line-height: 0.56rem;
        text-shadow: 0px 3px 0px rgba(0, 0, 0, 0.26);
        text-align: center;
      }
      h3 {
        margin: 0;
        padding: 0;
        height: 1.56rem;
        font-size: 1.17rem;
        font-family: PingFang SC;
        font-weight: 800;
        color: rgba(247, 179, 4, 1);
        line-height: 1.56rem;
        text-shadow: 0px 3px 10px rgba(0, 0, 0, 0.4);
        text-align: center;
      }
    }
    img {
      width: 76.267%;
    }
  }
  .close-popup {
    &::before {
      color: #fff;
    }
  }
}
</style>