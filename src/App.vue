<template>
  <div id="app">
    <!-- 中英文切换 -->
    <transition name="van-fade">
      <div style="height: 100%;z-index:10;position:relative;overflow:hidden">
        <!-- <div class="chose" v-if="$route.meta.type === 1">
          <a :class="{isact : isAct}" @click="changeLanguage"></a>
        </div> -->
        <router-view />
      </div>
    </transition>
    <!-- <div v-show="isStart" class="ZDAO-start"></div> -->
    <!-- <update v-show="!isStart"></update> -->
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      // isStart: true,
      // isAct: true,
      version: ""
    };
  },
  created() {
    // if (localStorage.getItem("language")) {
    //   this.isAct = localStorage.getItem("language") === "en" ? true : false;
    // } else {
    //   this.$i18n.locale = this.isAct ? "en" : "zh";
    // }
  },

  mounted() {
    // setTimeout(() => {
    //   this.isStart = false;
    // }, 2000);
  },
  methods: {
    changeLanguage() {
      this.isAct = !this.isAct;
      this.$i18n.locale = this.isAct ? "en" : "zh";
      localStorage.setItem("language", this.isAct ? "en" : "zh");
    }
  }
};
window.onload = function() {
  document.addEventListener("touchstart", function(event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  });
  document.addEventListener("gesturestart", function(event) {
    event.preventDefault();
  });
};
</script>

<style lang="less">
@import "./style/mixin.less";
html,
body {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  text-align: center;
  color: #2c3e50;
  font-size: 0.12rem;
}
.chose {
  position: fixed;
  right: 0.5rem;
  top: 1rem;
  a {
    display: inline-block;
    width: 0.46rem;
    height: 0.46rem;
    .bg-image("../static/img/zhongwen");
    background-size: contain;
    background-repeat: no-repeat;
  }
  .isact {
    .bg-image("../static/img/yingwen");
  }
}
.ZDAO-start {
  background-image: url("../static/img/ZDao.gif");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}
</style>
