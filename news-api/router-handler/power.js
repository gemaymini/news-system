const db = require('../db');
const { NodesToTree, filterModuleHasRoles, splitAddAndDelete, childrenInsertParent } = require('../utils/structurehandler');
const { OneToManyInsert, sqlConcat, sqlCount } = require('../utils/sqlhandler');
const { query, queryT } = require('../utils/query');

// 获取角色列表
exports.getCharacters = async (req, res) => {
    try {
        const getCountSQL = sqlCount('characters', req.query);
        const totalRows = await query(getCountSQL, res);
        if (totalRows.length !== 0) {
            const total = totalRows[0].total;
            const head = "SELECT id, name, description, state, `key` FROM characters";
            const searchSQL = sqlConcat(head, req.query);
            const characterRows = await query(searchSQL, res);
            res.ok('ok', {
                data: characterRows,
                total
            });
        } else {
            res.ok('ok', {
                data: [],
                total: 0
            });
        }
    } catch (err) {
        console.error('获取角色列表失败:', err);
        res.err('获取角色列表失败: ' + err.message);
    }
};

// 停用角色
exports.stopCharacter = (req, res) => {
    const id = req.query.id;

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

            queryT('SELECT * FROM characters WHERE id = ? FOR UPDATE', [id], res, connection)
                .then((results) => {
                    if (results.length === 0) {
                        connection.rollback(() => {
                            connection.release();
                            res.err('角色不存在！');
                        });
                        return;
                    }

                    return queryT('UPDATE characters SET state = 0 WHERE id = ?', [id], res, connection);
                })
                .then(() => {
                    return queryT('SELECT id FROM user WHERE character_id = ? FOR UPDATE', [id], res, connection);
                })
                .then((userRows) => {
                    if (userRows.length === 0) return Promise.resolve();

                    const userIds = userRows.map(item => item.id);
                    return queryT('UPDATE user SET character_id = 6 WHERE id IN (?)', [userIds], res, connection);
                })
                .then(() => {
                    connection.commit((err) => {
                        if (err) {
                            connection.rollback(() => {
                                connection.release();
                                console.error('事务提交失败:', err);
                                res.err('事务提交失败: ' + err.message);
                            });
                            return;
                        }
                        connection.release();
                        res.ok('停用成功');
                    });
                })
                .catch((err) => {
                    connection.rollback(() => {
                        connection.release();
                        console.error('停用角色失败:', err);
                        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
                            res.err('数据库锁等待超时，请稍后重试');
                        } else {
                            res.err('停用角色失败: ' + err.message);
                        }
                    });
                });
        });
    });
};

// 恢复角色
exports.aliveCharacter = (req, res) => {
    const id = req.query.id;

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

            queryT('SELECT * FROM characters WHERE id = ? FOR UPDATE', [id], res, connection)
                .then((results) => {
                    if (results.length === 0) {
                        connection.rollback(() => {
                            connection.release();
                            res.err('角色不存在！');
                        });
                        return;
                    }

                    return queryT('UPDATE characters SET state = 1 WHERE id = ?', [id], res, connection);
                })
                .then(() => {
                    connection.commit((err) => {
                        if (err) {
                            connection.rollback(() => {
                                connection.release();
                                console.error('事务提交失败:', err);
                                res.err('事务提交失败: ' + err.message);
                            });
                            return;
                        }
                        connection.release();
                        res.ok('恢复成功');
                    });
                })
                .catch((err) => {
                    connection.rollback(() => {
                        connection.release();
                        console.error('恢复角色失败:', err);
                        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
                            res.err('数据库锁等待超时，请稍后重试');
                        } else {
                            res.err('恢复角色失败: ' + err.message);
                        }
                    });
                });
        });
    });
};

// 获取所有开启的模块
exports.getAllOpenModules = async (req, res) => {
    try {
        const rows = await query('SELECT `key`, `id` AS module_id, `name`, parent_id FROM module', res);
        res.ok('ok', {
            data: NodesToTree(rows, 'module_id', 'parent_id', 0)
        });
    } catch (err) {
        console.error('获取模块失败:', err);
        res.err('获取模块失败: ' + err.message);
    }
};

// 过滤包含权限的模块
exports.getRolesByModule = async (req, res) => {
    try {
        let moduleStr = req.query.moduleStr;
        if (moduleStr === '') return res.err('至少选择一个模块');
        const moduleSQL = "SELECT id AS module_id, `name` AS module_name FROM module WHERE id IN (?)";
        const modules = await query(moduleSQL, [moduleStr.split(',')], res);
        const roleSQL = "SELECT id AS role_id, `name` AS role_name, module_id FROM roles WHERE module_id IN (?)";
        const roles = await query(roleSQL, [moduleStr.split(',')], res);
        res.ok('ok', {
            data: filterModuleHasRoles(modules, roles)
        });
    } catch (err) {
        console.error('获取权限模块失败:', err);
        res.err('获取权限模块失败: ' + err.message);
    }
};

// 添加角色-判断角色是否存在
exports.isNewCharaterExist = async (req, res) => {
    try {
        const { name, key } = req.query;
        const sql = 'SELECT id FROM characters WHERE `name` = ? OR `key` = ?';
        const rows = await query(sql, [name, key], res);
        if (rows.length !== 0) return res.err('角色名称或键已存在！');
        res.ok();
    } catch (err) {
        console.error('检查角色存在失败:', err);
        res.err('检查角色存在失败: ' + err.message);
    }
};

// 添加角色
exports.addCharacter = (req, res) => {
    const input = JSON.parse(req.body.data);
    const { base, roles, modules } = input; // 包含 modules 以支持 character_modules

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

            queryT('SELECT * FROM characters WHERE `name` = ? OR `key` = ? FOR UPDATE', [base.name, base.key], res, connection)
                .then((results) => {
                    if (results.length > 0) {
                        connection.rollback(() => {
                            connection.release();
                            res.err('角色名称或键已存在！');
                        });
                        return;
                    }

                    return queryT('INSERT INTO characters SET ?', [base], res, connection);
                })
                .then((result) => {
                    return queryT('SELECT id FROM characters WHERE `name` = ?', [base.name], res, connection);
                })
                .then((results) => {
                    if (results.length === 0) {
                        connection.rollback(() => {
                            connection.release();
                            res.err('角色插入失败！');
                        });
                        return;
                    }
                    const newId = results[0].id;

                    // 插入角色模块（如果启用）
                    if (modules && modules !== '') {
                        const moduleInsertSQL = OneToManyInsert('character_modules', 'character_id', 'module_id', newId, modules);
                        return queryT(moduleInsertSQL, null, res, connection);
                    }
                    return Promise.resolve();
                })
                .then(() => {
                    // 插入角色权限（如果有）
                    if (roles && roles !== '') {
                        const roleInsertSQL = OneToManyInsert('character_roles', 'character_id', 'role_id', newId, roles);
                        return queryT(roleInsertSQL, null, res, connection);
                    }
                    return Promise.resolve();
                })
                .then(() => {
                    connection.commit((err) => {
                        if (err) {
                            connection.rollback(() => {
                                connection.release();
                                console.error('事务提交失败:', err);
                                res.err('事务提交失败: ' + err.message);
                            });
                            return;
                        }
                        connection.release();
                        res.ok('新建成功');
                    });
                })
                .catch((err) => {
                    connection.rollback(() => {
                        connection.release();
                        console.error('添加角色失败:', err);
                        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
                            res.err('数据库锁等待超时，请稍后重试');
                        } else {
                            res.err('添加角色失败: ' + err.message);
                        }
                    });
                });
        });
    });
};

// 编辑角色-判断角色是否存在
exports.isCharaterExist = async (req, res) => {
    try {
        const { id, name, key } = req.query;
        const oldRow = await query('SELECT name, `key` FROM characters WHERE id = ?', [id], res);
        if (oldRow.length === 0) return res.err('角色不存在！');
        const sql = 'SELECT id FROM characters WHERE (`name` = ? AND `name` != ?) OR (`key` = ? AND `key` != ?)';
        const rows = await query(sql, [name, oldRow[0].name, key, oldRow[0].key], res);
        if (rows.length !== 0) return res.err('角色名称或键已存在！');
        res.ok();
    } catch (err) {
        console.error('检查角色存在失败:', err);
        res.err('检查角色存在失败: ' + err.message);
    }
};

// 编辑角色
exports.updateCharacter = (req, res) => {
    const input = JSON.parse(req.body.data);
    const { base, roles, modules } = input; // 包含 modules 以支持 character_modules
    const id = base.id;

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

            queryT('SELECT * FROM characters WHERE id = ? FOR UPDATE', [id], res, connection)
                .then((results) => {
                    if (results.length === 0) {
                        connection.rollback(() => {
                            connection.release();
                            res.err('角色不存在！');
                        });
                        return;
                    }

                    return queryT('UPDATE characters SET ? WHERE id = ?', [base, id], res, connection);
                })
                .then(() => {
                    // 锁定角色模块记录（如果启用）
                    if (modules && modules !== '') {
                        return queryT('SELECT module_id FROM character_modules WHERE character_id = ? FOR UPDATE', [id], res, connection);
                    }
                    return Promise.resolve([]);
                })
                .then((oldModules) => {
                    if (modules && modules !== '') {
                        const moduleIdsStr = oldModules.map(item => item.module_id).join(',');
                        const moduleSpliter = splitAddAndDelete(moduleIdsStr, modules);
                        const { addStr: addModulesStr, deleteStr: deleteModulesStr } = moduleSpliter;

                        if (deleteModulesStr !== '') {
                            return queryT('DELETE FROM character_modules WHERE character_id = ? AND module_id IN (?)', [id, deleteModulesStr.split(',')], res, connection);
                        }
                    }
                    return Promise.resolve();
                })
                .then(() => {
                    if (modules && modules !== '' && splitAddAndDelete(oldModules.map(item => item.module_id).join(','), modules).addStr !== '') {
                        const addModulesStr = splitAddAndDelete(oldModules.map(item => item.module_id).join(','), modules).addStr;
                        const addModuleSQL = OneToManyInsert('character_modules', 'character_id', 'module_id', id, addModulesStr);
                        return queryT(addModuleSQL, null, res, connection);
                    }
                    return Promise.resolve();
                })
                .then(() => {
                    // 锁定角色权限记录
                    return queryT('SELECT role_id FROM character_roles WHERE character_id = ? FOR UPDATE', [id], res, connection);
                })
                .then((oldRoles) => {
                    const roleIdsStr = oldRoles.map(item => item.role_id).join(',');
                    const roleSpliter = splitAddAndDelete(roleIdsStr, roles);
                    const { addStr: addRolesStr, deleteStr: deleteRolesStr } = roleSpliter;

                    if (deleteRolesStr !== '') {
                        return queryT('DELETE FROM character_roles WHERE character_id = ? AND role_id IN (?)', [id, deleteRolesStr.split(',')], res, connection);
                    }
                    return Promise.resolve();
                })
                .then(() => {
                    const roleSpliter = splitAddAndDelete(oldRoles.map(item => item.role_id).join(','), roles);
                    if (roleSpliter.addStr !== '') {
                        const addRoleSQL = OneToManyInsert('character_roles', 'character_id', 'role_id', id, roleSpliter.addStr);
                        return queryT(addRoleSQL, null, res, connection);
                    }
                    return Promise.resolve();
                })
                .then(() => {
                    connection.commit((err) => {
                        if (err) {
                            connection.rollback(() => {
                                connection.release();
                                console.error('事务提交失败:', err);
                                res.err('事务提交失败: ' + err.message);
                            });
                            return;
                        }
                        connection.release();
                        res.ok('修改成功');
                    });
                })
                .catch((err) => {
                    connection.rollback(() => {
                        connection.release();
                        console.error('编辑角色失败:', err);
                        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
                            res.err('数据库锁等待超时，请稍后重试');
                        } else {
                            res.err('编辑角色失败: ' + err.message);
                        }
                    });
                });
        });
    });
};

// 根据角色 ID 获取模块 ID 和权限 ID
exports.getModuleidAndRoleidByid = async (req, res) => {
    try {
        const id = req.query.character_id;
        const getModuleidsSQL = "SELECT module_id FROM module_view WHERE character_id = ?";
        const moduleArr = await query(getModuleidsSQL, [id], res);
        const getRoleidsSQL = "SELECT role_id FROM character_roles WHERE character_id = ?";
        const roleArr = await query(getRoleidsSQL, [id], res);
        res.ok('ok', {
            moduleArr: moduleArr.map(item => item.module_id),
            roleArr: roleArr.map(item => item.role_id)
        });
    } catch (err) {
        console.error('获取模块和权限 ID 失败:', err);
        res.err('获取模块和权限 ID 失败: ' + err.message);
    }
};

// 删除角色
exports.deleteCharacter = (req, res) => {
    const id = req.query.id;

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

            queryT('SELECT * FROM characters WHERE id = ? FOR UPDATE', [id], res, connection)
                .then((results) => {
                    if (results.length === 0) {
                        connection.rollback(() => {
                            connection.release();
                            res.err('角色不存在！');
                        });
                        return;
                    }

                    return queryT('SELECT * FROM character_modules WHERE character_id = ? FOR UPDATE', [id], res, connection);
                })
                .then(() => {
                    return queryT('DELETE FROM character_modules WHERE character_id = ?', [id], res, connection);
                })
                .then(() => {
                    return queryT('SELECT * FROM character_roles WHERE character_id = ? FOR UPDATE', [id], res, connection);
                })
                .then(() => {
                    return queryT('DELETE FROM character_roles WHERE character_id = ?', [id], res, connection);
                })
                .then(() => {
                    return queryT('SELECT id FROM user WHERE character_id = ? FOR UPDATE', [id], res, connection);
                })
                .then((userRows) => {
                    if (userRows.length === 0) return Promise.resolve();

                    const userIds = userRows.map(item => item.id);
                    return queryT('UPDATE user SET character_id = 6 WHERE id IN (?)', [userIds], res, connection);
                })
                .then(() => {
                    return queryT('DELETE FROM characters WHERE id = ?', [id], res, connection);
                })
                .then((result) => {
                    if (result.affectedRows !== 1) {
                        connection.rollback(() => {
                            connection.release();
                            res.err('删除角色失败');
                        });
                        return;
                    }

                    connection.commit((err) => {
                        if (err) {
                            connection.rollback(() => {
                                connection.release();
                                console.error('事务提交失败:', err);
                                res.err('事务提交失败: ' + err.message);
                            });
                            return;
                        }
                        connection.release();
                        res.ok('删除成功');
                    });
                })
                .catch((err) => {
                    connection.rollback(() => {
                        connection.release();
                        console.error('删除角色失败:', err);
                        if (err.code === 'ER_LOCK_WAIT_TIMEOUT') {
                            res.err('数据库锁等待超时，请稍后重试');
                        } else {
                            res.err('删除角色失败: ' + err.message);
                        }
                    });
                });
        });
    });
};

// 权限列表：获取所有模块和权限
exports.getAllModulesAndRoles = async (req, res) => {
    try {
        const getModuleSQL = "SELECT * FROM module";
        const moduleRows = await query(getModuleSQL, res);
        const getRoleSQL = "SELECT * FROM roles";
        const roleRows = await query(getRoleSQL, res);
        const moduleWithRoles = childrenInsertParent(moduleRows, 'id', roleRows, 'module_id', 'roles');
        res.ok('ok', {
            data: NodesToTree(moduleWithRoles, 'id', 'parent_id', 0)
        });
    } catch (err) {
        console.error('获取模块和权限失败:', err);
        res.err('获取模块和权限失败: ' + err.message);
    }
};

// 权限列表：停用模块
exports.stopModule = (req, res) => {
    res.ok('暂不支持');
};

// 权限列表：恢复模块
exports.aliveModule = (req, res) => {
    res.ok('暂不支持');
};

