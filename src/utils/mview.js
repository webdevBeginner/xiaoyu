import Vue from "vue";
import router from "../router";
Vue.filter("string23", function(value) {
  //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
  value = value.substring(0, 23);
  return value;
});

Vue.filter("string19", function(value) {
  //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
  value = value.substring(0, 19);
  return value;
});

Vue.filter("string10", function(value) {
  //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
  if (value && value.length > 10) {
    value = value.substring(0, 10) + "...";
  }
  return value;
});

Vue.filter("laststring8", function(value) {
  //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
  if (value && value.length > 8) {
    value = value.substring(value.length - 8, value.length);
  }

  return value;
});

var mview = {
  socket_url: `ws://${process.env.VUE_APP_BASEURL}/hgfAppServer/websocket/socketServer.do`,
  stream_url: "http://backup:20212",
  rootPath: window.location.href,
  token: null,
  //GUID生成
  guid: function() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  },
  //通信协议
  socket: {
    listen: null,
    isopen: false,
    waits: new Map(),
    activeguid: "",
    //销毁
    remove: function(guid) {
      mview.socket.waits.delete(guid);
    },
    //发送
    send: function(data) {
      var guid = mview.guid();
      mview.socket.activeguid = guid;
      var param = JSON.stringify({
        token: mview.token,
        identifier: guid,
        params: data.data,
      });
      var tcou = 0;
      //打开计时器
      var interval = setInterval(function() {
        //进行重试计数
        if (tcou++ > 50) {
          window.clearInterval(interval);
          throw "链接等待超时";
        }
        //链接是否打开
        if (mview.socket.isopen == false) {
          return;
        }
        //发送并记录
        mview.socket.listen.send(param);
        mview.socket.waits.set(guid, data);
        window.clearInterval(interval);
      }, 100);
    },
    init: function() {
      //创建监听
      mview.socket.listen = new WebSocket(mview.socket_url);
      // 打开socket通信
      mview.socket.listen.onopen = function() {
        mview.socket.isopen = true;
        console.log("此时连接已经创建。。。");
      };
      // 监听关闭
      mview.socket.listen.onclose = function() {
        mview.socket.isopen = false;
        //重新初始化
        setTimeout(function() {
          mview.socket.init();
        }, 1500);
      };
      mview.socket.listen.onerror = function() {
        // router.push({ path: "/login" })
        // localStorage.removeItem("isRember");
        // localStorage.removeItem("Avatar");
        // localStorage.removeItem("Team");
        // localStorage.removeItem("nick_name");
      };
      mview.socket.listen.onmessage = function(evt) {
        var json = JSON.parse(evt.data);
        switch (json.Data.Code) {
          case "1001":
            json.Data.Message = "用户不存在";
            break;
          case "1002":
            json.Data.Message = "用户已存在";
            break;
          case "1003":
            localStorage.setItem("isRember", "");
            router.push({ path: "/login" });
            json.Data.Message = "账号未登录";
            break;
          case "1004":
            json.Data.Message = "账号或密码错误";
            break;
          case "1005":
            json.Data.Message = "账号被禁用，请联系管理员";
            break;
          case "1006":
            json.Data.Message = "交易密码错误";
            break;
          case "1007":
            json.Data.Message = "旧密码输入错误";
            break;
          case "1008":
            json.Data.Message = "必需提供TOKEN";
            break;
          case "1009":
            json.Data.Message = "Method不存在";
            break;
          case "2001":
            json.Data.Message = "验证码错误";
            break;
          case "2002":
            json.Data.Message = "验证码发送失败";
            break;
          case "2003":
            json.Data.Message = "邀请码无效";
            break;
          case "2004":
            json.Data.Message = "两次密码输入不一致";
            break;
          case "2005":
            json.Data.Message = "不能修改其他账号的交易密码";
            break;
          case "3001":
            json.Data.Message = "创建钱包失败，请联系管理员";
            break;
          case "4001":
            json.Data.Message = "未绑定提币地址，跳转到钱包管理页面";
            break;
          case "4002":
            json.Data.Message = "兑换数量大于余额，请重新输入";
            break;
          case "4003":
            json.Data.Message = "提现数量大于余额，请重新输入";
            break;
          case "4004":
            json.Data.Message = "提币开关已关闭，请联系管理员";
            break;
          case "4005":
            json.Data.Message = "系统设置出现问题，请联系管理员";
            break;
          case "4006":
            json.Data.Message = "今日提币次数已超限";
            break;
          case "4007":
            json.Data.Message = "交易数量不能大于交易最大值，请重新输入";
            break;
          case "4008":
            json.Data.Message = "交易数量不能小于交易最小值，请重新输入";
            break;
          case "4009":
            json.Data.Message = "该产品已下架，无法兑换";
            break;
          case "4010":
            json.Data.Message = "账户余额不足，无法兑换";
            break;
          case "4011":
            json.Data.Message = "账户余额不足，无法存入";
            break;
          case "4012":
            json.Data.Message = "银行余额不足，无法取出";
            break;
          case "4013":
            json.Data.Message = "交易额度必须大于等于1";
            break;
          case "4014":
            json.Data.Message = "余额为0时，最小存入额度为300U";
            break;
          case "4015":
            json.Data.Message =
              "本次提现USDT产生的手续费大于BCG可用余额，请重新输入";
            break;
          case "4016":
            json.Data.Message = "本次兑换数量大于账户可用余额，请重新输入";
            break;
          case "4017":
            json.Data.Message = "ONG账户余额不足,无法兑换";
            break;
          case "4018":
            json.Data.Message = "购买星云记录查询错误，请联系管理员";
            break;
          case "4022":
            json.Data.Message = "当前账号无提币权限。";
            break;
          case "4023":
            json.Data.Message = "系统版本不匹配 ";
            break;
          case "4024":
            json.Data.Message = "已经购买过矿机了 ";
            break;
          case "4025":
            json.Data.Message = "充值地址冲突! ";
            break;
          case "4026":
            json.Data.Message = "购买矿机数量不得小于1";
            break;
          default:
            json.Data.Message;
        }
        //获取包数据
        var pack = mview.socket.waits.get(json.IDentifier);
        //如果是主动调用方法
        if (pack != null && pack != undefined) {
          //如果有状态码 且 是系统状态码
          if (
            json.Data &&
            (json.Data.Code == -30001 ||
              json.Data.Code == -30002 ||
              json.Data.Code == -30003 ||
              json.Data.Code == -30099)
          ) {
            if (pack.error) {
              pack.error(json.Data.Message, json.IDentifier);
            }
            return;
          } else {
            pack.success(json.Data, json.IDentifier);
          }
          mview.socket.waits.delete(json.IDentifier);
        }
        //如果是被动调用方法
        else {
          mview.socket.onpush(json);
        }
      };
    },
    //当推送消息发生
    onpush: function() {
      //如果页面有自定义推送
      // var fexec = false;
      // if (mview.view.pagedata && mview.view.pagedata.onpush) {
      //     fexec = mview.view.pagedata.onpush(data);
      //     if (fexec == undefined) {
      //         fexec = false;
      //     }
      // }
      // //如果没有页面级调用 或者 页面级忽略
      // if (fexec == false) {
      //     //如果是点对点消息推送
      //     if (data.DataType == "FRIEND_MESSAGE") {
      //         mview.control.tips("[" + data.Content.sendid + "]" + mview.custom.messageanalyze(data.Content), 3000);
      //     }
      // }
    },
  },

  // mview 初始化 , 整个项目的入口
  init: function() {
    //这里读取并创建用户Token
    if (localStorage.getItem("token") == null) {
      localStorage.setItem("token", mview.guid());
    }
    mview.token = localStorage.getItem("token");
    mview.socket.init();
  },
};
mview.init();

export default mview;
