<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @itemClick="itemClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <good-list ref="recommend" :goods="recommends"></good-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>

    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar.vue'
import DetailSwiper from './childComps/DetailSwiper.vue'
import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
import DetailShopInfo from './childComps/DetailShopInfo.vue'
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
import DetailParamInfo from './childComps/DetailParamInfo.vue'
import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
import DetailBottomBar from './childComps/DetailBottomBar.vue'
import GoodList from 'components/content/goods/GoodList.vue' //商品展示组件

import Scroll from 'components/common/scroll/Scroll.vue'

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail"
import {debounce} from "components/common/utils"
import {backTopMnxin} from "common/mixin"
import BackTop from 'components/content/backTop/BackTop.vue'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodList,
    DetailBottomBar,
    BackTop
  },
  mixins: [backTopMnxin], //混入回到顶部组件
  props: {},
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs:[],    //储存对应区块的高度
      getThemeTopY: null,
      currentIndex: 0,
    };
  },
  created() {
    //1.保存传入的iid
    this.iid = this.$route.params.iid
    //2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // 1.获取顶部轮播数据
      const data = res.result;
      this.topImages = res.result.itemInfo.topImages
    
      // 2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
    
      // 3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)

      // 4.保存商品的详情页数据
      this.detailInfo = data.detailInfo

      // 5.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
    
      // 6.取出评论信息
      if (data.rate.cRate !==0) {
        this.commentInfo = data.rate.list[0]
      }
      // 7.获取各板块的offsetTop值
      this.$nextTick(() => { //等前面步骤完成后再调用此函数
        // 根据最新的数据，对应的DOM已经被渲染出来，但是图片依然是没有加载完成
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      })
    })
    //3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })
    //4.给getThemeTopY赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);  //添加一个无穷大值，便于确定区间
    },100)
  },
  mounted() {
    // let newRefresh = debounce(this.$refs.scroll.refresh, 200)
    // this.$bus.$on('detailItemImgLoad', () => {
    //   newRefresh()
    // })
  },
  methods: {
    //4.监听详情的图片加载完成
    detailImageLoad() {
      let newRefresh = debounce(this.$refs.scroll.refresh, 100)
      // this.$refs.scroll.refresh()
      newRefresh();
      this.getThemeTopY(); //图片加载完成，调用获取模块高度函数
    },
    itemClick(index) {  //顶部tab栏点击事件，跳转到相应区域
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500)
    },
    contentScroll(position) { //监听滚动事件
      // 1.获取y值
      const positionY = -position.y;
      // 2.positionY与主题中值进行对比
      this.themeTopYs.forEach((item,i) => {
        if(positionY > item && positionY< this.themeTopYs[i+1]){
          if(this.currentIndex !== i) {
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
      });

      // for(let [index,item] of this.themeTopYs) {

      //   if(positionY > i && positionY< this.themeTopYs[index+1]){

      //   }
      // }

      this.isShowBackTop = -position.y > 1000  //判断BackTop是否显示
    },
    addToCart() {
      // 1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.nowPrice;
      product.iid =  this.iid;

      // 2.将商品添加到购物车里
      // this.$store.cartList.push(product)
      // this.$store.commit('addCart', product)
      this.$toast.setDefaultOptions({ duration: 1500 });
      this.$store.dispatch('addCart', product)
      .then(res => {
        if(res) {
          this.$toast.success('加入购物车成功！');
        }else {
          this.$toast.success('该商品数量+1')
        }
      })
    }
  },
};
</script>
<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .content {
    height: calc(100% - 44px - 49px);
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>