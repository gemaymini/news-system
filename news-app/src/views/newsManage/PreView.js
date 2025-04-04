import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; // 添加 useNavigate
import { getNewsDetail, increaseNewsView, increaseNewsLike, decreaseNewsLike, getNewsComment, addNewsComment } from '../../request/news';
import { PageHeader, Tag, Descriptions, Button, Input, List, Comment } from 'antd';
import NewsStore from '../../tstore/newsStore';

const { TextArea } = Input;

export default function PreView() {
    const [newsInfo, setNewsInfo] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [like, setLike] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate(); // 添加 navigate hook
    const [idStr, visitStr] = id.split('-');

    const newsId = parseInt(idStr, 10);
    const visit = parseInt(visitStr, 10);

    useEffect(() => {
        if (visit === 1) {
            increaseNewsView({ id: newsId });
            console.log('增加新闻访问量');
        }
        requireNewsDetail(newsId);
        loadComments(newsId);
    }, [newsId]);

    const requireNewsDetail = async (id) => {
        const res = await getNewsDetail({ id });
        if (res.data.status === 200) {
            setNewsInfo(res.data.data);
            setLike(res.data.data.userLiked);
        }
    };

    const loadComments = async (id) => {
        const res = await getNewsComment({ id });
        if (res.data.status === 200) {
            setComments(res.data.data);
        }
    };

    const handleLike = async () => {
        if (like) {
            await decreaseNewsLike({ id: newsId });
            setLike(false);
            setNewsInfo((prevState) => ({
                ...prevState,
                likes: prevState.likes - 1,
            }));
        } else {
            await increaseNewsLike({ id: newsId });
            setLike(true);
            setNewsInfo((prevState) => ({
                ...prevState,
                likes: prevState.likes + 1,
            }));
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim()) {
            const res = await addNewsComment({ news_id: newsId, content: newComment });
            if (res.data.status === 200) {
                setNewComment("");
                loadComments(newsId);
            }
        }
    };

    useEffect(() => {
        NewsStore.requireSortList();
    }, []);

    return (
        <div>
            {JSON.stringify(newsInfo) !== "{}" && (
                <PageHeader
                    onBack={() => window.history.back()}
                    title="返回"
                    extra={[
                        <Button key="1" type={like ? "default" : "primary"} onClick={handleLike}>
                            {like ? "取消点赞" : "点赞"} ({newsInfo.likes})
                        </Button>
                    ]}
                >
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="标题">{newsInfo.title}</Descriptions.Item>
                        <Descriptions.Item label="作者">
                            <Link to={`/userinfo/${newsInfo.author_id}`}>
                                {newsInfo.author_name}
                            </Link>
                        </Descriptions.Item>
                        <Descriptions.Item label="创建时间">
                            {newsInfo.create_time.replace("T", ' ').replace(".000Z", "")}
                        </Descriptions.Item>
                        <Descriptions.Item label="类别">
                            <Tag color={NewsStore.sortList.find(item => item.id === newsInfo.sort_id)?.color}>
                                {NewsStore.sortList.find(item => item.id === newsInfo.sort_id)?.name}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="审核状态">
                            <span style={{ color: NewsStore.c_color[newsInfo.check_state] }}>
                                {NewsStore.c_state[newsInfo.check_state]}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="发布状态">
                            <span style={{ color: NewsStore.p_color[newsInfo.publish_state] }}>
                                {NewsStore.p_state[newsInfo.publish_state]}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="访问量">{newsInfo.visits}</Descriptions.Item>
                        <Descriptions.Item label="点赞量">{newsInfo.likes}</Descriptions.Item>
                        <Descriptions.Item label="评论量">{comments.length}</Descriptions.Item>
                    </Descriptions>
                </PageHeader>
            )}

            <div
                style={{ margin: '16px 24px', border: '1px solid #E6E6E6', padding: '1em', borderRadius: '4px' }}
                dangerouslySetInnerHTML={{ __html: newsInfo.content }}
            />

            {/* 评论区 */}
            <div style={{ margin: '16px 24px' }}>
                <h3>评论</h3>
                <List
                    className="comment-list"
                    header={`${comments.length} 条评论`}
                    itemLayout="horizontal"
                    dataSource={comments}
                    renderItem={comment => (
                        <Comment
                            author={<span style={{ fontWeight: 'bold' }}>{comment.comment_name}</span>}
                            content={<div style={{ fontSize: '16px' }}>{comment.comment_content}</div>}
                            datetime={<span style={{ color: '#999' }}>{comment.create_time}</span>}
                        />
                    )}
                />

                <TextArea
                    rows={4}
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="添加评论"
                />
                <Button
                    type="primary"
                    onClick={handleAddComment}
                    style={{ marginTop: 10 }}
                >
                    提交评论
                </Button>
            </div>
        </div>
    );
}