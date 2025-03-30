import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Row, Col, Avatar, Button, Spin, List, Tag } from 'antd';
import { UserOutlined, MailOutlined, CalendarOutlined, TeamOutlined, FileTextOutlined, HeartOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { getUserInfo } from "../../request/user";
import './UserInfo.css';

export default function UserInfo() {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getUserInfo(id)
            .then(res => {
                if (res.data.status === 200) {
                    setUserInfo(res.data.data);
                } else {
                    setError(res.data.message);
                }
            })
            .catch(err => {
                setError('Failed to fetch user information');
                console.error('Request failed', err);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleBack = () => {
        navigate('/user-manage/list');
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
                {error}
            </div>
        );
    }

    if (!userInfo) {
        return null;
    }

    return (
        <Card className="user-info-card">
            <Row align="middle" gutter={[16, 16]}>
                <Col span={4}>
                    <Avatar
                        size={100}
                        src={userInfo.image_url || 'http://10.126.95.2:8080/uploads/default_image.jpeg'}
                        className="avatar"
                    />
                </Col>
                <Col span={20}>
                    <h2>{userInfo.username} 的简介</h2>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                <Col span={12}>
                    <div className="info-item">
                        <b>Username:</b> {userInfo.username} <UserOutlined className="icon" />
                    </div>
                    <div className="info-item">
                        <b>State:</b> {userInfo.state === 1 ? 'Active' : 'Inactive'}{' '}
                        {userInfo.state === 1 ? <CheckOutlined className="icon" /> : <CloseOutlined className="icon" />}
                    </div>
                </Col>
                <Col span={12}>
                    <div className="info-item">
                        <b>Gender:</b> {userInfo.sex || 'Not set'}
                    </div>
                    <div className="info-item">
                        <b>Email:</b>{' '}
                        {userInfo.email ? (
                            <a href={`mailto:${userInfo.email}`} className="email-link">
                                {userInfo.email} <MailOutlined className="icon" />
                            </a>
                        ) : (
                            'Not set'
                        )}
                    </div>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                <Col span={12}>
                    <div className="info-item">
                        <b>Role:</b> {userInfo.character_name} <TeamOutlined className="icon" />
                    </div>
                </Col>
                <Col span={12}>
                    <div className="info-item">
                        <b>Account Creation Time:</b>{' '}
                        {userInfo.create_time.replace('T', ' ').replace('.000Z', '')}{' '}
                        <CalendarOutlined className="icon" />
                    </div>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                <Col span={8}>
                    <div className="stat">
                        News Published: {userInfo.newsCount} <FileTextOutlined className="icon" />
                    </div>
                </Col>
                <Col span={8}>
                    <div className="stat">
                        News Likes: {userInfo.likesCount} <HeartOutlined className="icon" />
                    </div>
                </Col>
                <Col span={8}>
                    <div className="stat">
                        News Views: {userInfo.viewsCount} <EyeOutlined className="icon" />
                    </div>
                </Col>
            </Row>

            {/* 热门新闻列表 */}
            <div style={{ marginTop: '20px' }}>
                <h3>热门新闻</h3>
                <List
                    itemLayout="horizontal"
                    dataSource={userInfo.topNews}
                    renderItem={news => (
                        <List.Item
                            actions={[
                                <span><EyeOutlined /> {news.visits}</span>,
                                <span><HeartOutlined /> {news.likes}</span>
                            ]}
                        >
                            <List.Item.Meta
                                title={<Link to={`/news-manage/preview/${news.id}-0`}>{news.title}</Link>}
                                description={
                                    <>
                                        <span>{news.create_time.replace('T', ' ').replace('.000Z', '')}</span>
                                        {' '}
                                        <Tag color={getSortColor(news.sort_id)}>
                                            {getSortName(news.sort_id)}
                                        </Tag>
                                    </>
                                }
                            />
                        </List.Item>
                    )}
                />
            </div>

            <Button type="primary" onClick={handleBack} className="button" style={{ marginTop: '20px' }}>
                Back
            </Button>
        </Card>
    );
}

// 辅助函数：根据 sort_id 获取分类名称和颜色
const sortData = [
    { id: 1, name: '时事新闻', color: 'geekblue' },
    { id: 2, name: '环球经济', color: 'red' },
    { id: 3, name: '科学技术', color: 'purple' },
    { id: 4, name: '军事世界', color: '#D8AD87' },
    { id: 5, name: '世界体育', color: '#818BD7' },
    { id: 6, name: '生活理财', color: '#D47799' },
    { id: 8, name: '其他', color: 'black' },
];

const getSortName = (sortId) => {
    const sort = sortData.find(item => item.id === sortId);
    return sort ? sort.name : '未知分类';
};

const getSortColor = (sortId) => {
    const sort = sortData.find(item => item.id === sortId);
    return sort ? sort.color : 'gray';
};