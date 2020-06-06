import Vue from "vue";
import VueRouter from "vue-router";
import layOutView from "@views/home";

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    component: layOutView,
    redirect: "/home/Assets",
    children: [
      {
        path: "/home",
        meta: { title: "所有", type: 2 },
        name: "home",
        children: [
          {
            path: "/home/Assets",
            meta: { title: "首页", type: 2 },
            name: "Assets",
            component: () => import("@/views/home/Assets"),
          },
          {
            path: "/home/recharge",
            meta: { title: "充值", type: 3 },
            name: "recharge",
            component: () => import("@/views/home/Assets/recharge"),
          },
          {
            path: "/home/cashWithdrawal",
            meta: { title: "提现", type: 4 },
            name: "cashWithdrawal",
            component: () => import("@/views/home/Assets/cashWithdrawal"),
          },
          {
            path: "/home/allInformation",
            meta: { title: "全部资讯", type: 3 },
            name: "allInformation",
            component: () => import("@/views/home/Assets/allInformation"),
          },
          {
            path: "/home/informationDetail",
            meta: { title: "资讯详情", type: 4 },
            name: "informationDetail",
            component: () => import("@/views/home/Assets/informationDetail"),
          },
          {
            path: "/home/WithdrawalsRecord",
            meta: { title: "提现记录", type: 5 },
            name: "WithdrawalsRecord",
            component: () => import("@/views/home/Assets/WithdrawalsRecord"),
          },
          {
            path: "/home/Revenue",
            meta: { title: "总收益", type: 4 },
            name: "Revenue",
            component: () => import("@/views/home/Assets/Revenue"),
          },
          {
            path: "/home/detailRevenue",
            meta: { title: "某日收益", type: 4 },
            name: "detailRevenue",
            component: () => import("@/views/home/Assets/detailRevenue"),
          },
          {
            path: "/home/dao",
            meta: { title: "DAO", type: 2 },
            name: "dao",
            component: () => import("@/views/home/dao"),
          },
          {
            path: "/home/mine",
            meta: { title: "我的", type: 2 },
            name: "mine",
            component: () => import("@/views/home/mine"),
          },
          {
            path: "/Financial",
            meta: { title: "理财规则", type: 3 },
            name: "Financial",
            component: () => import("@/views/home/mine/Financial"),
          },
          {
            path: "/myTeam",
            meta: { title: "我的团队", type: 2 },
            name: "myTeam",
            component: () => import("@/views/home/myTeam/index"),
          },
          {
            path: "/myBadge",
            meta: { title: "我的徽章", type: 3 },
            name: "myBadge",
            component: () => import("@/views/home/mine/myBadge/index"),
          },
          {
            path: "/upgrade",
            meta: { title: "升级徽章", type: 4 },
            name: "upgrade",
            component: () => import("@/views/home/mine/myBadge/upgrade"),
          },
          {
            path: "/purchase",
            meta: { title: "购买徽章", type: 4 },
            name: "purchase",
            component: () => import("@/views/home/mine/myBadge/purchase"),
          },
          {
            path: "/history",
            meta: { title: "购买记录", type: 4 },
            name: "history",
            component: () => import("@/views/home/mine/myBadge/history"),
          },
          {
            path: "/InvitationLink",
            meta: { title: "邀请链接", type: 3 },
            name: "InvitationLink",
            component: () => import("@/views/home/mine/InvitationLink/index"),
          },
          {
            path: "/AccountSecurity",
            meta: { title: "账号安全", type: 3 },
            name: "AccountSecurity",
            component: () => import("@/views/home/mine/AccountSecurity/index"),
          },
          {
            path: "/transaction",
            meta: { title: "修改交易密码", type: 4 },
            name: "transaction",
            component: () =>
              import("@/views/home/mine/AccountSecurity/transaction"),
          },
          {
            path: "/editLogin",
            meta: { title: "修改登录密码", type: 4 },
            name: "editLogin",
            component: () =>
              import("@/views/home/mine/AccountSecurity/editLogin"),
          },
          {
            path: "/WalletManagement",
            meta: { title: "钱包管理", type: 3 },
            name: "WalletManagement",
            component: () => import("@/views/home/mine/WalletManagement/index"),
          },
          {
            path: "/BillDetails",
            meta: { title: "账单明细", type: 3 },
            name: "BillDetails",
            component: () => import("@/views/home/mine/BillDetails/index"),
          },
          {
            path: "/ContactCustomerService",
            meta: { title: "联系客服", type: 3 },
            name: "ContactCustomerService",
            component: () =>
              import("@/views/home/mine/ContactCustomerService/index"),
          },
          {
            path: "/remarkWord",
            meta: { title: "助记词备注", type: 3 },
            name: "remarkWord",
            component: () => import("@/views/home/mine/remarkWord/index"),
          },
        ],
        component: () => import("@/views/home"),
      },
    ],
  },

  {
    path: "/activityCenter",
    name: "activityCenter",
    meta: { title: "活动中心", type: 1 },
    component: () => import("@views/activityCenter"),
  },

  {
    path: "/login",
    name: "login",
    meta: { title: "登录", type: 1 },
    component: () => import("@views/user/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    meta: { title: "注册" },
    component: () => import("@views/user/Register.vue"),
  },

  {
    path: "/forgotpwd",
    name: "forgotpwd",
    meta: { title: "忘记密码" },
    component: () => import("@views/user/forgotPwd.vue"),
  },
  { path: "**", redirect: "/" },
];

const router = new VueRouter({
  // mode: 'history',
  routes,
});

// 路由导航守卫，来判断有没有登录
router.beforeEach((to, from, next) => {
  // 判断是不是手机登录
  // if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
  // 登录、注册页面不需要导航首位
  if (
    to.path === "/login" ||
    to.path === "/forgotpwd" ||
    to.path === "/register"
  ) {
    next();
  } else {
    if (localStorage.getItem("isRember") === "true") {
      sessionStorage.clear();
      next();
    } else {
      localStorage.removeItem("Avatar");
      localStorage.removeItem("Team");
      localStorage.removeItem("nick_name");
      next({ path: "/login" });
    }
  }
  // } else {
  // window.location.href = "https://www.baidu.com/";
  // next({ path: "/Step" });

  // }
});
export default router;
