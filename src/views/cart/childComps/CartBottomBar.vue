<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll"
                    class="check-button"
                    @click.native="checkClick">
      </check-button>
      <span>全选</span>
    </div>
    <div class="price">
      合计: {{totalPrince}}
    </div>
    <div class="calculate" @click="calcClick">
      去计算：({{checkLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton';

import {mapGetters} from 'vuex';

  export default {
    name:'CartBottomBar',
    components: {
      CheckButton
    },
    methods: {
      checkClick() {
        if(this.isSelectAll){
          this.cartList.forEach(item => item.checked = false)
        }else {
          this.caartList.forEach(item => item.checked = true)
        }
      },
      calcClick() {
        this.$toast.show('请选择购买的商品',2000)
      }
    },
    computed:{
      totalPrince() {
        return this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue,item) => {
          return preValue + item.price * item.count
        },0).toFixed(2)
      },
      checkLength() {
        return this.$store.state.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        if(this.cartList.length === 0) return false
        //1.使用filter
        // return !(this.$store.state.cartList.filter(item => !item.checked).length)
        //2.使用find
        return !(this.$store.state.cartList.find(item => !item.checked))
      },
      ...mapGetters(['cartList'])
    }

  }

</script>
<style scoped>
    .bottom-bar {
        background-color: #eee;
        height: 40px;
        line-height: 40px;
        display: flex;

        font-size: 14px;
    }

    .check-content {
      display: flex;
      align-items: center;
      width: 60px;
    }

    .check-button {
      /* display: inline-block; */
      width: 22px;
      height: 22px;
      line-height: 22px;
      margin-right: 5px;
      margin-left: 5px;
    }

    .price {
      margin-left: 30px;
      flex: 1;
    }

    .calculate {
      width: 90px;
      background-color: red;
      color: #fff;
      padding-left: 7px;
    }
</style>