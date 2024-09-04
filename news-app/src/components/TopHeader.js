import React, { useState, useEffect } from 'react'
import AdminStore from '../tstore/adminStore'
import { observer } from 'mobx-react';
import { Layout, Avatar, Dropdown, Menu, Button, Upload, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Header } = Layout

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
}

export default observer(() => {
  const [imageUrl, setimageUrl] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    setimageUrl(AdminStore.userInfo.image_url)
  }, [imageUrl]);

  //上传图片
  const props = {
    name: 'image',
    action: 'http://localhost:8080/upload/uploadimage',
    headers: { 'Authorization': 'Bearer ' + AdminStore.token },
    onChange(info) {
      if (info.file.status === 'done') {
        AdminStore.requireUserInfo()
        setimageUrl(info.file.response.image_url)
        message.success('更新成功');
      }
    }
  };

  const menu = (
    <Menu
      items={[
        {
          label: (<Button type="text" onClick={() => { navigate('/userinfo/center') }}>个人中心</Button>),
        },
        {
          label: (
            <Upload {...props} >
              <Button type="text">更新头像</Button>
            </Upload>
          ),
        },
        {
          label: (<Button danger type="text" onClick={() => {
            localStorage.clear()
            navigate('/login')
          }}>退出登录</Button>),
        }
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
        <span style={{ cursor: 'pointer', fontSize: '20px' }} onClick={() => { AdminStore.setCollapse() }}>
          {
            AdminStore.collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
          }
        </span>
        <span style={{ aligin: 'center', color: 'black', fontSize: '30px', fontWeight: 'bold', paddingLeft: '100px' }}>新闻发布管理系统</span> {/* 中间的标题，可以换成其他内容 */}
        <DateTimeDisplay /> {/* 日期和时间组件 */}
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ paddingRight: '12px', color: 'black' }}>欢迎回来，{AdminStore.userInfo.username}</span>
          <Dropdown overlay={menu}>
            <Avatar size="large" src={imageUrl} />
          </Dropdown>
        </span>
      </div>
    </Header>
  )
})
