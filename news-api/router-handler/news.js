const moment = require('moment');
const { query, queryT } = require('../utils/query');
const { sqlCount, sqlConcat } = require('../utils/sqlhandler');
const db = require('../db');

// 增加新闻访问量
exports.increaseNewsView = async (req, res) => {
    let connection;
    try {
        const news_id = req.body.id;
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [results] = await queryT('SELECT * FROM news_detail WHERE id = ? FOR UPDATE', [news_id], res, connection);
        if (results.length === 0) throw new Error('新闻不存在！');

        await queryT('UPDATE news_detail SET visits = visits + 1 WHERE id = ?', [news_id], res, connection);
        await connection.commit();
        res.ok('ok');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('增加访问量失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('增加访问量失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 增加新闻点赞
exports.increaseNewsLike = async (req, res) => {
    let connection;
    try {
        const news_id = req.body.id;
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [results] = await queryT('SELECT * FROM news_detail WHERE id = ? FOR UPDATE', [news_id], res, connection);
        if (results.length === 0) throw new Error('新闻不存在！');

        await queryT('UPDATE news_detail SET likes = likes + 1 WHERE id = ?', [news_id], res, connection);
        await connection.commit();
        res.ok('ok');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('增加点赞失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('增加点赞失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 减少新闻点赞
exports.decreaseNewsLike = async (req, res) => {
    let connection;
    try {
        const news_id = req.body.id;
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [results] = await queryT('SELECT * FROM news_detail WHERE id = ? FOR UPDATE', [news_id], res, connection);
        if (results.length === 0) throw new Error('新闻不存在！');

        await queryT('UPDATE news_detail SET likes = likes - 1 WHERE id = ?', [news_id], res, connection);
        await connection.commit();
        res.ok('ok');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('减少点赞失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('减少点赞失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 获取新闻评论
exports.getNewsComment = async (req, res) => {
    try {
        const news_id = req.body.id;
        const data = await query(
            `SELECT nc.id, nc.comment_content, u.username AS comment_name, nc.create_time
             FROM news_comments nc
                      JOIN news_system.user u ON u.id = nc.comment_person_id
             WHERE nc.news_id = ?
             ORDER BY nc.create_time DESC`,
            [news_id],
            res
        );
        res.ok('ok', { data });
    } catch (err) {
        console.error('获取评论失败:', err);
        res.err('获取评论失败: ' + err.message);
    }
};

// 添加新闻评论
exports.addNewsComment = async (req, res) => {
    let connection;
    try {
        const { news_id, content } = req.body;
        const comment_person_id = req.auth.id;
        const create_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

        connection = await db.getConnection();
        await connection.beginTransaction();

        const [results] = await queryT('SELECT * FROM news_detail WHERE id = ? FOR UPDATE', [news_id], res, connection);
        if (results.length === 0) throw new Error('新闻不存在！');

        const commentData = { comment_person_id, news_id, comment_content: content, create_time };
        await queryT('INSERT INTO news_comments SET ?', [commentData], res, connection);
        await connection.commit();
        res.ok('ok', { data: { id: results.insertId } });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('添加评论失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('添加评论失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 获取新闻类别
exports.getNewsSort = async (req, res) => {
    try {
        const data = await query('SELECT id, name, color, state FROM news_sorts ORDER BY state DESC, id ASC', res);
        res.ok('ok', { data });
    } catch (err) {
        console.error('获取新闻类别失败:', err);
        res.err('获取新闻类别失败: ' + err.message);
    }
};

// 获取最大 ID（辅助函数）
const getNewId = async (table, res, connection) => {
    const [idRows] = await queryT(`SELECT MAX(id) AS id FROM ${table}`, null, res, connection);
    return idRows.id;
};

// 更新新闻最新审核 ID（辅助函数）
const handleUpdateNewLatestCheck = async (news_id, req, res, connection) => {
    const checkInfo = {
        news_id,
        submit_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        check_person_id: req.auth.id
    };
    await queryT('INSERT INTO news_checks SET ?', [checkInfo], res, connection);
    const checkId = await getNewId('news_checks', res, connection);
    await queryT('UPDATE news_detail SET latest_check_id = ? WHERE id = ?', [checkId, news_id], res, connection);
    return 'ok';
};

// 创建新闻
exports.createNews = async (req, res) => {
    let connection;
    try {
        const newsInfo = {
            ...req.body,
            author_id: req.auth.id
        };
        connection = await db.getConnection();
        await connection.beginTransaction();

        await queryT('INSERT INTO news_detail SET ?', [newsInfo], res, connection);
        if (newsInfo.check_state === 2) {
            const news_id = await getNewId('news_detail', res, connection);
            await queryT('SELECT * FROM news_detail WHERE id = ? FOR UPDATE', [news_id], res, connection);
            await handleUpdateNewLatestCheck(news_id, req, res, connection);
        }

        await connection.commit();
        res.ok('创建成功');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('创建新闻失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('创建新闻失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 停用/启用新闻类别
exports.stopOrStartNewsSort = async (req, res) => {
    let connection;
    try {
        const sort_id = req.body.id;
        const sortData = { ...req.body };
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [results] = await queryT('SELECT * FROM news_sorts WHERE id = ? FOR UPDATE', [sort_id], res, connection);
        if (results.length === 0) throw new Error('新闻类别不存在！');

        await queryT('UPDATE news_sorts SET ? WHERE id = ?', [sortData, sort_id], res, connection);
        await connection.commit();
        res.ok('更新成功');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('更新新闻类别失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('更新新闻类别失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 删除新闻类别
exports.deleteNewsSort = async (req, res) => {
    let connection;
    try {
        const sort_id = req.body.id;
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [sortResults] = await queryT('SELECT * FROM news_sorts WHERE id = ? FOR UPDATE', [sort_id], res, connection);
        if (sortResults.length === 0) throw new Error('新闻类别不存在！');

        await queryT('SELECT * FROM news_detail WHERE sort_id = ? FOR UPDATE', [sort_id], res, connection);
        await queryT('UPDATE news_detail SET sort_id = 8 WHERE sort_id = ?', [sort_id], res, connection);
        await queryT('DELETE FROM news_sorts WHERE id = ?', [sort_id], res, connection);

        await connection.commit();
        res.ok('删除成功');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('删除新闻类别失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('删除新闻类别失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 添加新闻类别
exports.addNewsSort = async (req, res) => {
    let connection;
    try {
        const newsSortInfo = {
            name: req.body.name,
            color: req.body.color,
            id: req.body.id
        };
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [results] = await queryT('SELECT * FROM news_sorts WHERE name = ? OR id = ? FOR UPDATE', [newsSortInfo.name, newsSortInfo.id], res, connection);
        if (results.length > 0) throw new Error('类别名称或 ID 已存在！');

        await queryT('INSERT INTO news_sorts SET ?', [newsSortInfo], res, connection);
        await connection.commit();
        res.ok('创建成功');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('添加新闻类别失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('添加新闻类别失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 更新新闻类别
exports.updateNewsSort = async (req, res) => {
    let connection;
    try {
        const sort_id = req.body.id;
        const sortData = { ...req.body };
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [results] = await queryT('SELECT * FROM news_sorts WHERE id = ? FOR UPDATE', [sort_id], res, connection);
        if (results.length === 0) throw new Error('新闻类别不存在！');

        await queryT('UPDATE news_sorts SET ? WHERE id = ?', [sortData, sort_id], res, connection);
        await connection.commit();
        res.ok('更新成功');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('更新新闻类别失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('更新新闻类别失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 更新草稿
exports.updateDraft = async (req, res) => {
    let connection;
    try {
        const news_id = req.body.id;
        const newsData = { ...req.body };
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [results] = await queryT('SELECT * FROM news_detail WHERE id = ? FOR UPDATE', [news_id], res, connection);
        if (results.length === 0) throw new Error('新闻不存在！');

        await queryT('UPDATE news_detail SET ? WHERE id = ?', [newsData, news_id], res, connection);
        if (newsData.check_state !== 1) {
            await handleUpdateNewLatestCheck(news_id, req, res, connection);
        }

        await connection.commit();
        res.ok('更新成功');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('更新草稿失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('更新草稿失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 提交审核
exports.submitDraft = async (req, res) => {
    let connection;
    try {
        const news_id = req.query.id;
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [results] = await queryT('SELECT * FROM news_detail WHERE id = ? FOR UPDATE', [news_id], res, connection);
        if (results.length === 0) throw new Error('新闻不存在！');

        await queryT('UPDATE news_detail SET check_state = 2 WHERE id = ?', [news_id], res, connection);
        await handleUpdateNewLatestCheck(news_id, req, res, connection);

        await connection.commit();
        res.ok('成功提交');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('提交审核失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('提交审核失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 获取草稿列表
exports.getDraftList = async (req, res) => {
    try {
        const params = {
            ...req.query,
            author_name: req.auth.username
        };
        const getCountSQL = sqlCount('news_draflist_view', params);
        const totalRows = await query(getCountSQL, res);

        if (totalRows.length !== 0) {
            const total = totalRows[0].total;
            const head = "SELECT * FROM news_draflist_view";
            const searchSQL = sqlConcat(head, params, 'update_time DESC');
            const draftRows = await query(searchSQL, res);
            res.ok('ok', { data: draftRows, total });
        } else {
            res.ok('ok', { data: [], total: 0 });
        }
    } catch (err) {
        console.error('获取草稿列表失败:', err);
        res.err('获取草稿列表失败: ' + err.message);
    }
};

// 删除草稿/新闻
exports.deleteDraft = async (req, res) => {
    let connection;
    try {
        const news_id = req.query.id;
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [newsResults] = await queryT('SELECT * FROM news_detail WHERE id = ? FOR UPDATE', [news_id], res, connection);
        if (newsResults.length === 0) throw new Error('新闻不存在！');

        await queryT('SELECT * FROM news_checks WHERE news_id = ? FOR UPDATE', [news_id], res, connection);
        await queryT('DELETE FROM news_checks WHERE news_id = ?', [news_id], res, connection);

        await queryT('SELECT * FROM news_comments WHERE news_id = ? FOR UPDATE', [news_id], res, connection);
        await queryT('DELETE FROM news_comments WHERE news_id = ?', [news_id], res, connection);

        await queryT('DELETE FROM news_detail WHERE id = ?', [news_id], res, connection);

        await connection.commit();
        res.ok('删除成功');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('删除草稿失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('删除草稿失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 获取新闻详情
exports.getNewsDetail = async (req, res) => {
    try {
        const news_id = req.query.id;
        const data = await query(
            `SELECT n.*, u.username AS author_name
             FROM news_detail n
                      LEFT JOIN user u ON n.author_id = u.id
             WHERE n.id = ?`,
            [news_id],
            res
        );
        if (data.length === 0) {
            return res.status(404).json({ status: 404, message: '新闻不存在' });
        }
        res.ok('ok', { data: data[0] });
    } catch (err) {
        console.error('获取新闻详情失败:', err);
        res.err('获取新闻详情失败: ' + err.message);
    }
};

// 获取审核列表（用户版）
exports.getCheckList = async (req, res) => {
    try {
        const params = {
            ...req.query,
            author_name: req.auth.username
        };
        const getCountSQL = sqlCount('news_checklist_view', params);
        const totalRows = await query(getCountSQL, res);

        if (totalRows.length !== 0) {
            const total = totalRows[0].total;
            const head = "SELECT * FROM news_checklist_view";
            const searchSQL = sqlConcat(head, params, 'check_state DESC, check_time DESC');
            const draftRows = await query(searchSQL, res);
            res.ok('ok', { data: draftRows, total });
        } else {
            res.ok('ok', { data: [], total: 0 });
        }
    } catch (err) {
        console.error('获取审核列表失败:', err);
        res.err('获取审核列表失败: ' + err.message);
    }
};

// 撤销审核
exports.drawbackCheck = async (req, res) => {
    let connection;
    try {
        const news_id = req.query.id;
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [newsResults] = await queryT('SELECT * FROM news_detail WHERE id = ? FOR UPDATE', [news_id], res, connection);
        if (newsResults.length === 0) throw new Error('新闻不存在！');

        const checkRows = await queryT('SELECT id FROM news_checks WHERE news_id = ? ORDER BY submit_time DESC FOR UPDATE', [news_id], res, connection);
        if (checkRows.length === 0) throw new Error('无审核记录！');

        const info = {
            latest_check_id: checkRows.length === 1 ? null : checkRows[1].id,
            check_state: 1,
            update_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };
        await queryT('UPDATE news_detail SET ? WHERE id = ?', [info, news_id], res, connection);
        await queryT('DELETE FROM news_checks WHERE id = ?', [checkRows[0].id], res, connection);

        await connection.commit();
        res.ok('成功撤销');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('撤销审核失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('撤销审核失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 获取审核列表（管理员版）
exports.getCheckListForManager = async (req, res) => {
    try {
        const getCountSQL = sqlCount('news_checklist_view', req.query);
        const totalRows = await query(getCountSQL, res);

        if (totalRows.length !== 0) {
            const total = totalRows[0].total;
            const head = "SELECT id, title, latest_check_id, submit_time, author_name, sort_id FROM news_checklist_view";
            const searchSQL = sqlConcat(head, { ...req.query, check_state: "2" }, 'submit_time ASC');
            const checkRows = await query(searchSQL, res);
            res.ok('ok', { data: checkRows, total });
        } else {
            res.ok('ok', { data: [], total: 0 });
        }
    } catch (err) {
        console.error('获取管理员审核列表失败:', err);
        res.err('获取管理员审核列表失败: ' + err.message);
    }
};

// 审核通过
exports.agreeCheck = async (req, res) => {
    let connection;
    try {
        const { id, latest_check_id, check_comment } = req.body;
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [newsResults] = await queryT('SELECT * FROM news_detail WHERE id = ? FOR UPDATE', [id], res, connection);
        if (newsResults.length === 0) throw new Error('新闻不存在！');

        const [checkResults] = await queryT('SELECT * FROM news_checks WHERE id = ? FOR UPDATE', [latest_check_id], res, connection);
        if (checkResults.length === 0) throw new Error('审核记录不存在！');

        await queryT('UPDATE news_detail SET check_state = 3, publish_state = 2 WHERE id = ?', [id], res, connection);
        const info = {
            check_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            check_comment,
            check_result: 1
        };
        await queryT('UPDATE news_checks SET ? WHERE id = ?', [info, latest_check_id], res, connection);

        await connection.commit();
        res.ok('已反馈');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('审核通过失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('审核通过失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// ... 前述代码（increaseNewsView 到 agreeCheck）保持不变，略 ...

// 审核不通过
exports.opposeCheck = async (req, res) => {
    let connection;
    try {
        const { id, latest_check_id, check_comment } = req.body;
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [newsResults] = await queryT('SELECT * FROM news_detail WHERE id = ? FOR UPDATE', [id], res, connection);
        if (newsResults.length === 0) throw new Error('新闻不存在！');

        const [checkResults] = await queryT('SELECT * FROM news_checks WHERE id = ? FOR UPDATE', [latest_check_id], res, connection);
        if (checkResults.length === 0) throw new Error('审核记录不存在！');

        await queryT('UPDATE news_detail SET check_state = 4 WHERE id = ?', [id], res, connection);
        const info = {
            check_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            check_comment,
            check_result: 2
        };
        await queryT('UPDATE news_checks SET ? WHERE id = ?', [info, latest_check_id], res, connection);

        await connection.commit();
        res.ok('已反馈');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('审核不通过失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('审核不通过失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 获取发布列表
exports.getPublishList = async (req, res) => {
    try {
        const { publishState, title, author_name, sort_id } = req.query;
        if (!publishState) {
            return res.status(400).json({
                status: 400,
                message: 'publishState is required and should be a valid number'
            });
        }

        let params = [publishState];
        let queryStr = `SELECT id, title, sort_id, author_name, check_time, check_person, publish_state, content
                        FROM news_checklist_view
                        WHERE publish_state = ?`;

        if (title) {
            queryStr += ` AND title LIKE ?`;
            params.push(`%${title}%`);
        }
        if (author_name) {
            queryStr += ` AND author_name LIKE ?`;
            params.push(`%${author_name}%`);
        }
        if (sort_id && sort_id !== "0") {
            queryStr += ` AND sort_id = ?`;
            params.push(sort_id);
        }

        const data = await query(queryStr, params, res);
        res.ok('ok', { data });
    } catch (err) {
        console.error('获取发布列表失败:', err);
        res.status(500).json({
            status: 500,
            message: '获取发布列表失败: ' + err.message
        });
    }
};

// 发布新闻
exports.publishNews = async (req, res) => {
    let connection;
    try {
        const news_id = req.query.id;
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [results] = await queryT('SELECT * FROM news_detail WHERE id = ? FOR UPDATE', [news_id], res, connection);
        if (results.length === 0) throw new Error('新闻不存在！');

        await queryT('UPDATE news_detail SET publish_state = 3 WHERE id = ?', [news_id], res, connection);
        await connection.commit();
        res.ok('发布成功');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('发布新闻失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('发布新闻失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 下线新闻
exports.offlineNews = async (req, res) => {
    let connection;
    try {
        const news_id = req.query.id;
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [results] = await queryT('SELECT * FROM news_detail WHERE id = ? FOR UPDATE', [news_id], res, connection);
        if (results.length === 0) throw new Error('新闻不存在！');

        await queryT('UPDATE news_detail SET publish_state = 4 WHERE id = ?', [news_id], res, connection);
        await connection.commit();
        res.ok('下线成功');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('下线新闻失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('下线新闻失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 删除新闻
exports.deleteNews = async (req, res) => {
    let connection;
    try {
        const news_id = req.query.id;
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [results] = await queryT('SELECT * FROM news_detail WHERE id = ? FOR UPDATE', [news_id], res, connection);
        if (results.length === 0) throw new Error('新闻不存在！');

        await queryT('DELETE FROM news_detail WHERE id = ?', [news_id], res, connection);
        await connection.commit();
        res.ok('删除成功');
    } catch (err) {
        if (connection) await connection.rollback();
        console.error('删除新闻失败:', err);
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            res.err('数据库锁等待超时，请稍后重试');
        } else {
            res.err('删除新闻失败: ' + err.message);
        }
    } finally {
        if (connection) connection.release();
    }
};

// 获取审核记录
exports.getCheckHistory = async (req, res) => {
    try {
        const news_id = req.query.id;
        const data = await query(
            `SELECT id, check_time, check_person, check_comment, check_result, submit_time
             FROM news_checks
             WHERE news_id = ?`,
            [news_id],
            res
        );
        res.ok('ok', { data });
    } catch (err) {
        console.error('获取审核记录失败:', err);
        res.err('获取审核记录失败: ' + err.message);
    }
};