<template>
    <div class="loadBox" v-if='isshowloading'>
        <div class="gif-loading" >
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'loading',
    props: {
        isshowloading: Boolean
    },
    data () {
        return {
        }
    }
}
</script>
<style lang="scss" scoped>
@charset "utf-8";
@import "../assets/scss/usage/layout/reset.scss";

.loadBox{
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    bottom:0;
    z-index: 99;
    margin: 0 auto;
    background: #000;
    opacity: 0.2;
}
.gif-loading
{
    position: fixed;
    z-index: 99999;
    top: 0rem;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width:50px;
    height: 50px;
    background: url(../assets/images/loading.gif) no-repeat center center;
    background-size: 100% 100%;
}
@media(max-width: 640px) {
    .loadBox{
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:#000;
    opacity: 0.2;
}
.gif-loading
{
    position: fixed;
    z-index: 99999;
    top: -3rem;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: .5rem;
    height: .5rem;
    background: url(../assets/images/loading.gif) no-repeat center center;
    background-size: 100% 100%;
}
}
</style>

