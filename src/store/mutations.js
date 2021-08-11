export default {
  // addCart(state, payload) {
  //   const oldInfo = state.cartList.find(item => item.iid === payload.iid)

  //   // 2.+1或者新添加
  //   if (oldInfo) {
  //     oldInfo.count += 1
  //   } else {
  //     payload.count = 1
  //     payload.checked = true
  //     state.cartList.push(payload)
  //   }
  // }
  addCounter(state, payload) {
    payload.count++;
  },
  subCounter(state, payload) {
    if(payload.count>1){
      payload.count--;
    }else{
      payload.count = 1;
    }
  },
  addToCart(state, payload) {
    state.cartList.push(payload)
  },
  removeToCart(state, payload) {
    state.cartList.splice(payload, 1)
  }
}