<template>
  <div id="home">
    <nav-bar  class="home_nav">
      <div slot="center">购物街</div>
    </nav-bar>
    
    <tab-control class="tab-control-hide" 
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isTabFixed"
    />

    <scroll class="content" ref="scroll" 
    :probe-type="3" 
    :pull-up-load="true" 
    @scroll="contentScroll"
    @pullingUp="loadMore">
      <!-- 轮播图 -->
      <swiper>
        <swiper-item v-for="(item, id) in banners" :key="id">
          <a :href="item.link">
            <img :src="item.image" alt="" @load="imageLoad">
          </a>
        </swiper-item>
      </swiper>
      <!-- 导航栏 -->
      <recommend-view :recommends="recommends"/>

      <!-- 本周流行 -->
      <feature-view></feature-view>

      <!-- 分区栏 -->
      <tab-control class="tab-control" 
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl2"/>

      <!-- 商品展示区 -->
      <good-list :goods="showGoods"></good-list>
    </scroll>

    <!-- 回到顶部组件 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import {Swiper, SwiperItem} from 'components/common/swiper'
import RecommendView from './childComps/HomeRecommendView.vue'
import FeatureView from './childComps/Feature.vue'
import TabControl from 'components/content/tabControl/tabControl.vue'  //分区选择顶部指引可选择栏
import GoodList from 'components/content/goods/GoodList.vue' //商品展示组件
import Scroll from 'components/common/scroll/Scroll.vue'

import {getHomeMultidata,getHomeGoods} from 'network/home'
import BackTop from 'components/content/backTop/BackTop'
import {debounce} from "components/common/utils"

export default {
  name:"Home",
  components: {
    NavBar,
    Swiper,
    SwiperItem,
    RecommendView,
    FeatureView,
    TabControl,
    GoodList,
    Scroll,
    BackTop,
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop' : {page:0,list: []},
        'new': {page:0,list: []},
        'sell': {page:0,list: []},
      },
      currentType: 'pop',   //记录商品切换栏类型
      isShowBackTop: false,
      tabOffsetTop: 0,
      isLoad: false,
      isTabFixed: false,
      saveY: 0
    }
  },
  created() {
    //1.请求多个数据
    this.getHomeMultidata()

    //2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },

  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 200)
    //3.监听item中图片加载完成
    this.$bus.$on('itemImageLoad', () => {
      // this.$refs.scroll.scroll.refresh()
      // this.scroll && this.$refs.scroll.refresh()
      refresh()
    })
    
    //计算吸顶效果tab栏高度，赋值
    //所有的组件都有一个属性$el：用于获取组件中的元素
    // console.log(this.$refs.tabControl.$el.offsetTop);
  }, 
  activated() { //离开home回到原位
    this.$refs.scroll.scrollTo(0, this.saveY, 100);
    this.$refs.scroll.refresh()
  },
  deactivated() {
    //记录位置
    this.saveY = this.getCurrentY();
  },

  computed: {
    showGoods(){    //根据currentType展示不同分区的商品
      return this.goods[this.currentType].list;
    }
  },
  methods: {
    //网络请求方法
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        // this.result = res;
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    },
    getHomeGoods(type){
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        // console.log(res);
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp()
      })
    },
    //事件监听方法
    backClick() {    //回到顶部
      this.$refs.scroll.scrollTo(0, 0);
    },

    contentScroll(position) { //动态监听回到顶部按钮是否隐藏
      this.isShowBackTop = -position.y > 1000  //判断BackTop是否显示

      this.isTabFixed = (-position.y) > this.tabOffsetTop   //决定tabControl是否吸顶（position：fixed）
    },

    imageLoad() {   
      if(!this.isLoad) {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
        this.isLoad = true
      }
    },
    getCurrentY() {
      //获取当前滚动位置
      return this.$refs.scroll.scroll.y
    },
    // loadMore(){
    //   this.getHomeGoods(this.currentType);

    //   this.$refs.scroll.scroll.refresh(); //刷新防止卡顿
    // },
    //商品方法
    tabClick(index){
      switch(index) {
        case 0:
          this.currentType = 'pop';
          break;
        case 1:
          this.currentType = 'new';
          break;
        case 2:
          this.currentType = 'sell';
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
      this.$refs.scroll.scrollTo(0, -this.$refs.tabControl2.$el.offsetTop);
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    }
  },
};
</script>
<style>
  /* 顶部导航栏 */
  #home{
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
}

  .home_nav{
    background-color: var(--color-tint);
    color: #fff;

    
    /* position:fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }
  /* 分区栏 */
  .tab-control {
    /* position: sticky; */
    top: 44px;
    z-index: 9;
  }

  .wrapper {
    height: calc(100% - 93px);
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .fixed {
    position: fixed;
    left: 0;
    right: 0;
    top: 44px;
  }

  .tab-control-hide {
    position: relative;
    z-index: 9;
    top: -1px;
  }
</style>