import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
    setWithExpiry(state, { key, object }) {
      const now = new Date()
      const item = {
        value: object,
        expiry: now.getTime() + 1000*60*60,
      }
      localStorage.setItem(key, JSON.stringify(item))
    },
    getWithExpiry(state, key) {
      console.log(key);
      var itemStr = localStorage.getItem(key)
      if (!itemStr) {
        console.log("herere");
        return null
      }
      console.log("herere2");
      
      var item = JSON.parse(itemStr)
      var now = new Date()
      if (now.getTime() > item.expiry) {
        console.log("herere3");
        localStorage.removeItem(key)
        return null
      }
      console.log(item.value);
      return [state,item.value]
    }
  },
  getters: {
    getCred(key){
      console.log(key);
      var itemStr = localStorage.getItem(key)
      if (!itemStr) {
        console.log("herere");
        return null
      }
      console.log("herere2");
      
      var item = JSON.parse(itemStr)
      var now = new Date()
      if (now.getTime() > item.expiry) {
        console.log("herere3");
        localStorage.removeItem(key)
        return null
      }
      console.log(item.value);
      return item.value
    }
  },
  modules: {
  }
})
