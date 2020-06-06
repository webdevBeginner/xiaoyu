<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('邀请链接')" left-arrow @click-left="onClickLeft" />
    <div class="mine-content" ref="content">
      <!-- <img v-if="posterDataUrl" :src="posterDataUrl" alt /> -->
      <div class="share-bg">
        <div style="width:100%;height:100%">
          <div class="share-po">
            <div class="share-content" ref="imageToFile">
              <div class="left">
                <p>{{link1}}</p>
                <p>{{$t('我的邀请码')}}</p>
              </div>
              <div class="right">
                <div id="qrcode">
                  <canvas class="qr" id="qrCode-canvas"></canvas>
                  <!-- <img :src="saveImgpath" alt /> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="share-btn">
        <!-- <span @click="screenShot">{{$t('保存二维码')}}</span> -->
        <span @click="doCopy">{{$t('分享链接')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import domtoimage from "dom-to-image";
import html2canvas from "html2canvas";
export default {
  // USER_INVITE_VIEW
  data() {
    return {
      img: "",
      saveImgpath: "",
      link: "",
      link1: "",
      posterDataUrl: ""
    };
  },
  async mounted() {
    this.qrcode();
  },
  components: { QRCode, domtoimage, html2canvas },
  methods: {
    qrcode() {
      this.mview.socket.send({
        data: {
          method: "USER_INVITE_VIEW"
        },
        success: data => {
          if (data.Code == 0) {
            // var img = new Image();
            // img.setAttribute("crossOrigin", "anonymous");
            this.link1 = data.Data.code;
            this.link = `http://zdaoweb.com/download/app.html`;
            this.$nextTick(function() {
              let canvas = document.getElementById("qrCode-canvas");
              QRCode.toCanvas(canvas, this.link, error => {
                if (error) {
                  console.log(error);
                } else {
                  //qrcode 生成的二维码会带有一些默认样式，需要调整下
                  canvas.style.width = "1.8rem";
                  canvas.style.height = "1.8rem";
                  canvas.style.margin = "0";

                  let content = this.$refs.imageToFile;
                  let vm = this;
                  domtoimage
                    .toPng(content, { quality: 0.95 })
                    .then(function(dataUrl) {
                      vm.posterDataUrl = dataUrl;
                    })
                    .catch(function(error) {
                      console.error("oops, something went wrong!", error);
                    });
                }
              });
            });
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    },
    doCopy() {
      this.$copyText(this.link).then(
        e => {
          // success
          this.$toast({
            /*这是使用了element-UI的信息弹框*/
            message: this.$t("邀请链接复制成功！")
          });
        },
        e => {
          // fail
          this.$toast({
            message: this.$t("复制失败，请手动选择复制！")
          });
        }
      );
    },

    //转换图片文件
    screenShot() {
      let that = this;
      that.mview.socket.send({
        data: {
          method: "STORE_PICTURES_ACTION",
          imgUrl: that.posterDataUrl
        },
        success: data => {
          if (data.Code == 0) {
            let path = data.Data.imgPath;
            plus.gallery.save(
              path,
              function() {
                that.$toast(that.$t("保存图片到相册成功"));
              },
              function(e) {
                that.$toast(that.$t("保存失败"));
              }
            );
          } else {
            that.$toast(that.$t(data.Message));
          }
        }
      });
    },
    onClickLeft() {
      window.history.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../style/mixin.less";
.register {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .mine-content {
    flex: 1;
    width: 100%;
    background: #000;
    padding-top: 0.8rem;
    .share-bg {
      width: 6.56rem;
      height: 9.4rem;
      margin: 0 auto;
      background-repeat: no-repeat;
      background-size: contain;
      border-radius: 0.3rem;
      .bg-image("../../../../../static/img/share-bg");
      overflow: hidden;
      position: relative;
      .share-po {
        position: absolute;
        bottom: 0;
        width: 100%;
      }
      .share-content {
        height: 2.2rem;
        background: #fff;
        display: flex;
        justify-content: space-between;
        border-bottom-left-radius: 0.3rem;
        border-bottom-right-radius: 0.3rem;
        .left {
          width: 50%;
          color: #212437;
          text-align: left;
          padding-left: 0.5rem;
          p {
            margin: 0;
            font-size: 0.3rem;
            line-height: 0.6rem;
            &:first-of-type {
              margin-top: 0.6rem;
              font-size: 0.58rem;
            }
          }
        }
        .right {
          width: 50%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          #qrcode {
            width: 1.48rem;
            height: 1.48rem;
            border: 4px solid #2659ff;
            margin-right: 0.3rem;
            border-radius: 0.1rem;
            overflow: hidden;
            position: relative;
            canvas {
              position: absolute;
              top: -8px;
              left: -8px;
              margin: 0;
            }
          }
        }
      }
    }
    .share-btn {
      height: 0.98rem;
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      background: #fff;
      color: #2659ff;
      font-size: 0.3rem;
      line-height: 0.98rem;
      span {
        display: inline-block;
        width: 100%;
        height: 0.64rem;
        line-height: 0.64rem;
        box-sizing: border-box;
        &:first-child {
          border-right: 1px solid #ebebeb;
        }
      }
    }
  }
}
</style>