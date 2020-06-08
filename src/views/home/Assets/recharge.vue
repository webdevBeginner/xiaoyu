<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar :title="$t('充值')" @click-left="onClickLeft" left-arrow />
    <div class="mine-content">
      <div class="first-bg">
        <div class="white-bg">
          <div id="qrcode">
            <img :src="saveImgpath" alt />
          </div>
        </div>
      </div>
      <div class="mine-bottom">
        <div class="title">{{$t('充值地址')}}</div>
        <p>{{link}}</p>
        <button @click="doCopy('link')" class="btn">{{$t('复制')}}</button>
      </div>
      <div class="bottom">
        <p>{{$t(`温馨提示`)}}：</p>
        <p>1. {{$t(`仅支持充值HGF`)}}</p>
        <p>2. {{$t(`不支持匿名转账充值`)}}</p>
        <p>3. {{$t(`最小充值数量为1HGF`)}}</p>
        <p>4. {{$t(`12次网络确认后到账，24次网络确认后可提币`)}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import html2canvas from "html2canvas";
export default {
  // SMS_EVERY_SEND
  data () {
    return {
      saveImgpath: "",
      link: ""
    };
  },
  created () {
    this.$nextTick(function () {
      this.mview.socket.send({
        data: {
          method: "USER_ADDRESS_VIEW"
        },
        success: data => {
          if (data.Code == 0) {
            this.link = data.Data.address;
            this.$nextTick(function () {
              this.qrcode();
            });
          } else {
            this.$toast(this.$t(data.Message));
          }
        }
      });
    });
  },
  components: { QRCode, html2canvas },
  methods: {
    qrcode () {
      QRCode.toDataURL(this.link, {
        version: 7, //这个是版本号，
        errorCorrectionLevel: "Q", //这个是容错率,(建议选较低)更高的级别可以识别
        width: 280,
        height: 280, //设置二维码图片大小
        margin: 0
      })
        .then(url => {
          //这个url是二维码生成地址，也就是相当于图片地址
          this.saveImgpath = url; //这个是vue实例全局的变量，赋值给他。后面会用在img的src属性上
        })
        .catch(err => {
          console.error(err); //这里看不懂的话去看一下Promise（then, catch）
        });
    },
    doCopy (text) {
      this.$copyText(this[text]).then(
        e => {
          // success
          this.$toast({
            /*这是使用了element-UI的信息弹框*/
            message: this.$t("充值地址复制成功！")
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .mine-content {
    flex: 1;
    background: #f8f8f8;
    .first-bg {
      width: 2.9rem;
      height: 2.9rem;
      margin: 1.09rem auto 0.27rem;
      background: #ef314b;
      border-radius: 0.1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .white-bg {
        width: 2.67rem;
        height: 2.67rem;
        background: #fff;
        border-radius: 0.1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        #qrcode {
          width: 2.45rem !important;
          height: 2.45rem !important;
          /deep/img {
            width: 2.45rem !important;
            height: 2.45rem !important;
          }
        }
      }
    }
    .mine-bottom {
      width: 85%;
      height: 2.68rem;
      margin: 0.7rem auto;
      text-align: center;
      background: #fff;
      border-radius: 0.1rem;
      .title {
        font-size: 0.3rem;
        color: #000;
        line-height: 0.86rem;
      }
      p {
        color: #999;
        font-size: 0.28rem;
        word-break: break-all;
        margin: 0 0.3rem;
      }
      button {
        font-size: 0.3rem;
        color: #fff;
        font-weight: normal;
        background: #ef314b;
        border: 0;
        width: 2.9rem;
        height: 0.68rem;
        margin-top: 0.2rem;
        border-radius: 0.1rem;
      }
    }
    .bottom {
      margin-left: 0.8rem;
      p {
        font-size: 0.28rem;
        color: #999;
        line-height: 0.5rem;
        margin: 0;
        text-align: left;
      }
    }
  }
}
</style>