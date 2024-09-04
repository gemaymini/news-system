import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import NewsStore from '../../tstore/newsStore';
import { observer } from 'mobx-react';

const CheckManageSearchComponent = observer(({ onSearch }) => {
    return (
        <Form layout="inline" style={{ marginBottom: '1em' }} onFinish={onSearch}>
            <Form.Item label="标题" name="title">
                <Input placeholder="请输入标题" />
            </Form.Item>
            <Form.Item label="作者" name="author_name">
                <Input placeholder="请输入作者" />
            </Form.Item>
            <Form.Item label="类别" name="sort_id" style={{ width: '220px' }}>
                <Select placeholder="选择类别">
                    <Select.Option value="0">所有类型</Select.Option> {/* 添加“所有类型”选项 */}
                    {
                        NewsStore.sortList.map(item =>
                            <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                        )
                    }
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    查询
                </Button>
            </Form.Item>
        </Form>
    );
});

export default CheckManageSearchComponent;
