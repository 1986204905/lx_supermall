<template>
  <div>
      <nav-bar>
          <template v-slot:left>
              <div class="back" @click="back">
                  <img src="~assets/img/common/back.svg" alt="">
              </div>
              
          </template>
          <template v-slot:center>
              <div class="title">
                  <div v-for="(item,index) in title" :key="index"
                    class="title-item"
                    :class="{active: index == currentIndex}"
                    @click="titleClick(index)">
                    {{item}}
              </div>
              </div>
              
          </template>
      </nav-bar>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
export default {
    components: {
        NavBar
    },
    data () {
        return {
            title: ['商品','参数','评论','推荐'],
            currentIndex:0
        }
    },
    methods: {
        titleClick(index) {
            this.currentIndex = index;
            this.$emit('titleClick',index);
        },
        back() {
            this.$router.go(-1)
        }
    }

}
</script>

<style scoped>
    .title {
        display: flex;
        font-size: 13px;

    }

    .title-item {
        flex: 1;
    }

    .active {
        color: var(--color-high-text)
    }

    .back img {
        margin-top: 12px;
    }
</style>