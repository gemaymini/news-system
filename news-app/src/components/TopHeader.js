import React, { useState, useEffect } from 'react';
import AdminStore from '../tstore/adminStore';
import { observer } from 'mobx-react';
import { Layout, Avatar, Dropdown, Menu, Button, Upload, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Header } = Layout;

// 时间组件
const DateTimeDisplay = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <span style={{ color: 'black', fontSize: '15px', fontWeight: 'normal' }}>
      {formatDate(currentDateTime)}
    </span>
  );
};

export default observer(() => {
  const [imageUrl, setImageUrl] = useState(AdminStore.userInfo.image_url);
  const navigate = useNavigate();

  // 使用 useEffect 确保头像同步更新
  useEffect(() => {
    setImageUrl(AdminStore.userInfo.image_url);
  }, [AdminStore.userInfo.image_url]);

  // 上传图片
  const props = {
    name: 'image',
    action: 'http://10.126.84.173:8080/upload/uploadimage',
    headers: { 'Authorization': 'Bearer ' + AdminStore.token },
    onChange(info) {
      if (info.file.status === 'done') {
        AdminStore.requireUserInfo();  // 更新用户信息
        setImageUrl(info.file.response.image_url);  // 更新头像
        message.success('头像更新成功');
      } else if (info.file.status === 'error') {
        message.error('头像更新失败');
      }
    },
  };

  const menu = (
    <Menu
      items={[
        {
          label: (<Button type="text" onClick={() => { navigate('/userinfo/center'); }}>个人中心</Button>),
        },
        {
          label: (
            <Upload {...props}>
              <Button type="text">更新头像</Button>
            </Upload>
          ),
        },
        {
          label: (<Button danger type="text" onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}>退出登录</Button>),
        },
      ]}
    />
  );

  return (
    <Header className="site-layout-background" style={{ padding: 0, backgroundColor: 'white' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        backgroundImage: 'url(https://picsum.photos/1600/90)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '87px',
      }}>
        <span style={{ cursor: 'pointer', fontSize: '20px' }} onClick={() => { AdminStore.setCollapse(); }}>
          {AdminStore.collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
        <span style={{ align: 'center', color: 'black', fontSize: '30px', fontWeight: 'bold', paddingLeft: '100px' }}>新闻发布管理系统</span>
        <DateTimeDisplay />
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ paddingRight: '12px', color: 'black' }}>欢迎回来，{AdminStore.userInfo.username}</span>
          <Dropdown overlay={menu}>
            <Avatar size="large" src={imageUrl} />
          </Dropdown>
        </span>
      </div>
    </Header>
  );
});
