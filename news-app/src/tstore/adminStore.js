import { observable,configure, runInAction } from "mobx"
import {getModulesAndRolesById,getUserInfo,loginRequest } from '../request/admin'

configure({
    enforceAction:'always'
})

const AdminStore=observable({
    modules:localStorage.getItem('modules')?JSON.parse(localStorage.getItem('modules')):[],
    userInfo:localStorage.getItem('userinfo')?JSON.parse(localStorage.getItem('userinfo')):'',
    token:localStorage.getItem('token')?localStorage.getItem('token'):'',
    spining:false,
    collapse:false,

    setSpinning(boolean){
        this.spining=boolean
    },
    setCollapse(){
        this.collapse=!this.collapse
    },
    async requireModules(type){
        const res=await getModulesAndRolesById()
        if(res.data.status===200){
            localStorage.setItem('modules',JSON.stringify(res.data.data)) 
            runInAction(()=>{
                this.modules=res.data.data
                if(type==='login'){
                    window.location.href = '/#/home'
                }
            })
        }
        console.log("modules")
        console.log(this.modules)
    },

    async requireUserInfo(){
        const res=await getUserInfo()
        if(res.data.status===200){
            localStorage.setItem('userinfo',JSON.stringify(res.data.data)) 
            runInAction(()=>{
                this.userInfo=JSON.parse(JSON.stringify(res.data.data))
            })
        }
    },

    async requireLogin(value){
        const res=await loginRequest(value)
        if(res.data.status===200){
            localStorage.setItem('token',res.data.token)
            this.token=res.data.token
        }  
        await this.requireUserInfo()
        await this.requireModules('login')
    }
})


export default AdminStore
