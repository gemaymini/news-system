import React ,{ useEffect }from 'react';
import { Tabs, Table, Button, Form, Input, Select, Tag } from 'antd';
import { getPublishList, publishNews, offlineNews } from '../../request/publish';
import NewsStore from '../../tstore/newsStore';
import AdminStore  from '../../tstore/adminStore';

export default function PublishList() {
  const [list, setList] = React.useState([]);
  const [publishState, setPublishState] = React.useState(2);
  const [searchForm] = Form.useForm();

  React.useEffect(() => {
    requirePublishList(publishState);
  }, [publishState]);

  useEffect(() => {
    NewsStore.requireSortList();
  }, []);


  const requirePublishList = async (publishState, searchValues = {}) => {
    console.log('请求参数:', { publishState, ...searchValues }); // 调试
    const res = await getPublishList({ publishState, ...searchValues });
    console.log('请求结果:', res.data.data); // 调试
    setList(res.data.data);
  };
  
  const handleOperation = async (type, id) => {
    let res = type === 1 ? await publishNews({ id }) : await offlineNews({ id });
    if (res.data.status === 200) {
      requirePublishList(publishState);
    }
  };

  const onSearch = (values) => {
    console.log('搜索参数:', values); // 调试
    requirePublishList(publishState, values);
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      align: 'center',
      render: (text, record) => <a href={`#/news-manage/preview/${record.id}`}>{text}</a>
    },
    {
      title: '作者',
      dataIndex: 'author_name',
      align: 'center',
    },
    {
      title: '类别',
      dataIndex: 'sort_id',
      align: 'center',
      render: text => <Tag color={NewsStore.sortList.find(item => item.id === text)?.color}>{NewsStore.sortList.find(item => item.id === text)?.name}</Tag>
    },
    {
      title: '审核人',
      dataIndex: 'check_person',
      align: 'center',
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      render: (text, record) => {
        if(AdminStore.modules.operations.find(item => item === 'publishUpdate')){
          if (record.publish_state === 2) {
            return <Button type="primary" onClick={() => { handleOperation(1, record.id); }}>发布</Button>;
          }
          if (record.publish_state === 3) {
            return <Button type="primary" danger onClick={() => { handleOperation(2, record.id); }}>下线</Button>;
          }
          if (record.publish_state === 4) {
            return <Button type="primary" onClick={() => { handleOperation(1, record.id); }}>重新上线</Button>;
          }
        }else{
          return <Button type="primary" disabled>没有操作</Button>;
        }
      }
    },
  ];

  return (
    <div>
      <Form form={searchForm} layout="inline" onFinish={onSearch} style={{ marginBottom: '16px' }}>
        <Form.Item label="标题" name="title">
          <Input placeholder="输入标题" />
        </Form.Item>
        <Form.Item label="作者" name="author_name">
          <Input placeholder="输入作者" />
        </Form.Item>
        <Form.Item label="类别" name="sort_id">
          <Select placeholder="选择类别" allowClear>
            <Select.Option value={0}>所有类别</Select.Option>
            {NewsStore.sortList.map(item => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">搜索</Button>
        </Form.Item>
      </Form>
      <Tabs defaultActiveKey={publishState.toString()} onChange={(key) => { setPublishState(Number(key)); }}>
        <Tabs.TabPane tab="待发布" key="2" />
        <Tabs.TabPane tab="已发布" key="3" />
        <Tabs.TabPane tab="已下线" key="4" />
      </Tabs>
      <Table
        key={publishState}
        rowKey={item => item.id}
        columns={columns}
        dataSource={list ? list : []}
        pagination={false}
      />
    </div>
  );
}
