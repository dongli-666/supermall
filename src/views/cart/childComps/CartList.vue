<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <van-empty
        class="custom-image"
        :image="image"
        description="购物车空了!"
        v-if="this.$store.state.cartList.length === 0"
      />
      <cart-list-item v-for="(item,index) in CartList" :key="index" :item-info="item" :index-info="index" v-else></cart-list-item>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll.vue'
import CartListItem from './CartListItem.vue'
import img from '../../../assets/img/cart/empty.png'

export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem
  },
  props: {},
  data() {
    return {
      itemInfo:[],
      indexInfo:[],
      image: img
    };
  },
  computed: {
    CartList() {
      return this.$store.state.cartList
    }
  },
  activated() {
    this.$refs.scroll.refresh()
  },
};
</script>
<style scope="">
.cart-list{
  height: calc(100% - 44px - 49px - 44px);
  /* overflow: hidden; */
  /* height: 100%; */
}
.cart-list .wrapper{
  height: calc(100% - 44px - 49px - 44px);
  overflow: hidden;
  /* bottom: 49px; */
}
.custom-image .van-empty__description{
  font-size: 18px !important;
}
</style>