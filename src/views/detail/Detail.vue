<template>
    <div id="detail">
        <detail-nav-bar ref="nav" class="detail-nav" @titleClick="titleClick"></detail-nav-bar>
        <scroll class="content" 
                ref="scroll"
                :probeType="3"
                @scroll="contentScroll">
            <detail-swiper :top-images="topImages"></detail-swiper>
            <detail-base-info :goods="goods"></detail-base-info>
            <detail-shop-info :shop="shop"></detail-shop-info>
            <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
            <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
            <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
            <goods-list ref="recommend"  :goods="recommends"></goods-list>
        </scroll>
        <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
        <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

        
    </div>
</template>

<script>
import {itemListenerMixin, BackTopMixin} from 'common/mixin'
import {debounce} from 'common/utils'


import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

// import BackTop from 'components/content/backTop/BackTop'


import Scroll from 'components/common/scroll/Scroll'

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail";

import GoodsList from 'components/content/goods/GoodsList'

import {mapActions} from 'vuex';

export default {
    name: "Detail",
    components: {
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        DetailBottomBar,
        Scroll,
        GoodsList,
    },
    data () {
        return {
            iid:null,
            topImages: [],
            goods: {},
            shop: {},
            detailInfo: {},
            paramInfo: {},
            commentInfo: {},
            recommends: [],
            themeTopYs: [],
            getThemeTopYs: null,
            currentIndex: null
        }
    },
    created () {
        //1.保存传入的iid
        this.iid = this.$route.params.iid

        //2.根据iid请求详情数据
        getDetail(this.iid).then(res => {
            //1.获取顶部的图片轮播数据
            // console.log(res);
            const data = res.result;
            this.topImages = data.itemInfo.topImages;

            //2.获取商品信息
            this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
            // console.log(this.goods)

            //3.创建店铺信息的对象
            this.shop = new Shop(data.shopInfo)

            //4.保存商品的详细数据
            this.detailInfo = data.detailInfo;

            //5.获取参数的信息
            this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

            //6.获取评论信息
            // console.log(data.rate)
            if(data.rate.cRate !== 0) {
                this.commentInfo = data.rate.list[0]
            }
        })

        //3.请求推荐数据
        getRecommend().then(res => {
            // console.log(res.data)
            this.recommends = res.data.list;
        })

        //4.获取导航上的对应位置坐标传入themeTopYs中，加防抖动，减少获取次数
        this.getThemeTopYs = debounce(() => {
                this.themeTopYs = [];

                this.themeTopYs.push(0);
                this.themeTopYs.push(this.$refs.params.$el.offsetTop)
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
                this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
                this.themeTopYs.push(Number.MAX_VALUE)
                // console.log(this.themeTopYs)
            },100)

    },
    mixins:[itemListenerMixin, BackTopMixin],
    methods: {
        ...mapActions(['addCart']),
        imageLoad() {
            //不做防抖，请求次数太多
            // this.$refs.scroll.refresh()
            //防抖函数
            //图片加载后刷新
            this.newRefresh();
            //图片加载后获取导航上的对应位置坐标
            this.getThemeTopYs();

        },
        titleClick(index) {
            //点击导航到达对应位置
            this.$refs.scroll.scrollTo(0, -this.themeTopYs[index],100);
        },
        contentScroll(position) {
            // 判断BackTop是否显示
            this.listenShowBackTop(position);

            const positionY = -position.y;
            // console.log(position.y)

            for(let i=0;i<this.themeTopYs.length-1;i++) {
                if(this.currentIndex !== i && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) {
                this.currentIndex = i;
                    this.$refs.nav.currentIndex = this.currentIndex;
                    // console.log(i)
                }    
            }
        },
        addToCart() {
            // 1.获取购物车需要展示的信息
            const product = {}
            product.image = this.topImages[0];
            product.title = this.goods.title;
            product.desc = this.goods.desc;
            product.price =this.goods.realPrice;
            product.iid = this.iid;

            // 2.将商品添加到购物车里(1.promise2.mapactions)
            // this.$store.commit('addCart', product)

            this.addCart(product).then(res => {
                // console.log(res)
                //添加到购物车成功后显示成功添加信息
                this.$toast.show(res)
            })

            // this.$store.dispatch('addCart', product).then(res => {
            //     console.log(res)
            // })

        }
    },
    mounted () {
  
    },
    destroyed () {
        this.$bus.$off('itemImgLoad',this.itemListenerMixin)
    }
}
</script>

<style scoped>
    #detail {
        position: relative;
        z-index: 10;
        height: 100vh;
        background-color: #fff;
        overflow: hidden;
    }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

    .content {
        height: calc(100% - 44px - 58px);
  }


    
</style>>
