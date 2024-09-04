import { observable,configure, runInAction } from "mobx"
import { getCharacters,getAllOpenModules} from '../request/power'

// 配置MobX强制使用actions来修改状态
configure({
    enforceAction:'always'
})

// 定义PowerStore，用于管理权限相关的状态和操作
const PowerStore=observable({
    // 数据属性
    charactersList:[], // 存储角色列表
    isAddVisible:false, // 控制添加角色模态框的显示状态
    editInfo:"", // 存储编辑角色的信息

    // 分页属性
    currentPage:1, // 当前页码
    pageSize:10, // 每页显示条数
    total:0, // 总条数

    // 模态框属性
    current:0, // 用于指示进度状态
    checkedModules:[], // 被选中的模块列表
    moduleRoles:[], // 存储模块对应的权限
    checkedRoles:[], // 被选中的权限列表
    allOpenModules:[], // 存储所有可选模块

    // 方法

    // 设置是否显示添加角色模态框
    setIsAddVisible(boolean){
        this.isAddVisible=boolean
    },
    
    // 设置编辑信息
    setEditInfo(string){
        this.editInfo=string
    },
    
    // 设置当前页码
    setCurrentPage(number){
        this.currentPage=number
    },
    
    // 根据类型获取角色列表
    async requireCharacters(type){
        const res=await getCharacters({
            currentPage:type===''?1:this.currentPage,
            pageSize:this.pageSize,
        })
        runInAction(()=>{
            this.charactersList=res.data.data
            this.total=res.data.total
        })  
    },

    // 获取所有可选模块并存储
    async requireAllOpenModules(){
        const res=await getAllOpenModules()
        runInAction(()=>{
            this.allOpenModules=res.data.data
        })
    },

    // 设置当前进度
    setCurrent(number){
        this.current=number
    },
    
    // 设置选中的模块
    setCheckedModules(arr){
        this.checkedModules=arr
    },
    
    // 设置选中的权限并打印
    setCheckedRoles(arr){
        this.checkedRoles=arr
        console.log(this.checkedRoles)
    },

    // 设置模块的权限
    setModuleRoles(arr){
        this.moduleRoles=arr
    }

})

export default PowerStore