
const db=require('../db')
const {sqlConcat,sqlCount}=require('../utils/sqlhandler')

//获取用户列表
exports.getList=(req,res)=>{
    const head="SELECT id,username,sex,email,character_name,character_id,create_time,state FROM userlist_view"
    db.query(sqlCount('userlist_view',req.query),(err,result)=>{
        if(err)return res.err(err)
        const total=result[0].total
        if(total){
            db.query(sqlConcat(head,req.query,'create_time desc'),(err,results)=>{
                if(err)return res.err(err)
                res.ok('ok',{
                    data:results,
                    total
                })
            })
        }else{
            res.ok('ok',{
                data:[],
                total
            })
        }
    })
}

// 获取角色列表
exports.getCharactersOptions=(req,res)=>{
    const getCharactersOptionsSQL="SELECT id,`name` FROM characters;"
    db.query(getCharactersOptionsSQL,(err,results)=>{
        if(err)return res.err(err)
        res.ok('ok',{
            data:results,
        })
    })
}

// 添加用户
exports.addUser=(req,res)=>{
    const addUserSQL='insert into user set ?'
    db.query(addUserSQL,[req.body],(err,data)=>{
        if(err) return res.err(err)
        res.ok('添加成功！')
    })
}

// 修改角色，仅限修改角色
exports.updateUser=(req,res)=>{
    const updateUserSQL=`update user set character_id=${req.body.character_id} where id=${req.body.id}`
    db.query(updateUserSQL,(err,data)=>{
        if(err) return res.err(err)
        res.ok('更改成功！')
    })
}

// 删除用户
exports.deleteUser=(req,res)=>{
    const SQL=`delete from user where id=?`
    db.query(SQL,req.query.id,(err,data)=>{
        if(err) return res.err(err)
        res.ok('删除成功')
    })
}

// 停用角色
exports.stopUser=(req,res)=>{
    const SQL=`update user set state=0 where id=?`
    db.query(SQL,req.query.id,(err,data)=>{
        if(err) return res.err(err)
        res.ok('停用成功')
    })
}

// 恢复用户
exports.aliveUser=(req,res)=>{
    const SQL=`update user set state=1 where id=?`
    db.query(SQL,req.query.id,(err,data)=>{
        if(err) return res.err(err)
        res.ok('恢复成功')
    })
}

// 获取用户信息
// router-handler/user.js
exports.getUserInfo = (req, res) => {
    const userId = req.params.id;

    const getUserSQL = `
        SELECT
            u.username,
            u.image_url,
            u.sex,
            u.email,
            u.create_time,
            u.state,
            c.name AS character_name
        FROM user u
                 LEFT JOIN characters c ON u.character_id = c.id
        WHERE u.id = ?
    `;

    const getNewsStatsSQL = `
        SELECT
            COUNT(*) as newsCount,
            COALESCE(SUM(likes), 0) as likesCount,
            COALESCE(SUM(visits), 0) as viewsCount
        FROM news_detail
        WHERE author_name = (SELECT username FROM user WHERE id = ?) AND publish_state = 3
    `;

    const getTopNewsSQL = `
        SELECT
            id,
            title,
            create_time,
            visits,
            likes,
            sort_id
        FROM news_detail
        WHERE author_name = (SELECT username FROM user WHERE id = ?) AND publish_state = 3
        ORDER BY visits DESC, likes DESC
        LIMIT 5
    `;

    db.query(getUserSQL, [userId], (err, userResult) => {
        if (err) {
            console.error('查询用户信息失败:', err);
            return res.status(500).json({ status: 500, message: '数据库错误', error: err });
        }
        if (userResult.length === 0) {
            return res.status(404).json({ status: 404, message: '用户不存在' });
        }

        const userData = userResult[0];

        db.query(getNewsStatsSQL, [userId], (err, statsResult) => {
            if (err) {
                console.error('查询新闻统计失败:', err);
                return res.status(500).json({ status: 500, message: '数据库错误', error: err });
            }

            db.query(getTopNewsSQL, [userId], (err, newsResult) => {
                if (err) {
                    console.error('查询热门新闻失败:', err);
                    return res.status(500).json({ status: 500, message: '数据库错误', error: err });
                }

                const userInfo = {
                    username: userData.username,
                    image_url: userData.image_url,
                    sex: userData.sex,
                    email: userData.email,
                    create_time: userData.create_time,
                    state: userData.state,
                    character_name: userData.character_name,
                    newsCount: statsResult[0].newsCount || 0,
                    likesCount: statsResult[0].likesCount || 0,
                    viewsCount: statsResult[0].viewsCount || 0,
                    topNews: newsResult // 添加热门新闻数据
                };

                res.status(200).json({ status: 200, message: 'OK', data: userInfo });
            });
        });
    });
};