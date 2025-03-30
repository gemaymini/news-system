import React from 'react';
import AdminStore from '../tstore/adminStore';
import { Empty } from 'antd';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../views/Login/Login';
import Manage from '../views/Manage';
import NotFound from '../views/NotFound';
import Home from '../views/Home';
import UserList from '../views/userManage/UserList';
import CharacterList from '../views/powerManage/characterList';
import RoleList from '../views/powerManage/roleList';
import DraftEdit from '../views/newsManage/DraftEdit';
import DratfList from '../views/newsManage/DratfList';
import NewsSort from '../views/newsManage/NewsSort';
import CheckList from '../views/checkManage/CheckList';
import PublishList from '../views/publishManage/PublishList';
import PreView from '../views/newsManage/PreView';
import Center from '../views/userInfo/Center';
import CheckManage from '../views/checkManage/CheckManage';
import UserInfo from '../views/userInfo/UserInfo'; // 引入 UserInfo 组件

const pathRouterMap = {
    "home": <Home />,
    "user-manage/list": <UserList />,
    "power-manage": <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无可操作模块" />,
    "power-manage/characterlist": <CharacterList />,
    "power-manage/rolelist": <RoleList />,
    "news-manage": <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无可操作模块" />,
    "news-manage/createdraft": <DraftEdit />,
    "news-manage/sort": <NewsSort />,
    "news-manage/draft": <DratfList />,
    "news-manage/draft/:id": <DraftEdit />,
    "news-manage/preview/:id": <PreView />,
    "check-manage": <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无可操作模块" />,
    "check-manage/list": <CheckList />,
    "check-manage/check": <CheckManage />,
    "publish-manage": <PublishList />,
    // 可选：如果想通过 pathRouterMap 动态管理，也可以在此添加
    "userinfo/:id": <UserInfo />,
};

export default function IndeRouter() {
    return (
        <HashRouter>
            <Routes>
                <Route key="/" path="/" element={<RequireAuth><Manage /></RequireAuth>}>
                    <Route index element={<Home />} key="indexhome" />
                    <Route path="/userinfo/center" element={<Center />} key="userinfo/center" />
                    {/* 显式添加 /userinfo/:id 路由 */}
                    <Route path="/userinfo/:id" element={<UserInfo />} key="userinfo/:id" />
                    {/* 动态路由映射 */}
                    {AdminStore.modules.routerModules?.map((item) => (
                        <Route path={item.key} element={pathRouterMap[item.key]} key={item.key} />
                    ))}
                </Route>
                <Route path="/login" element={<Login />} key="/login" />
                <Route path="*" element={<NotFound />} key="/notfound" />
            </Routes>
        </HashRouter>
    );
}

function RequireAuth({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
}