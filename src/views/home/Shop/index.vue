<template>
  <div class="shop">
    <div class="shop-index">
      <div class="banner"></div>
      <div class="list">
        <div :key="index" class="li" v-for="(item,index) in List">
          <img :src="item.img" alt />
          <div class="content">
            <p>{{item.title}}</p>
            <p class="NOG">NOG {{item.NOG}}</p>
            <p class="USDT">≈{{item.USDT}} USDT</p>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed">{{$t('敬请期待')}}</div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data () {
    return {
      List: [
        {
          img: require("../../../../static/img/shop.jpg"),
          title:
            "壹号本ONEMIX 3Pro锦鲤限量版酷睿十代8.4英寸 红色 16G+512G迷你口袋本平板电脑二合一超薄本笔记本电脑",
          NOG: "1234564",
          USDT: "12343412"
        },
        {
          img: require("../../../../static/img/shop.jpg"),
          title:
            "壹号本ONEMIX 3Pro锦鲤限量版酷睿十代8.4英寸 红色 16G+512G迷你口袋本平板电脑二合一超薄本笔记本电脑",
          NOG: "1234564",
          USDT: "12343412"
        },
        {
          img: require("../../../../static/img/shop.jpg"),
          title:
            "壹号本ONEMIX 3Pro锦鲤限量版酷睿十代8.4英寸 红色 16G+512G迷你口袋本平板电脑二合一超薄本笔记本电脑",
          NOG: "1234564",
          USDT: "12343412"
        },
        {
          img: require("../../../../static/img/shop.jpg"),
          title:
            "壹号本ONEMIX 3Pro锦鲤限量版酷睿十代8.4英寸 红色 16G+512G迷你口袋本平板电脑二合一超薄本笔记本电脑",
          NOG: "1234564",
          USDT: "12343412"
        },
        {
          img: require("../../../../static/img/shop.jpg"),
          title:
            "壹号本ONEMIX 3Pro锦鲤限量版酷睿十代8.4英寸 红色 16G+512G迷你口袋本平板电脑二合一超薄本笔记本电脑",
          NOG: "1234564",
          USDT: "12343412"
        }
      ]
    };
  },
  methods: {}
};
</script>

<style lang="less" scoped>
@import '../../../style/mixin.less';
.shop {
  height: 100%;
  .shop-index {
    height: 100%;
    .banner {
      width: 100%;
      height: 4.36rem;
      .bg-image('../../../../static/img/banner');
      background-repeat: no-repeat;
      background-size: contain;
    }
    .list {
      .li {
        width: 50%;
        float: left;
        background: #f7f7f7;
        box-sizing: border-box;
        border-bottom: 2px solid #000;
        &:nth-of-type(odd) {
          border-right: 2px solid #000;
        }
        img {
          width: 100%;
        }
        .content {
          p {
            width: 90%;
            margin: 0 auto;
            text-align: left;
            &:first-of-type {
              font-size: 0.3rem;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }
          .NOG {
            color: #f00;
            font-size: 0.3rem;
            margin-top: 0.1rem;
          }
          .USDT {
            font-size: 0.24rem;
            color: #999;
            line-height: 0.3rem;
            margin-bottom: 0.1rem;
          }
        }
      }
    }
  }
  .fixed {
    width: 100%;
    height: calc(100vh - 1rem);
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    font-size: 0.8rem;
    color: #ffe348;
    line-height: calc(100vh - 1rem);
  }
}
</style>