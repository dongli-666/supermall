<template>
  <div class="goods">
    <goods-list-item v-for="item in goods" :key="item.title" :goods-item='item'></goods-list-item>
    <!-- {{goods}} -->
  </div>
</template>

<script>
import GoodsListItem from './GoodsListItem.vue'

export default {
  name: "GoodList",
  components: {
    GoodsListItem
  },
  props: {
    goods: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    };
  },
};
</script>
<style scoped>
.goods{
  display: flex;
  /* flex-direction: column; */
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 2px;
}
</style>