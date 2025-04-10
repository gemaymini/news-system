import React,{useState,useRef,useEffect} from 'react';
import {Table,Tag,Button,Tooltip,notification,Popconfirm} from 'antd';
import { EditOutlined,DeleteFilled,ContainerOutlined,CheckOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import NewsStore from '../../tstore/newsStore';
import {getDraftList,deleteDraft,submitDraft} from '../../request/news';
import DraftSearchComponent from './DraftSearchComponent'; // 导入新的搜索组件

export default function DratfList() {
    const [draftList, setDraftList] = useState([]); //草稿列表
    const { current: pageSize } = useRef(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const requireDraftList = (params) => {
        getDraftList(params).then(res => {
            if (res.data.status === 200) {
                setDraftList(res.data.data);
                if (total !== res.data.total) { setTotal(res.data.total); }
            }
        });
    };

    useEffect(() => {
        NewsStore.requireSortList();
    }, []);

    useEffect(() => {
        requireDraftList({ currentPage, pageSize });
    }, [currentPage]);

    const handleSearch = (values) => {
        setCurrentPage(1); // 重置页码为1 
        if (values.sort_id === "0") {
            delete values.sort_id; // 如果选择了“所有类型”，删除 sort_id 参数
        }
        requireDraftList({ ...values, currentPage: 1, pageSize });
    };

    const submitRow = async (id) => {
        const res = await submitDraft({ id });
        if (res.data.status === 200) {
            requireDraftList({ currentPage: 1, pageSize });
            notification.open({
                message: '已提交审核',
                description: `您可以在审核列表中查看审核进度`,
                icon: <CheckOutlined style={{ color: '#39A945' }} />,
                placement: 'bottomRight'
            });
        }
    };

    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            align: 'center',
            render: (text, record) => <a href={`#/news-manage/preview/${record.id}`}>{text}</a>
        },
        {
            title: '类别',
            dataIndex: 'sort_id',
            align: 'center',
            render: text => <Tag color={NewsStore.sortList.find(item => item.id === text)?.color}>{NewsStore.sortList.find(item => item.id === text)?.name}</Tag>
        },
        {
            title: '更新时间',
            dataIndex: 'update_time',
            align: 'center',
        },
        {
            title: '操作',
            key: 'operation',
            align: 'center',
            render: (text, record) => <span>
                <Tooltip title="编辑">
                    <Button shape="circle" icon={<EditOutlined />} onClick={() => { navigate(`/news-manage/draft/${record.id}`) }} style={{ marginRight: '1em' }} />
                </Tooltip>
                <Tooltip title="提交审核">
                    <Button shape="circle" icon={<ContainerOutlined />} onClick={() => { submitRow(record.id) }} style={{ marginRight: '1em' }} />
                </Tooltip>

                <Popconfirm
                    title="你确定要删除吗？"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={async () => {
                        const res = await deleteDraft({ id: record.id });
                        if (res.data.status === 200) {
                            requireDraftList({ currentPage: 1, pageSize });
                        }
                    }}
                >
                    <Button danger shape="circle" icon={<DeleteFilled />} />
                </Popconfirm>
            </span>
        },
    ];

    return (
        <div>
            <DraftSearchComponent onSearch={handleSearch} /> {/* 添加搜索组件 */}
            <Table
                rowKey={item => item.id}
                columns={columns}
                dataSource={draftList ? draftList : []}
                pagination={{
                    pageSize,
                    current: currentPage,
                    total,
                    onChange: (value) => { setCurrentPage(value); }
                }}
            />
        </div>
    );
}
