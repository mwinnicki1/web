import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const types = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
}

const state = {
  logged: localStorage.getItem('token')
}

const getters = {
  isLogged: state => state.logged
}

const actions = {
  login({ commit }, credential) {
    localStorage.setItem('token', credential.email);
    commit(types.LOGIN);
  },

  logout({ commit }) {
    localStorage.removeItem('token');
    commit(types.LOGOUT);
  }
}

const mutations = {
  [types.LOGIN](state) {
    state.logged = 1;
  },

  [types.LOGOUT](state) {
    state.logged = 0;
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})