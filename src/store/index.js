import Vue from 'vue'
import Vuex from 'vuex'

// Modules

import User from './User/index'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
  User
  },
  strict: process.env.DEV,
})