const db = require('../db');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { NodesToTree } = require('../utils/structurehandler');
const fs = require('fs');
const path = require('path');

// 注册
exports.register = (req, res) => {
    const username = req.body.username;
    const userData = req.body;

    // 获取连接并开始事务
    db.getConnection((err, connection) => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.err('数据库连接失败: ' + err.message);
        }

        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                console.error('事务启动失败:', err);
                return res.err('事务启动失败: ' + err.message);
            }

            // 锁定 user 表中可能的用户名记录
            const isExistSQL = 'SELECT * FROM user WHERE username = ? FOR UPDATE';
            connection.query(isExistSQL, [username], (err, results) => {
                if (err) {
                    connection.rollback(() => {
                        connection.release();
                        console.error('查询用户名失败:', err);
                    });
                    return res.err('查询用户名失败: ' + err.message);
                }

                if (results.length === 1) {
                    connection.rollback(() => connection.release());
                    return res.err('用户已存在！');
                }

                // 插入新用户
                const addUserSQL = 'INSERT INTO user SET ?';
                connection.query(addUserSQL, userData, (err, results) => {
                    if (err) {
                        connection.rollback(() => {
                            connection.release();
                            console.error('注册失败:', err);
                        });
                        return res.err('注册失败: ' + err.message);
                    }

                    if (results.affectedRows !== 1) {
                        connection.rollback(() => connection.release());
                        return res.err('注册失败');
                    }

                    // 提交事务
                    connection.commit((err) => {
                        if (err) {
                            connection.rollback(() => {
                                connection.release();
                                console.error('事务提交失败:', err);
                            });
                            return res.err('事务提交失败: ' + err.message);
                        }
                        connection.release();
                        res.ok('注册成功');
                    });
                });
            });
        });
    });
};

// 登录
exports.login = (req, res) => {
    const getInfoByNameSQL = 'SELECT * FROM user WHERE username = ? AND state = 1';
    db.query(getInfoByNameSQL, req.body.username, (err, results) => {
        if (err) {
            console.log('登录错误:', err);
            return res.err('登录失败: ' + err.message);
        }

        if (results.length !== 1) return res.err('用户不存在！');
        const comparePassword = results[0].password === req.body.password;
        if (!comparePassword) return res.err('密码错误！');
        const token = jwt.sign({ ...results[0], password: '' }, config.jwtSecretKey, {
            expiresIn: config.expiresIn
        });
        res.ok('ok', { token });
    });
};

// 根据角色获取模块和权限
exports.getModulesAndRolesById = (req, res) => {
    const getModuleSQL = 'SELECT parent_id, module_id, label, `key`, menu FROM module_view WHERE character_id = ?';
    const character_id = req.auth.character_id;
    db.query(getModuleSQL, character_id, (err, results) => {
        if (err) return res.err('查询模块失败: ' + err.message);
        const routerModules = results;
        const menuModules = NodesToTree(routerModules.filter(item => item.menu === 1), 'module_id', 'parent_id', 0);
        const getOperationSQL = 'SELECT role_key FROM character_roles_view WHERE character_id = ?';
        db.query(getOperationSQL, character_id, (err, results) => {
            if (err) return res.err('查询权限失败: ' + err.message);
            res.ok('ok', {
                data: {
                    menuModules,
                    operations: results.map(item => item.role_key),
                    routerModules
                }
            });
        });
    });
};

// 根据 id 获取用户信息
exports.getUserInfo = (req, res) => {
    const getInfoByIdSQL = 'SELECT u.*, c.`name` AS character_name, c.`key` AS character_key FROM user u JOIN characters c ON c.id = u.character_id WHERE u.id = ?';
    db.query(getInfoByIdSQL, req.auth.id, (err, results) => {
        if (err) return res.err('查询用户信息失败: ' + err.message);
        res.ok('ok', {
            data: { ...results[0], password: '' }
        });
    });
};

// 更新用户信息
exports.updateUserInfo = (req, res) => {
    const oldUsername = req.auth.username;
    const newUsername = req.body.username;
    const userId = req.auth.id;
    const userData = req.body;

    // 获取连接并开始事务
    db.getConnection((err, connection) => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.err('数据库连接失败: ' + err.message);
        }

        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                console.error('事务启动失败:', err);
                return res.err('事务启动失败: ' + err.message);
            }

            // 锁定当前用户记录
            const lockUserSQL = 'SELECT * FROM user WHERE id = ? FOR UPDATE';
            connection.query(lockUserSQL, [userId], (err) => {
                if (err) {
                    connection.rollback(() => {
                        connection.release();
                        console.error('锁定用户记录失败:', err);
                    });
                    return res.err('锁定用户记录失败: ' + err.message);
                }

                // 检查新用户名是否已被占用
                const selectBeforeUpdateSQL = 'SELECT username FROM user WHERE username = ? AND username <> ? FOR UPDATE';
                connection.query(selectBeforeUpdateSQL, [newUsername, oldUsername], (err, results) => {
                    if (err) {
                        connection.rollback(() => {
                            connection.release();
                            console.error('查询用户名失败:', err);
                        });
                        return res.err('查询用户名失败: ' + err.message);
                    }

                    if (results.length === 1) {
                        connection.rollback(() => connection.release());
                        return res.err('用户已存在！');
                    }

                    // 更新用户信息
                    const updateUserSQL = 'UPDATE user SET ? WHERE id = ?';
                    connection.query(updateUserSQL, [userData, userId], (err, results) => {
                        if (err) {
                            connection.rollback(() => {
                                connection.release();
                                console.error('修改失败:', err);
                            });
                            return res.err('修改失败: ' + err.message);
                        }

                        if (results.affectedRows !== 1) {
                            connection.rollback(() => connection.release());
                            return res.err('修改失败');
                        }

                        // 提交事务
                        connection.commit((err) => {
                            if (err) {
                                connection.rollback(() => {
                                    connection.release();
                                    console.error('事务提交失败:', err);
                                });
                                return res.err('事务提交失败: ' + err.message);
                            }
                            connection.release();
                            res.ok('修改成功');
                        });
                    });
                });
            });
        });
    });
};

// 上传头像
exports.uploadImage = (req, res) => {
    // 检查是否上传了文件
    if (!req.file) {
        return res.err('没有上传文件');
    }

    const newImageUrl = 'http://10.126.95.2:8080' + '/Uploads/' + req.file.filename;
    const userId = req.auth.id;
    const defaultImageUrl = 'http://10.126.95.2:8080/uploads/default_image.jpeg';

    // 获取连接并开始事务
    db.getConnection((err, connection) => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.err('数据库连接失败: ' + err.message);
        }

        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                console.error('事务启动失败:', err);
                return res.err('事务启动失败: ' + err.message);
            }

            // 锁定用户记录
            const selectImgSQL = 'SELECT image_url FROM user WHERE id = ? FOR UPDATE';
            connection.query(selectImgSQL, [userId], (err, results) => {
                if (err) {
                    connection.rollback(() => {
                        connection.release();
                        console.error('查询当前头像路径失败:', err);
                    });
                    return res.err('查询当前头像路径失败: ' + err.message);
                }

                let oldImageUrl = results.length > 0 ? results[0].image_url : null;

                // 更新数据库中的头像路径
                const updateImgSQL = 'UPDATE user SET image_url = ? WHERE id = ?';
                connection.query(updateImgSQL, [newImageUrl, userId], (err, results) => {
                    if (err) {
                        connection.rollback(() => {
                            connection.release();
                            console.error('头像更新失败:', err);
                        });
                        return res.err('头像更新失败: ' + err.message);
                    }

                    if (results.affectedRows !== 1) {
                        connection.rollback(() => connection.release());
                        return res.err('头像更新失败');
                    }

                    // 如果旧头像存在且不是默认头像，删除旧头像文件
                    if (oldImageUrl && oldImageUrl !== defaultImageUrl) {
                        const oldImagePath = path.join(__dirname, '../Uploads/', path.basename(oldImageUrl));
                        fs.unlink(oldImagePath, (err) => {
                            if (err) {
                                console.error('删除旧头像文件失败:', err);
                                // 不回滚事务，因为数据库已更新成功
                            }

                            // 提交事务
                            connection.commit((err) => {
                                if (err) {
                                    connection.rollback(() => {
                                        connection.release();
                                        console.error('事务提交失败:', err);
                                    });
                                    return res.err('事务提交失败: ' + err.message);
                                }
                                connection.release();
                                res.ok('上传成功！', { image_url: newImageUrl });
                            });
                        });
                    } else {
                        // 无旧头像或旧头像是默认头像，直接提交
                        connection.commit((err) => {
                            if (err) {
                                connection.rollback(() => {
                                    connection.release();
                                    console.error('事务提交失败:', err);
                                });
                                return res.err('事务提交失败: ' + err.message);
                            }
                            connection.release();
                            res.ok('上传成功！', { image_url: newImageUrl });
                        });
                    }
                });
            });
        });
    });
};