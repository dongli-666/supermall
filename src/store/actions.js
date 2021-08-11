export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      // 1.查找之前数组中是否有该商品
      const oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      // 2.+1或者新添加
      if (oldProduct) {   //购物车商品数量加一
        // oldProduct.count += 1
        context.commit('addCounter', oldProduct)
        resolve(false)
      } else {      //商品类型添加到购物车
        payload.count = 1
        payload.checked = true
        // context.state.cartList.push(payload)
        context.commit('addToCart', payload)
        resolve(true)
      }
    })
  },
  removeCart(context, payload) {
    context.commit('removeToCart', payload)
  }
}