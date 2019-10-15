<template>
  <div class="toast" v-show="isShow">
    {{message}}
  </div>
</template>

<script>

  export default {
    name:'Toast',
    data() {
        return {
            isShow: false,
            message: ''
        }
    },
    methods: {
        show(message='默认文字', duration=2000) {
            // duration = duration || 2000
            // console.log('---');

            this.isShow = true;
            this.message = message;

            setTimeout(() => {
                this.isShow = false;
                this.message = ''
            },duration)
        }
    }

  }

</script>
<style scoped>
    .toast {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        padding: 0px 10px;

        z-index: 999;

        color: #fff;
        background-color: rgba(0,0,0,.75);
        height: 50px;
        line-height: 50px;
    }
</style>