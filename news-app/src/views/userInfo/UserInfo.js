import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 引入 useNavigate
import { Descriptions, Button } from 'antd'; // 引入 Button 组件
import { getUserInfo } from '../../request/user';

export default function UserInfo() {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // 用于导航返回

    useEffect(() => {
        getUserInfo(id)
            .then(res => {
                if (res.data.status === 200) {
                    setUserInfo(res.data.data);
                } else {
                    setError(res.data.message);
                }
            })
            .catch(err => {
                setError('获取用户信息失败');
                console.error('请求失败', err);
            });
    }, [id]);

    // 返回按钮的点击处理函数
    const handleBack = () => {
        navigate('/user-manage/list'); // 返回到用户列表页面
    };

    if (error) {
        return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
    }

    if (!userInfo) {
        return <div style={{ padding: '20px' }}>加载中...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Descriptions title="用户简介" bordered>
                <Descriptions.Item label="用户名">{userInfo.username}</Descriptions.Item>
                <Descriptions.Item label="姓名">{userInfo.name}</Descriptions.Item>
                <Descriptions.Item label="新闻发布量">{userInfo.newsCount}</Descriptions.Item>
                <Descriptions.Item label="新闻点赞量">{userInfo.likesCount}</Descriptions.Item>
                <Descriptions.Item label="新闻访问量">{userInfo.viewsCount}</Descriptions.Item>
            </Descriptions>
            <Button
                type="primary"
                onClick={handleBack}
                style={{ marginTop: '20px' }} // 添加一些间距
            >
                返回
            </Button>
        </div>
    );
}