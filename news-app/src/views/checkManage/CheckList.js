import React, { useState, useEffect, useRef } from 'react';
import { getCheckList, drawbackCheck, submitDraft, getCheckHistory } from '../../request/news';
import { Table, Tag, Button, Tooltip, notification, Drawer, Timeline } from 'antd';
import NewsStore from '../../tstore/newsStore';
import { CheckOutlined, RollbackOutlined, EditOutlined, ContainerOutlined, InfoOutlined ,LockOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CheckSearchComponent from './CheckSearchComponent'; // 导入搜索组件
import AdminStore from '../../tstore/adminStore';

export default function CheckList() {
    const [checkList, setCheckList] = useState([]);
    const { current: pageSize } = useRef(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const [drawVisible, setDrawVisible] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        NewsStore.requireSortList();
    }, []);

    const requireCheckList = (params) => {
        getCheckList(params).then(res => {
            if (res.data.status === 200) {
                setCheckList(res.data.data);
                if (total !== res.data.total) { setTotal(res.data.total); }
            }
        });
    };

    useEffect(() => {
        requireCheckList({ currentPage, pageSize });
    }, [currentPage]);

    const handleSearch = (values) => {
        setCurrentPage(1); // 重置页码为1
        if (values.sort_id === "0") {
            delete values.sort_id; // 如果选择了“所有类型”，删除 sort_id 参数
        }
        requireCheckList({ ...values, currentPage: 1, pageSize });
    };

    const handleDrawbackCheck = async (id) => {
        const res = await drawbackCheck({ id });
        if (res.data.status === 200) {
            requireCheckList({ currentPage: 1, pageSize });
            notification.open({
                message: '成功撤销',
                description: `您可以在草稿箱中查看该条记录`,
                icon: <CheckOutlined style={{ color: '#39A945' }} />,
                placement: 'bottomRight'
            });
        }
    };

    const handleSubmit = async (id) => {
        const res = await submitDraft({ id });
        if (res.data.status === 200) {
            requireCheckList({ currentPage: 1, pageSize });
            notification.open({
                message: '成功提交！',
                description: `您可以在审核列表中查看审核进度`,
                icon: <CheckOutlined style={{ color: '#39A945' }} />,
                placement: 'bottomRight'
            });
        }
    };

    const requireCheckHistory = async (id) => {
        const res = await getCheckHistory({ id });
        setHistory(res.data.data);
        setDrawVisible(true);
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
            title: '状态',
            dataIndex: 'check_state',
            align: 'center',
            render: text => <Tag color={NewsStore.c_color[text]}>{NewsStore.c_state[text]}</Tag>
        },
        {
            title: '审核时间',
            dataIndex: 'check_time',
            align: 'center',
            render: text => <span>{text ? text : '/'}</span>
        },
        {
            title: '操作',
            key: 'operation',
            dataIndex: 'check_state',
            align: 'center',
            render: (text, record) => {
                if (text === 2) {
                    return (
                        <span>
                            <Tooltip title="撤销回草稿箱">
                                <Button shape="circle" danger icon={<RollbackOutlined />} onClick={() => { handleDrawbackCheck(record.id) }} style={{ marginRight: '1em' }} />
                            </Tooltip>
                            <Tooltip title="查看审核记录" onClick={() => { requireCheckHistory(record.id) }}>
                                <Button shape="circle" icon={<InfoOutlined />} />
                            </Tooltip>
                        </span>
                    );
                }
                if (text === 3) {
                    return (
                        <Tooltip title="查看审核记录">
                            <Button shape="circle" icon={<InfoOutlined />} onClick={() => { requireCheckHistory(record.id) }} />
                        </Tooltip>
                    );
                }
                if (text === 4) {
                    return (
                        <span>
                            <Tooltip title="修改">
                                <Button shape="circle" type='primary' icon={<EditOutlined />} onClick={() => { navigate(`/news-manage/draft/${record.id}`) }} style={{ marginRight: '1em' }} />
                            </Tooltip>
                            <Tooltip title="重新提交">
                                <Button shape="circle" icon={<ContainerOutlined />} onClick={() => { handleSubmit(record.id) }} style={{ marginRight: '1em' }} />
                            </Tooltip>
                            <Tooltip title="查看审核记录">
                                <Button shape="circle" icon={<InfoOutlined />} onClick={() => { requireCheckHistory(record.id) }} />
                            </Tooltip>
                        </span>
                    );
                }
                if (text === 4) { return '/' }
            }
        },
    ];

    // 权限检查
// 权限检查
if (!AdminStore.modules.operations.includes('checkAll')) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh', // 占满整个视口高度
            backgroundColor: '#f0f2f5', // 柔和的背景色
        }}>
            <div style={{
                textAlign: 'center',
                padding: '40px',
                backgroundColor: '#fff', // 白色背景
                borderRadius: '8px', // 圆角
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // 阴影效果
                maxWidth: '400px', // 限制最大宽度
                width: '100%', // 自适应小屏幕
            }}>
                <LockOutlined style={{ fontSize: '48px', color: '#faad14', marginBottom: '16px' }} /> {/* 锁图标 */}
                <h2 style={{ marginBottom: '16px', color: '#333' }}>抱歉，您没有访问权限</h2>
                <p style={{ color: '#666' }}>请联系管理员获取权限或返回上一页。</p>
                <Button type="primary" onClick={() => navigate(-1)} style={{ marginTop: '16px' }}>
                    返回
                </Button>
            </div>
        </div>
    );
}

    // 如果有权限，则渲染完整的组件
    return (
        <div>
            <CheckSearchComponent onSearch={handleSearch} /> {/* 添加搜索组件 */}
            <Table
                rowKey={item => item.id}
                columns={columns}
                dataSource={checkList ? checkList : []}
                pagination={{
                    pageSize,
                    current: currentPage,
                    total,
                    onChange: (value) => { setCurrentPage(value); }
                }}
            />
            <Drawer
                title="审核记录"
                placement="left"
                closable={false}
                onClose={() => { setDrawVisible(false) }}
                visible={drawVisible}
            >
                <Timeline mode="left">
                    {history?.map(item =>
                        <Timeline.Item label={`${item.submit_time}`} color={item.check_result === 1 ? 'green' : 'red'} key={item.id}>
                            <p>
                                <span style={{ color: '#2db7f5' }}>{item.check_person} </span>
                                <span>于 {item.check_time} {item.check_result === 1 ? '审核通过' : '驳回'}</span>
                            </p>
                            {
                                item.check_comment && <p>理由：{item.check_comment}</p>
                            }
                        </Timeline.Item>
                    )}
                </Timeline>
            </Drawer>
        </div>
    );
}