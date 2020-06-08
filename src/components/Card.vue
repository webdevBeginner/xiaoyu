<template>
  <div>
    <div :key="index" class="card" v-for="(item,index) in List">
      <div class="title">
        <span>{{get_chickens(item.coin_type_id,'coinKeyType').name}}</span>
        <span>{{item.direction ? '+' : '-'}}{{item.amount_double}}</span>
      </div>
      <div class="address">{{item.trans_address}}</div>
      <div class="bottom">
        <p class="date">{{item.create_date | formate}}</p>
        <p class="status">{{$t(get_chickens(item.details_status,'statusList').name)}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formateDate } from "@/utils/date";
export default {
  data () {
    return {};
  },
  filters: {
    formate (time) {
      let date = new Date(time);
      return formateDate(date, "YYYY-MM-dd hh:mm");
    }
  },
  computed: {
    ...mapGetters(["get_chickens"])
  },
  props: ["List"]
};
</script>

<style lang="less" scoped>
.card {
  width: 100%;
  //   height: 3.08rem;
  background: #fff;
  border-radius: 0.2rem;
  color: #101010;
  padding: 0.38rem 0.38rem 0;
  box-sizing: border-box;
  font-weight: normal;
  margin-bottom: 0.3rem;
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 0.3rem;
    margin-bottom: 0.3rem;
    span {
      &:last-of-type {
        font-size: 0.36rem;
        color: #ef314b;
      }
    }
  }
  .address {
    font-size: 0.3rem;
    line-height: 0.5rem;
    text-align: left;
    word-break: break-all;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    line-height: 0.9rem;
    color: #666666;
    font-size: 0.24rem;
    p {
      margin: 0;
    }
  }
}
</style>