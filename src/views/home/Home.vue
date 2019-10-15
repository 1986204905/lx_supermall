<template>
    <div id="home">
      <nav-bar class="home-nav">
        <template v-slot:center>
          购物街
        </template> 
      </nav-bar>
      <tab-control class="tab-control"
                  :titles="['流行','新款','精选']"
                  @tabClick="tabClick"
                  v-show="isTabFixed"
                  ref="tabControl1">
        </tab-control>
      <scroll class="content"
              ref="scroll"
              :probe-type="3"
              @scroll="contentScroll"
              :pull-up-load="true"
              @pullingUp="loadMore">
        <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
        <recommend-view :recommends="recommends"/>
        <feature-view></feature-view>
        <tab-control :titles="['流行','新款','精选']"
                      @tabClick="tabClick"
                      ref="tabControl2">
        </tab-control>
        <goods-list :goods="showGoods"></goods-list>
      </scroll>
      <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    </div>
    
</template>

<script>
import { getHomeMultidata, getHomeGoods } from "network/home";


import NavBar from 'components/common/navbar/NavBar';
import TabControl from 'components/content/tabControl/TabControl';
import GoodsList from 'components/content/goods/GoodsList';
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import HomeSwiper from './childComps/HomeSwiper';
import RecommendView from './childComps/RecommendView';
import FeatureView from './childComps/FeatureView';

import {debounce} from 'common/utils'
import {itemListenerMixin} from 'common/mixin'

  export default {
    name: "Home",
    components: {
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop,
      HomeSwiper,
      RecommendView,
      FeatureView
    },
    mixins:[itemListenerMixin],    
    data () {
      return {
        banners:[],
        recommends:[],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        isShowBackTop:false,
        isTabFixed:false,
        tabOffsetTop:0,
        saveY: 0,
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    activated() {
      this.$refs.scroll.scrollTo(0,this.saveY,0);
      this.$refs.scroll.refresh()
    },
    deactivated() {
      //1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY()

      //2.取消全局事件是的监听
      this.$bus.$off('itemImgLoad',this.itemListenerMixin)
    },
    created () {
      // 1.请求多个数据
      this.getHomeMultidata();
      
      //2.请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    mounted() {

      // 1.图片加载完成的事件监听
      let refresh = debounce(this.$refs.scroll.refresh, 50);
      this.sy=function(){
        refresh()
      }
      this.$bus.$on('itemImageLoad',this.sy)
      
      // let newRefresh = debounce(this.$refs.scroll.refresh,50);
      //   this.itemImgListener = () => {
      //       newRefresh()
      //   }
      //   this.$bus.$on('itemImgLoad',this.itemImgListener);

      },
    methods: {   
      /**
       * 事件监听相关的方法
       */
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType = 'pop';
            break;
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex=index;
        this.$refs.tabControl2.currentIndex=index;
      },
      backClick() {
          this.$refs.scroll.scrollTo(0,0)
      },
      contentScroll(position) {
        // 1.判断BackTop是否显示
          this.isShowBackTop=(-position.y)>1000

        // 2.决定tabControl是否吸顶(position: fixed)
          this.isTabFixed = (-position.y)>this.tabOffsetTop
      },
      loadMore() {
          this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
       /**
       * 网络请求相关的方法
       */
      getHomeMultidata() {
          getHomeMultidata().then(res=>{
            // console.log(res)
            // this.result=res;
            this.banners=res.data.banner.list;
            this.recommends=res.data.recommend.list;
          })   
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          // console.log(res.data.list)
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;

          this.$refs.scroll.finishPullUp()
        })
      }      
    }
  }
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: pink;
    color: #fff;
    /*在使用浏览器原生滚动时, 为了让导航不跟随一起滚动*/
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }

  /* 不使用better-scrooll局部滚动可以使其置顶 */
  /* .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  } */

  .tab-control {
    position: relative;
    z-index: 9;

  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
    /*.content {*/
    /*height: calc(100% - 93px);*/
    /*overflow: hidden;*/
    /*margin-top: 44px;*/
  /*}*/
</style>
