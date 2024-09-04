import { observable,configure, runInAction} from "mobx"
import {getNewsSort} from '../request/news'

configure({
    enforceAction:'always'
})

const NewsStore=observable({
    sortList:[],
    availableSortList:[],
    isAddVisible:false,
    editInfo:"",
    // 获取分类标签列表
    async requireSortList(){
        const res=await getNewsSort()
        runInAction(()=>{
            this.sortList=res.data.data
            this.availableSortList=res.data.data.filter(item=>item.state===1)
        })
        console.log(this.sortList)
        console.log(this.availableSortList)
    },


    // 设置是否显示添加角色模态框
    setIsAddVisible(boolean){
        this.isAddVisible=boolean
    },
    
    // 设置编辑信息
    setEditInfo(string){
        this.editInfo=string
    },
    // 分页属性
    currentPage:1, // 当前页码
    pageSize:10, // 每页显示条数
    total:0, // 总条数
    // 设置当前页码
    setCurrentPage(number){
        this.currentPage=number
    },
    //sortList:{ },
    //sortColor:{},


    c_state:{
        "1":"草稿",
        "2":"正在审核...",
        "3":"已通过",
        "4":"未通过"
    },
    c_color:{
        "1":"#f50",
        "2":"#2db7f5",
        "3":"#87d068",
        "4":"#f50",
    },
    p_state:{
        "1":"正在编辑...",
        "2":"待发布",
        "3":"已发布",
        "4":"已下线",
    },
    
    p_color:{
        "1":"red",
        "2":"blue",
        "3":"green",
        "4":"red",
    },
},{

})

export default NewsStore
