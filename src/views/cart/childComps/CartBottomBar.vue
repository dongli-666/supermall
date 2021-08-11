<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll" 
      class="check-button"
      @click.native="checkClick"
      ></check-button>
      <span>全选</span>
    </div>

    <div class="price">
      合计：{{totalPrice}}
    </div>

    <div class="caculate">
      <div class="cal_content">
        提交订单({{checkLength}})
      </div>
    </div>
  </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  props: {},
  data() {
    return {
      
    };
  },
  computed: {
    totalPrice() {
      return '￥' + this.$store.state.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return item.price * item.count + preValue
      }, 0).toFixed(2)
    },
    checkLength() {
        return this.$store.state.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return  item.count + preValue
      }, 0)
    },
    isSelectAll() {
      if (this.$store.state.cartList.length === 0) return false;
      // return !(this.$store.state.cartList.filter(item => !item.checked).length)
      return !this.$store.state.cartList.find(item => !item.checked);
    }
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) { //全部选中
        this.$store.state.cartList.forEach(item => item.checked = false)
      } else { //全部不选中
        this.$store.state.cartList.forEach(item => item.checked = true)
      }
    }
  },
};
</script>
<style scoped>
  .bottom-bar {
    position: relative;
    height: 44px;
    background-color: #eee;
    display: flex;
    align-items: center;
  }
  .check-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 40px;
    width: 70px;
  }
  .check-button {
    width: 22px;
    height: 22px;
    line-height: 22px;
    margin-left: 10px;
    margin-right: 5px;
  }
  .price {
    margin-left: 30px;
    flex: 1;
  }
  .caculate {
    height: 100%;
    width: 110px;
    background: rgb(252, 62, 78);
    color: #fff;
    display: flex;
    align-items: center;
  }
  .cal_content {
    margin: 0 auto;
  }
  .price{
    color: orangered;
  }
</style>