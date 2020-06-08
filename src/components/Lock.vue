<style>
.masks {
  text-align: center;
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}
.gesturePwd {
  position: fixed;
  z-index: 5000;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: #666;
  text-align: center;
  border-radius: 3px;
  overflow: hidden;
  background-color: #000;
}

.gestureTitle {
  color: #87888a;
  margin-top: 2.6rem;
  font-size: 0.4rem;
  font-weight: normal;
}
.gesturePwd p {
  color: #87888a;
  font-size: 0.24rem;
}
.lock-left {
  color: #87888a;
  z-index: 999999;
  float: left;
  font-size: 0.5rem !important;
  margin-top: 0.5rem;
  padding-left: 0.2rem;
}
</style> 

<template>
  <div class="masks">
    <van-icon
      class="lock-left"
      @click="goRoute"
      v-show="this.$route.params.type"
      name="arrow-left"
    />
    <div class="gesturePwd">
      <div style="position: absolute;top:0;left:0;right:0;bottom:0;">
        <h4 ref="gestureTitle" class="gestureTitle">{{$t('请绘制您的图形密码')}}</h4>
        <a
          ref="updatePassword"
          style="position: absolute;left: 5px;top: 5px;color:#fff;font-size: 13px;display:block;"
          @click="updatePassword()"
        ></a>

        <a
          ref="updatePassword"
          style="position: absolute;right: 5px;top: 5px;color:#fff;font-size: 13px;display:block;"
          @click="closePwd()"
        ></a>

        <canvas
          ref="canvas"
          style="background-color:#000; display: inline-block; width: 6.4rem; height: 6.4rem;"
        ></canvas>
        <p v-if="pswObj.step === 2" @click="goLogin">{{$t('账号密码登录')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pwdObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      ctx: "",
      width: 0,
      height: 0,
      devicePixelRatio: 0,
      chooseType: "",
      r: "", // 公式计算
      lastPoint: [],
      arr: [],
      restPoint: [],
      canvas: "",
      pswObj: {}
    };
  },
  watch: {},
  created() {
    this.pswObj = this.pwdObj;
  },
  mounted() {
    this.setChooseType(3);
  },
  methods: {
    closePwd(val) {
      this.$emit("chose_Lock", val);
    },
    goLogin() {
      this.$router.push({ name: "login" });
    },
    goRoute() {
      localStorage.removeItem("lock");
      window.history.go(-1);
    },
    H5lock(obj) {
      this.height = obj.height;
      this.width = obj.width;
      this.chooseType =
        Number(window.localStorage.getItem("chooseType")) || obj.chooseType;
      this.devicePixelRatio = window.devicePixelRatio || 1;
    },
    drawCle(x, y) {
      // 初始化解锁密码面板 小圆圈
      this.ctx.strokeStyle = "#87888a"; //密码的点点默认的颜色
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.r, 0, Math.PI * 2, true);
      this.ctx.closePath();
      this.ctx.stroke();
    },
    drawPoint(style) {
      // 初始化圆心
      for (var i = 0; i < this.lastPoint.length; i++) {
        this.ctx.fillStyle = style;
        this.ctx.beginPath();
        this.ctx.arc(
          this.lastPoint[i].x,
          this.lastPoint[i].y,
          this.r / 2.5,
          0,
          Math.PI * 2,
          true
        );
        this.ctx.closePath();
        this.ctx.fill();
      }
    },
    drawStatusPoint(type) {
      // 初始化状态线条
      for (var i = 0; i < this.lastPoint.length; i++) {
        this.ctx.strokeStyle = type;
        this.ctx.beginPath();
        this.ctx.arc(
          this.lastPoint[i].x,
          this.lastPoint[i].y,
          this.r,
          0,
          Math.PI * 2,
          true
        );
        this.ctx.closePath();
        this.ctx.stroke();
      }
    },
    drawLine(style, po, lastPoint) {
      //style:颜色 解锁轨迹
      this.ctx.beginPath();
      this.ctx.strokeStyle = style;
      this.ctx.lineWidth = 3;
      if (this.lastPoint.length) {
        this.ctx.moveTo(this.lastPoint[0].x, this.lastPoint[0].y);

        for (var i = 1; i < this.lastPoint.length; i++) {
          this.ctx.lineTo(this.lastPoint[i].x, this.lastPoint[i].y);
        }
        this.ctx.lineTo(po.x, po.y);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    },
    createCircle() {
      // 创建解锁点的坐标，根据canvas的大小来平均分配半径

      var n = this.chooseType;
      var count = 0;
      this.r = this.ctx.canvas.width / (2 + 4 * n); // 公式计算
      this.lastPoint = [];
      this.arr = [];
      this.restPoint = [];
      var r = this.r;
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
          count++;
          var obj = {
            x: j * 4 * r + 3 * r,
            y: i * 4 * r + 3 * r,
            index: count
          };
          this.arr.push(obj);
          this.restPoint.push(obj);
        }
      }
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      for (var i = 0; i < this.arr.length; i++) {
        this.drawCle(this.arr[i].x, this.arr[i].y);
      }

      //return arr;
    },
    getPosition(e) {
      // 获取touch点相对于canvas的坐标
      var rect = e.currentTarget.getBoundingClientRect();
      var po = {
        x: (e.touches[0].clientX - rect.left) * this.devicePixelRatio,
        y: (e.touches[0].clientY - rect.top) * this.devicePixelRatio
      };
      return po;
    },
    update(po) {
      // 核心变换方法在touchmove时候调用
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      for (var i = 0; i < this.arr.length; i++) {
        // 每帧先把面板画出来
        this.drawCle(this.arr[i].x, this.arr[i].y);
      }

      this.drawPoint("#27AED5"); // 每帧花轨迹
      this.drawStatusPoint("#27AED5"); // 每帧花轨迹

      this.drawLine("#27AED5", po, this.lastPoint); // 每帧画圆心

      for (var i = 0; i < this.restPoint.length; i++) {
        if (
          Math.abs(po.x - this.restPoint[i].x) < this.r &&
          Math.abs(po.y - this.restPoint[i].y) < this.r
        ) {
          this.drawPoint(this.restPoint[i].x, this.restPoint[i].y);
          this.lastPoint.push(this.restPoint[i]);
          this.restPoint.splice(i, 1);
          break;
        }
      }
    },
    checkPass(psw1, psw2) {
      // 检测密码
      var p1 = "",
        p2 = "";
      for (var i = 0; i < psw1.length; i++) {
        p1 += psw1[i].index + psw1[i].index;
      }
      for (var i = 0; i < psw2.length; i++) {
        p2 += psw2[i].index + psw2[i].index;
      }
      return p1 === p2;
    },
    storePass(psw) {
      // touchend结束之后对密码和状态的处理
      // his.pswObj.step == 1是设置密码
      if (psw.length < 4) {
        this.drawStatusPoint("red");
        this.drawPoint("red");
        this.drawLine(
          "red",
          this.lastPoint[this.lastPoint.length - 1],
          this.lastPoint
        ); // 每帧画圆心

        var gestureTitle = this.$refs.gestureTitle;
        gestureTitle.style.color = "red";
        gestureTitle.innerHTML = this.$t("请连接4个点");
        this.reset();
      } else {
        var gestureTitle = this.$refs.gestureTitle;
        gestureTitle.style.color = "#87888a";
        if (this.pswObj.step == 1) {
          if (this.checkPass(this.pswObj.fpassword, psw)) {
            // this.pswObj.step = 2;
            this.pswObj.spassword = psw;
            this.$refs.gestureTitle.innerHTML = this.$t("密码保存成功");

            this.drawStatusPoint("#2CFF26");
            this.drawPoint("#2CFF26");
            window.localStorage.setItem(
              "passwordxx",
              JSON.stringify(this.pswObj.spassword)
            );
            window.localStorage.setItem("chooseType", this.chooseType);
            this.closePwd(true);
          } else {
            this.$refs.gestureTitle.innerHTML = this.$t("两次不一致，重新输入");
            this.drawStatusPoint("red");
            this.drawPoint("red");
            delete this.pswObj.step;
          }

          // his.pswObj.step == 2是解锁状态
        } else if (this.pswObj.step == 2) {
          if (
            this.checkPass(JSON.parse(localStorage.getItem("passwordxx")), psw)
          ) {
            var gestureTitle = this.$refs.gestureTitle;
            gestureTitle.style.color = "#2CFF26";
            gestureTitle.innerHTML = this.$t("解锁成功");

            this.drawStatusPoint("#2CFF26"); //小点点外圈高亮
            this.drawPoint("#2CFF26");
            this.drawLine(
              "#2CFF26",
              this.lastPoint[this.lastPoint.length - 1],
              this.lastPoint
            ); // 每帧画圆心
            this.closePwd();
            delete this.pswObj.step;
          } else {
            this.drawStatusPoint("red");
            this.drawPoint("red");
            this.drawLine(
              "red",
              this.lastPoint[this.lastPoint.length - 1],
              this.lastPoint
            ); // 每帧画圆心

            var gestureTitle = this.$refs.gestureTitle;
            gestureTitle.style.color = "red";
            gestureTitle.innerHTML = this.$t("密码错误");
          }
        } else {
          this.pswObj.step = 1;
          this.pswObj.fpassword = psw;
          this.$refs.gestureTitle.innerHTML = this.$t("再次输入");
        }
      }
    },
    makeState() {
      let vm = this;
      if (vm.$refs.updatePassword) {
        if (vm.pswObj.step == 2) {
          vm.$refs.updatePassword.style.display = "block";
          var gestureTitle = vm.$refs.gestureTitle;
          gestureTitle.style.color = "#87888a";
          gestureTitle.innerHTML = vm.$t("请解锁");
        } else if (vm.pswObj.step == 1) {
          vm.$refs.updatePassword.style.display = "none";
        } else {
          vm.$refs.updatePassword.style.display = "block";
          // this.$refs.updatePassword.style.display  = 'block';
        }
      } else {
        return;
      }
    },
    setChooseType(type) {
      this.chooseType = type;
      this.init();
    },
    updatePassword() {
      window.localStorage.removeItem("passwordxx");
      window.localStorage.removeItem("chooseType");
      this.pswObj = {};
      this.$refs.gestureTitle.innerHTML = this.$t("绘制解锁图案");
      this.reset();
    },
    initDom() {
      this.chooseType = Number(window.localStorage.getItem("chooseType")) || 3;
      this.devicePixelRatio = window.devicePixelRatio || 1;

      var canvas = this.$refs.canvas;

      var width = this.width || 320;
      var height = this.height || 320;

      // 高清屏锁放
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.height = height * this.devicePixelRatio;
      canvas.width = width * this.devicePixelRatio;
    },
    init() {
      this.initDom();
      // this.pswObj = {
      //   step: this.pswObj.step,
      //   spassword: window.localStorage.getItem("passwordxx")
      //     ? JSON.parse(window.localStorage.getItem("passwordxx"))
      //     : ""
      // };
      this.lastPoint = [];
      this.makeState();
      this.touchFlag = false;

      this.canvas = this.$refs.canvas;

      this.ctx = this.canvas.getContext("2d");
      this.createCircle();
      this.bindEvent();
    },
    reset() {
      this.makeState();
      this.createCircle();
    },
    bindEvent() {
      var self = this;
      this.canvas = this.$refs.canvas;
      this.canvas.addEventListener(
        "touchstart",
        function(e) {
          e.preventDefault(); // 某些android 的 touchmove不宜触发 所以增加此行代码
          var po = self.getPosition(e);

          for (var i = 0; i < self.arr.length; i++) {
            if (
              Math.abs(po.x - self.arr[i].x) < self.r &&
              Math.abs(po.y - self.arr[i].y) < self.r
            ) {
              self.touchFlag = true;
              self.drawPoint(self.arr[i].x, self.arr[i].y);
              self.lastPoint.push(self.arr[i]);
              self.restPoint.splice(i, 1);
              break;
            }
          }
        },
        false
      );
      this.canvas.addEventListener(
        "touchmove",
        function(e) {
          if (self.touchFlag) {
            self.update(self.getPosition(e));
          }
        },
        false
      );
      this.canvas.addEventListener(
        "touchend",
        function(e) {
          if (self.touchFlag) {
            self.touchFlag = false;
            self.storePass(self.lastPoint);
            if (self.$refs.gestureTitle.innerHTML != self.$t("解锁成功")) {
              setTimeout(function() {
                self.reset();
              }, 1000);
            }
          }
        },
        false
      );
    }
  }
};
</script>
