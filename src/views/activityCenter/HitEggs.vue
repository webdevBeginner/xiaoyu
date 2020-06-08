<template>
  <div class="hitEggsClassname">
    <div class="hitEggsClassnameBox">
      <van-row class="flexeggs" justify="space-around" type="flex" v-show="!isPrize">
        <van-col :key="item.id" ref="eggsEl" span="6" v-for="(item, index) in eggsArr">
          <img :src="item.path" @click="handleClick(index)" />
          <div>砸我</div>
        </van-col>
      </van-row>

      <div class="prize" v-show="isPrize">
        <div>
          <p>恭喜获得</p>
          <h3>100HGF</h3>
        </div>
        <img :src="require('#/img/activityCenter/zakai.png')" />
      </div>

      <img
        :class="hitClassName"
        alt="hit"
        id="hitElement"
        ref="hitEl"
        src="../../../static/img/activityCenter/hit.png"
        v-show="!isPrize"
      />
    </div>

    <van-icon @click="closePop()" class="close-popup" name="close" size=".6rem" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import eggsUrl from "#/img/activityCenter/eggs.png";
import eggsUrl2 from "#/img/activityCenter/eggs2.jpg";

export default {
  data () {
    return {
      eggsArr: [
        { id: 1001, path: eggsUrl },
        { id: 1002, path: eggsUrl },
        { id: 1003, path: eggsUrl }
      ],
      isPrize: false,
      arrClickHistory: [],
      hitAggesIndex: -1
    };
  },
  computed: {
    ...mapGetters(["get_activityListShowPop", "get_activityListComponentName"]),
    hitClassName () {
      return "move" + this.hitAggesIndex;
    }
  },
  methods: {
    closePop (val) {
      this.$store.commit("get_activityListShowPop", false);
      this.$store.commit("get_activityListComponentName", "");
    },

    handleClick (index) {
      this.hitAggesIndex = index;
      // 动画结束时事件
      const _this = this;
      let timer = null;
      document.querySelector("#hitElement").addEventListener(
        "webkitAnimationEnd",
        function () {
          _this.eggsArr[index].path = eggsUrl2; // 更换图片
          timer = setTimeout(() => {
            clearTimeout(timer);
            _this.isPrize = true;
          }, 1000);

          this.audio = new Audio();
          this.audio.src = "../../../static/media/activityCenter.mp3";
          let playPromise;
          playPromise = this.audio.play();
          if (playPromise) {
            playPromise
              .then(() => {
                // 音频加载成功
                // 音频的播放需要耗时
                that.tiemr = setInterval(() => {
                  second--;
                  if (second <= 0) {
                    that.audio.pause();
                    clearInterval(that.tiemr);
                  }
                }, 1000);
              })
              .catch(e => {
                // 音频加载失败
                console.error(e);
              });
          }
        },
        false
      );
    }
  },
  mounted () {
    //添加css规则
    function addCSSRule (sheet, selector, rules, index) {
      if ("insertRule" in sheet) {
        sheet.insertRule(selector + "{" + rules + "}", index);
      } else if ("addRule" in sheet) {
        sheet.addRule(selector, rules, index);
      }
    }
    //删除CSS规则
    function delCSSRule (sheet) {
      sheet.deleteRule(0);
    }
    let kernelName = [
      "@keyframes",
      "@-moz-keyframes",
      "@-webkit-keyframes",
      "@-o-keyframes"
    ];

    setTimeout(() => {
      let hitEl = this.$refs.hitEl;
      let { offsetLeft, offsetTop } = hitEl;
      for (let index = 0; index < this.eggsArr.length; index++) {
        let item = this.$refs.eggsEl[index].$el;
        let itemOffsetL = item.offsetLeft + item.clientWidth / 2;
        let itemOffsetT = item.offsetTop;
        //动态添加规则
        addCSSRule(
          document.styleSheets[0],
          "@-webkit-keyframes" + " mymove" + index,
          `0% {top:${offsetTop}px; left: ${offsetLeft}px;}
          70% { top:${itemOffsetT}px; left: ${itemOffsetL}px; transform:rotate(0deg); transform-origin:0% 100%;}
          80% { top:${itemOffsetT}px; left: ${itemOffsetL}px; transform:rotate(-90deg); transform-origin:0% 100%;}
          90% { top:${itemOffsetT}px; left: ${itemOffsetL}px; transform:rotate(-10deg); transform-origin:0% 100%;}
          95% { top:${itemOffsetT}px; left: ${itemOffsetL}px; transform:rotate(-90deg); transform-origin:0% 100%;}
          100% { top:${itemOffsetT}px; left: ${itemOffsetL}px; transform:rotate(-10deg); transform-origin:0% 100%;}`
        );
      }
    }, 100);
  }
};
</script>
<style lang="less" scoped>
.move0 {
  animation: mymove0 1s forwards;
  position: absolute;
}
.move1 {
  animation: mymove1 1s forwards;
  position: absolute;
}
.move2 {
  animation: mymove2 1s forwards;
  position: absolute;
}

.hitEggsClassname {
  .hitEggsClassnameBox {
    position: relative;
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

    color: #f35626;
    background-image: -webkit-linear-gradient(92deg, #f35626, #feab3a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-animation: hue 60s infinite linear;

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

  #hitElement {
    position: absolute;
    right: 2rem;
    top: 1rem;
    width: 1.4rem;
    height: 1.35rem;
  }
  .close-popup {
    &::before {
      color: #fff;
    }
  }
}
</style>