import React from 'react';
import AdminStore from '../../tstore/adminStore';
import { Form, Input, Select, Button, Divider, Row, Col, message } from 'antd';
import { updateUserInfo } from '../../request/admin';

const { Option } = Select;

const UserForm = ({ user, submit }) => (
  <Form
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ width: '50%', margin: 'auto' }}
    onFinish={submit}
    initialValues={{
      username: user.username,
      email: user.email,
      sex: user.sex,
    }}
  >
    <Divider orientation="left">基本信息</Divider>
    
    <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item label="邮箱" name="email">
      <Input />
    </Form.Item>

    <Form.Item label="性别" name="sex">
      <Select>
        <Option value="女">女</Option>
        <Option value="男">男</Option>
        <Option value="">保密</Option>
      </Select>
    </Form.Item>

    <Form.Item label="角色">
      <span>{user.character_name}</span>
    </Form.Item>

    <Form.Item label="注册时间">
      <span>{user.create_time.replace("T", ' ').replace(".000Z", "")}</span>
    </Form.Item>

    <Divider orientation="left">修改密码</Divider>

    <Form.Item
      label="新密码"
      name="password"
      rules={[
        {
          required: true,
          message: '请输入新密码!',
        },
        {
          min: 6,
          message: '密码长度不能小于6个字符!',
        },
      ]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item
      label="确认密码"
      name="confirmPassword"
      dependencies={['password']}
      rules={[
        {
          required: true,
          message: '请确认新密码!',
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('两次输入的密码不匹配!'));
          },
        }),
      ]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{ marginTop: '20px' }}>
      <Button type="primary" htmlType="submit">
        确认修改
      </Button>
    </Form.Item>
  </Form>
);

export default function Center() {
  const handleSubmit = async (value) => {
    const { confirmPassword, ...rest } = value;
    console.log(rest);
    // 更新用户信息，包括新密码
    const res = await updateUserInfo({ ...rest, id: AdminStore.userInfo.id });
    if (res.data.status === 200) {
      AdminStore.requireUserInfo();
      message.success('信息更新成功');
    } else {
      message.error('信息更新失败');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>个人中心</h2>
      <UserForm user={AdminStore.userInfo} submit={handleSubmit} />
    </div>
  );
}
