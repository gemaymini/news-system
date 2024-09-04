import React, { useEffect } from 'react';
import { Steps, Form, Input, Modal, Button } from 'antd';
import { ReconciliationOutlined } from '@ant-design/icons';
import { useStores } from '../../tstore/useStores';
import { observer } from 'mobx-react';
import { addNewsSort, updateNewsSort } from '../../request/news';

// 样式对象
const formStyle = { margin: "0 4em" };
const contentStyle = { margin: '2em 0' };
const footerStyle = { textAlign: 'right' };

// 步骤条
const steps = [
    {
        title: '基本信息',
        icon: <ReconciliationOutlined />
    }
];

export default observer((props) => {
    const { NewsStore } = useStores();
    const [form] = Form.useForm();

    // 初始化模态框数据
    useEffect(() => {
        if (props.info === "" && props.isVisible) {
            form.resetFields();
        } else if (props.info !== "") {
            const info = JSON.parse(props.info);
            // 设置基本信息，并禁用分类ID输入框
            form.setFieldsValue({
                "id": info.id,  // 确保ID正确显示
                "name": info.name,
                "color": info.color,
            });
        }
    }, [props.info, form, props.isVisible]);

    const handleSubmit = async () => {
        let data = {
            name: form.getFieldValue('name'),
            id: form.getFieldValue('id'),
            color: form.getFieldValue('color'),
        };

        // 判断是新增还是编辑
        let res;
        if (props.info === "") {
            res = await addNewsSort(data);
        } else {
            res = await updateNewsSort(data);
        }

        if (res.data.status === 200) {
            NewsStore.requireSortList(); // 更新分类列表
            props.close('ok');
        }
    };

    return (
        <Modal
            title={props.info === "" ? "添加分类" : "编辑分类"}
            visible={props.isVisible}
            footer={null}
            onCancel={() => props.close('cancel')}
        >
            <Steps current={0}>
                {steps.map(item => (
                    <Steps.Step key={item.title} title={item.title} icon={item.icon} />
                ))}
            </Steps>

            {/* 展示区域 */}
            <div style={{ ...contentStyle }}>
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ ...formStyle }}
                    form={form}
                >
                    
                    <Form.Item label="分类ID" name="id">
                        {props.info === "" ?<Input disabled placeholder="分类ID由系统自动分配" />:<Input disabled placeholder={props.info.id} />}
                    </Form.Item>
                    <Form.Item label="分类名称" name="name" rules={[{ required: true }]}>
                        <Input placeholder="请输入分类名称" />
                    </Form.Item>
                    <Form.Item label="标签颜色" name="color" rules={[{ required: true }]}>
                        <Input placeholder="请输入颜色值，例如 #ff0000 或者 red" />
                    </Form.Item>
                </Form>
            </div>

            {/* 操作区域 */}
            <div style={{ ...footerStyle }}>
                <Button type="default" onClick={() => props.close('cancel')} style={{ marginRight: '1em' }}>
                    取消
                </Button>
                <Button type="primary" onClick={handleSubmit}>
                    提交
                </Button>
            </div>
        </Modal>
    );
});
