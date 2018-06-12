import { Vue, Common, VueRouter, Init } from 'js/base'
import './scss/rushPurchaseGood.scss'
import rushPurchaseGood from './rushPurchaseGood.vue'
import goods from './components/good.vue'

const router = new VueRouter({
    routes:[
        {path: '/', redirect: ''},
        {
            path:'',
            component:goods,
            name:'goods'
        }
    ]
})

var app = new Vue({
    el: '#rushPurchaseGood',
    router,
    data () {
        return {
            footer: {
                isShow1: false
            }
        }
    },
    template: '<rushPurchaseGood/>',
    components: { rushPurchaseGood }
})
