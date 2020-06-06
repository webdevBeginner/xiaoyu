import { markList } from '@utils/markList'

export const state = {
    chickens: markList,
    LOADING: false,
    UPDATE: false,
    lockPhone: false,
    news_list: [],
    now_id: 0,
    money: 0,
    badgeList: [],
    
    activityListShowPop : false, // 活动中心弹窗显示状态
    activityListComponentName : "" // 活动中心弹窗内容模板
}


export const getters = {
    // 根据具体的码表获取对应的中文
    get_chickens: state => (key, name) => {
        let keys = {}
        if (!state['chickens'][name]) {
            keys.name = key
        } else {
            keys.name = state['chickens'][name].find(_ => _.key === key).value
            keys.class = state['chickens'][name].find(_ => _.key === key).class ? state['chickens'][name].find(_ => _.key === key).class : ''
            keys.class_name = state['chickens'][name].find(_ => _.key === key).class_name ? state['chickens'][name].find(_ => _.key === key).class_name : ''
        }
        return keys
    },

    get_activityListShowPop: state => {
        return state.activityListShowPop;
    },

    get_activityListComponentName: state => {
        return state.activityListComponentName || "";
    }
}

export const mutations = {
    //get chicken
    setChickens(state, obj) {
        state.chickens = obj;
    },
    showLoading(state) {
        state.LOADING = true
    },
    hideLoading(state) {
        state.LOADING = false
    },
    showUpdate(state, val) {
        state.UPDATE = val
    },
    showPhone(state, val) {
        state.lockPhone = val
    },
    get_news_list(state, val) {
        state.news_list = val
    },
    get_now_id(state, val) {
        state.now_id = val
    },
    get_now_money(state, val) {
        state.money = val
    },
    get_badge_list(state, val) {
        state.badgeList = val
    },
    get_activityListShowPop(state, val) {
        state.activityListShowPop = val
    },
    get_activityListComponentName(state, val) {
        state.activityListComponentName = val
    }
}


export const actions = {
    //     //获取码表
    //     async getChickens({ commit }) {
    //         debugger
    //         let chickens = JSON.parse(sessionStorage.getItem('cks_'))
    //         if (chickens) {
    //             commit('setChickens', chickens)
    //         } else {
    //             let res = markList
    //             if (res) {
    //                 sessionStorage.setItem('cks_', JSON.stringify(res))
    //                 commit('setChickens', res)
    //             }
    //         }
    //     },
}