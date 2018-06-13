import { Vue, Common, VueRouter, Init } from 'js/base'
import './scss/insurancePolicyDetail.scss'
import insurancePolicyDetail from './insurancePolicyDetail.vue'

const router = new VueRouter({
    routes:[
        {path: '/', redirect: ''},
        {
            path:'',
            component: insurancePolicyDetail,
            name:'insurancePolicyDetail'
        }
    ]
})

var app = new Vue({
    el: '#insurancePolicyDetail',
    router,
    data () {
        return {
            footer: {
                isShow1: false
            }
        }
    },
    template: '<insurancePolicyDetail/>',
    components: { insurancePolicyDetail }
})
