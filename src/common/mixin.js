import {debounce} from './utils';
import BackTop from 'components/content/backTop/BackTop'


export const itemListenerMixin = {
    data () {
        return {
            itemImgListener: null,
            newRefresh: null            
        }
    },
    mounted() {
        this.newRefresh = debounce(this.$refs.scroll.refresh,100)
        this.itemImgListener = () => {
            this.newRefresh()
        }
        this.$bus.$on('itemImgLoad',this.itemImgListener)
        // console.log('我是混入中的内容');
    }
}

//BackTop,点击返回原点0
export const BackTopMixin = {
    components: {
        BackTop
    },
    data () {
        return {
            isShowBackTop:false
        }
    },
    methods: {
        backClick() {
            this.$refs.scroll.scrollTo(0,0)
        },
        listenShowBackTop(position) {
            // 判断BackTop是否显示
            this.isShowBackTop=(-position.y)>1000;
        }
    }
}