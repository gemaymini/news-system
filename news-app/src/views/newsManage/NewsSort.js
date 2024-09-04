import React,{useEffect} from 'react'
import AdminStore from '../../tstore/adminStore'
import { useStores } from '../../tstore/useStores'
import { observer } from 'mobx-react';
import { ExclamationCircleOutlined, EditOutlined,DeleteFilled} from '@ant-design/icons';
import { Button,Modal,Table,Tooltip,Switch } from 'antd';
import {
    deleteNewsSort,
    stopOrStartNewsSort
} from '../../request/news'
import ModalComponent from './ModalComponent.js';
export default observer(()=> {
    const {NewsStore}=useStores()

    // console.log(NewsStore)
    //初始化
    useEffect(() => {
        NewsStore.requireSortList();
    }, [NewsStore.currentPage]);
    
    const changeState=async(checked,id)=>{
        if(checked){
            await stopOrStartNewsSort({id:id,state:1})
            NewsStore.requireSortList();
        }else{
            Modal.confirm({
                title: '确定要停用吗？',
                icon: <ExclamationCircleOutlined />,
                content:'停用后，属于该分类的所有新闻将都会被归为“其他”类别。',
                cancelText:'取消',
                okText:'确定',
                async onOk() {
                  await stopOrStartNewsSort({id:id,state:0})
                  NewsStore.requireSortList();
                },
            });
        }
    }

    const deleteRow=async(id)=>{
        Modal.confirm({
            title: '你确定要删除吗？',
            icon: <ExclamationCircleOutlined />,
            content:'删除后，属于该分类的所有新闻将都会被归为“其他”类。',
            cancelText:'取消',
            okText:'确定',
            async onOk() {
                const res=await deleteNewsSort({id})
                if(res.data.status===200){
                  NewsStore.requireSortList();
                }
            },
        });
    }

    //编辑标签
    const editRow=async (record)=>{
        // 获取基本数据
        NewsStore.setEditInfo(JSON.stringify(record))
        NewsStore.setIsAddVisible(true)
        
    }
    let columns = [
        {
            title: 'id',
            dataIndex: 'id',
            align:'center'
        },
        {
            title: '新闻分类',
            dataIndex: 'name',
            align:'center'
        },
        {
            
            title: '标签颜色',
            dataIndex: 'color',
            width:250,
            render: text => (
                <Tooltip placement="topLeft" title={text}>
                  {text}
                </Tooltip>
            ),
        },
        {
            title: '状态',
            dataIndex: 'state',
            align:'center',
            render: (text,record) =>
                    <div>
                    <Switch 
                        disabled={record.id===8} 
                        checkedChildren="正常"
                        unCheckedChildren="已停用"
                        checked={record.state}
                        onChange={(checked)=>{changeState(checked,record.id)}}
                    />
                    {/* <span>{record.state?<span>正常</span>:<span style={{color:'red'}}>已停用</span>}</span> */}
                    </div>
        },
        {
            title: '操作',
            dataIndex: 'state',
            align:'center',
            render: (text,record) => {
                            return <div><Button danger size='small' icon={<DeleteFilled />} style={{marginRight:"1em"}} onClick={()=>{deleteRow(record.id)}}>删除</Button>
                            <Button type='primary' size='small' icon={<EditOutlined />} onClick={()=>{editRow(record)}}>编辑</Button></div>
                            }
        },
    ];

    
    return (
        <div>
            {
                AdminStore.modules.operations.includes('characterAdd')?
                <Button 
                    type='primary' 
                    style={{marginBottom:'1em',float:'right'}} 
                    onClick={()=>{
                        NewsStore.setEditInfo("")
                        NewsStore.setIsAddVisible(true)
                    }}>添加分类</Button>:''
            }
           <ModalComponent 
                isVisible={NewsStore.isAddVisible} 
                info={NewsStore.editInfo}
                close={(v)=>{
                    NewsStore.setIsAddVisible(false)
                    if(v==='ok'){
                        NewsStore.requireCharacters()
                    }
                }}
           />
            <Table 
                rowKey={item=>item.id}
                columns={columns}
                dataSource={NewsStore.sortList?NewsStore.sortList:[]} 
                pagination={{
                    pageSize:NewsStore.pageSize,
                    current:NewsStore.currentPage,
                    total:NewsStore.total,
                    onChange:(value)=>{NewsStore.setCurrentPage(value)}
                }}
            />
            
        </div>
    )
})