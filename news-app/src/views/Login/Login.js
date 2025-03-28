import React, { useState } from 'react';
import AdminStore from '../../tstore/adminStore';
import { Form, Input, Button, Card, Typography, Layout, Space } from 'antd';
import { UserOutlined, LockOutlined, GlobalOutlined, FileTextOutlined } from '@ant-design/icons';
import { registerRequest } from '../../request/admin';
import './Login.css'; // Updated CSS file

const { Title, Text } = Typography;
const { Header, Footer, Content } = Layout;

export default function Login() {
  const [tab, setTab] = useState(1);

  async function handleRegister(value) {
    const res = await registerRequest(value);
    if (res.data.status === 200) {
      setTab(1);
    }
  }

  function changeTab(type) {
    setTab(type);
  }

  return (
    <Layout className="login-layout">
      {/* Header */}
      <Header className="login-header">
        <div className="logo">
          <GlobalOutlined style={{ fontSize: '24px', color: '#fff' }} />
          <Title level={3} style={{ color: '#fff', display: 'inline-block', marginLeft: '10px' }}>
            新闻管理系统
          </Title>
        </div>
      </Header>

      {/* Content */}
      <Content className="login-content">
        <div className="welcome-section">
          <Title level={2} className="welcome-title">欢迎使用新闻管理系统</Title>
          <Text className="welcome-text">管理您的新闻内容，随时随地发布最新资讯</Text>
        </div>

        {/* Login Card */}
        <Card className="login-card">
          <div className="login-container">
            <Title level={3} className="login-title">{tab === 1 ? '登录' : '注册'}</Title>
          </div>
          {tab === 1 ? (
            <LoginTab
              handleLogin={(value) => AdminStore.requireLogin(value)}
              changeTab={changeTab}
            />
          ) : (
            <RegisterTab handleRegister={handleRegister} changeTab={changeTab} />
          )}
        </Card>

      </Content>

      {/* Footer */}
      <Footer className="login-footer">
        <Space>
          <a href="/about" title="关于我们">关于我们</a>
          <a href="/contact" title="联系我们">联系我们</a>
          <a href="/privacy" title="隐私政策">隐私政策</a>
        </Space>
        <div style={{ marginTop: '0px' }}>
          © 2025 新闻管理系统. 版权所有.
        </div>
      </Footer>
    </Layout>
  );
}

function LoginTab({ handleLogin, changeTab }) {
  return (
    <Form onFinish={handleLogin} className="login-form" aria-label="登录表单">
      <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
        <Input
          prefix={<UserOutlined />}
          placeholder="用户名"
          size="large"
          className="centered-input"
          aria-label="用户名输入框"
        />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="密码"
          size="large"
          className="centered-input"
          aria-label="密码输入框"
        />
      </Form.Item>
      <Form.Item>
        <Button className="login-button" size="large" htmlType="submit">
          登录
        </Button>
        <div >
          <span className="footer-text">没有账号？</span>
          <Button type="link" className="register-link" onClick={() => changeTab(2)}>
            马上注册
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}

function RegisterTab({ handleRegister, changeTab }) {
  return (
    <Form onFinish={handleRegister} className="login-form" aria-label="注册表单">
      <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
        <Input
          prefix={<UserOutlined />}
          placeholder="用户名"
          size="large"
          className="centered-input"
          aria-label="用户名输入框"
        />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="密码"
          size="large"
          className="centered-input"
          aria-label="密码输入框"
        />
      </Form.Item>
      <Form.Item>
        <Button className="login-button" size="large" htmlType="submit">
          注册
        </Button>
        <div >
          <span className="footer-text">已有账号？</span>
          <Button type="link" className="register-link" onClick={() => changeTab(1)}>
            返回登录
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}