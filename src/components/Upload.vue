<template>
  <div class="UPLOAD">
    <van-uploader
      v-model="fileList"
      preview-size="1.08rem"
      :max-count="1"
      :deletable="false"
      :preview-full-image="false"
      :before-read="beforeRead"
      :after-read="afterReadFile"
      upload-text="拍照"
      capture="camera"
      accept="image/png, image/jpeg"
    >
      <div class="image-yellow">
        <van-image
          round
          width="1.08rem"
          height="1.08rem"
          :src="fileList[0] ? fileList[0].content : 'https://img.yzcdn.cn/vant/cat.jpeg'"
        />
      </div>
    </van-uploader>
    <p>{{$t('点击上传头像')}}</p>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      fileList: []
    };
  },
  methods: {
    beforeRead(file) {
      console.log(file);
      if (file.type !== "image/jpeg") {
        Toast("请上传 jpg 格式图片");
        return false;
      }
      return true;
    },
    // 返回 Promise
    asyncBeforeRead(file) {
      return new Promise((resolve, reject) => {
        if (file.type !== "image/jpeg") {
          Toast("请上传 jpg 格式图片");
          reject();
        } else {
          resolve();
        }
      });
    },
    //图片读取后函数
    afterReadFile(res) {
      console.log(res);
      console.log(this.fileList);
    }
  },
  created() {}
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.UPLOAD {
  .image-yellow,
  .van-uploader__preview {
    width: 1.24rem;
    height: 1.24rem;
    background: rgba(254, 228, 73, 0.42);
    border: 2px solid rgba(254, 228, 73, 0.42);
    border-radius: 50%;
    margin: 0;
    .van-image {
      border: 2px solid #fff;
      margin: 2px;
      border-radius: 50% !important;
    }
  }
  p {
    font-size: 0.24rem;
    color: #999;
  }
}
</style>
