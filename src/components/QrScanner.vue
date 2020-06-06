<template>
  <div id="camera">
    <!-- 顶部导航栏 -->
    <div id="bcid"></div>
    <div class="action" @click="onClickLeft">
      <van-icon class="cross" name="cross" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    //
  },
  data() {
    return {
      text: "",
      codeUrl: "",
      scan: ""
    };
  },
  mounted() {
    setTimeout(() => {
      // 调用开始扫描
      this.startScan();
    }, 500);
  },
  beforeDestroy() {
    if (!window.plus) return;
    this.scan.cancel();
    this.scan.close();
  },
  methods: {
    onClickLeft() {
      this.$emit("showResult", "");
      // this.cancelScan();
      this.closeScan();
      // this.$router.push({ name: "login" });
      // window.history.go(-1);
    },
    //创建扫描控件
    startRecognize() {
      let that = this;
      if (!window.plus) return;

      // 初始化扫描控件
      this.scan = new plus.barcode.Barcode("bcid");
      this.scan.onmarked = onmarked;

      // 扫描后回调
      function onmarked(type, result, file) {
        switch (type) {
          case plus.barcode.QR:
            type = "QR";
            break;
          case plus.barcode.EAN13:
            type = "EAN13";
            break;
          case plus.barcode.EAN8:
            type = "EAN8";
            break;
          default:
            type = "其它" + type;
            break;
        }
        result = result.replace(/\n/g, "");
        that.codeUrl = result;
        that.$emit("showResult", result);
        // 返回值
        that.closeScan();
      }
    },
    //开始扫描
    startScan() {
      if (!window.plus) return;
      this.startRecognize(); //创建控件
      setTimeout(() => {
        this.scan.start();
      }, 200);
    },
    //关闭扫描
    cancelScan() {
      if (!window.plus) return;
      this.scan.cancel();
    },
    //关闭条码识别控件
    closeScan() {
      if (!window.plus) return;
      this.scan.close();
    }
  }
};
</script>

<style lang="less" scoped>
#camera {
  height: 100%;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 1);
  z-index: 99;
  .van-icon {
    top: -2px;
    font-size: 30px;
    color: #fff;
    &.back {
      left: 10px;
    }
    &.light {
      right: 10px;
    }
  }
  #bcid {
    width: 100%;
    height: 85%;
    z-index: 2;
    position: fixed;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 1);
  }
  .action {
    position: fixed;
    z-index: 777;
    width: 100%;
    left: 0.3rem;
    top: 0.8rem;
    text-align: left;
  }
}
</style>