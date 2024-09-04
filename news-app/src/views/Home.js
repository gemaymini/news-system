import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Spin, Alert, Tabs, Input } from 'antd';
import { getPublishList } from '../request/publish';
import NewsStore from '../tstore/newsStore';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

export default function Home() {
    const [newsList, setNewsList] = useState([]);
    const [filteredNewsList, setFilteredNewsList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTabKey, setActiveTabKey] = useState('all');
    const visit=1;
    const fetchNews = async () => {
        try {
            setLoading(true);
            const res = await getPublishList({ publishState: 3 });
            setNewsList(res.data.data || []);
            setFilteredNewsList(res.data.data || []); // 初始化时显示所有新闻
        } catch (error) {
            console.error('Error fetching news:', error);
            setError('Failed to fetch news');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
        NewsStore.requireSortList(); // 获取分类列表
    }, []);

    if (loading) {
        return (
            <div style={styles.spinner}>
                <Spin tip="Loading..." size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.error}>
                <Alert message="Error" description={error} type="error" showIcon />
            </div>
        );
    }

    const getSortNameById = (sortId) => {
        const sort = NewsStore.sortList.find((item) => item.id === sortId);
        return sort ? sort.name : 'Uncategorized';
    };

    const extractCoverImage = (content, newsId) => {
        if (content) {
            const regex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|svg|webp))/i;
            const match = content.match(regex);
            return match ? match[0] : `https://picsum.photos/seed/${newsId}/400/200`;
        }
        return `https://picsum.photos/seed/${newsId}/400/200`;
    };

    const onTabChange = (key) => {
        setActiveTabKey(key);
        if (key === 'all') {
            setFilteredNewsList(newsList);
        } else {
            const filtered = newsList.filter(news => getSortNameById(news.sort_id) === key);
            setFilteredNewsList(filtered);
        }
    };

    const onSearch = (value) => {
        const searchQuery = value.toLowerCase();
        const filteredNews = newsList.filter(news =>
            news.title.toLowerCase().includes(searchQuery) ||
            getSortNameById(news.sort_id).toLowerCase().includes(searchQuery) ||
            news.author_name.toLowerCase().includes(searchQuery)
        );
        setFilteredNewsList(filteredNews);
    };

    return (
        <div style={styles.container}>
            <div style={styles.tabContainer}>
                <Tabs
                    defaultActiveKey="all"
                    onChange={onTabChange}
                    tabBarStyle={styles.tabBar}
                    activeKey={activeTabKey}
                    style={styles.tabs}
                >
                    <TabPane tab={<div style={styles.tabPane}>所有新闻</div>} key="all" />
                    {NewsStore.sortList.map(sort => (
                        <TabPane tab={<div style={styles.tabPane}>{sort.name}</div>} key={sort.name} />
                    ))}
                </Tabs>
                {/* 搜索框 */}
                <Search
                    placeholder="搜索新闻..."
                    onSearch={onSearch}
                    enterButton
                    style={styles.search}
                />
            </div>

            <div style={styles.newsSection}>
                <Row gutter={[16, 16]} style={styles.grid}>
                    {filteredNewsList.map(news => (
                        <Col key={news.id} xs={24} sm={12} md={8} lg={8}>
                            <Card hoverable style={styles.card}>
                                <a href={`#/news-manage/preview/${news.id}-${visit}`}>
                                    <div style={styles.cardImageWrapper}>
                                        <img
                                            src={extractCoverImage(news.content, news.id)} // 提取封面图片或使用备用图片
                                            alt={news.title}
                                            style={styles.cardImage}
                                        />
                                        <div style={styles.cardOverlay}>
                                            <Title level={4} style={styles.cardTitle}>{news.title}</Title>
                                            <Paragraph style={styles.cardAuthor}>{news.author_name}</Paragraph>
                                        </div>
                                    </div>
                                </a>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f0f2f5',
    },
    tabContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
    },
    tabs: {
        flex: 1,
        display: 'flex',
        flexWrap: 'wrap',
    },
    tabBar: {
        fontSize: '16px',
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },
    tabPane: {
        fontSize: '16px',
        border: '2px solid #1890ff',
        borderRadius: '8px',
        padding: '8px 0px',
        backgroundColor: '#ffffff',
        textAlign: 'center',
        margin: '1px',
        flex: '1 1 auto',
        minWidth: '120px', // 设置最小宽度
        maxWidth: 'calc(33.33% - 10px)', // 根据屏幕宽度调整最大宽度，留出间隔
        boxSizing: 'border-box',
    },
    search: {
        width: '200px',
        flex: '0 0 auto',
        marginTop: '5px',
        '@media (max-width: 768px)': {
            width: '100%',
        }
    },
    newsSection: {
        marginBottom: '40px',
    },
    grid: {
        marginTop: '10px',
    },
    card: {
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    cardImageWrapper: {
        position: 'relative',
        flex: 1,
    },
    cardImage: {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
    },
    cardOverlay: {
        position: 'absolute',
        bottom: '0px',
        left: '0px',
        right: '0px',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: '10px',
        borderRadius: '0 0 8px 8px',
        color: '#fff',
    },
    cardTitle: {
        color: '#fff',
        fontSize: '18px',
        marginBottom: '5px',
    },
    cardAuthor: {
        color: '#fff',
        fontSize: '14px',
        marginBottom: '0',
    },
    cardContent: {
        padding: '10px',
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    error: {
        padding: '20px',
    },
};
