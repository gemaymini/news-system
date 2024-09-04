import React,{useEffect,useState} from 'react'
import AdminStore from '../tstore/adminStore'
import { Layout, Menu } from 'antd';
import { HomeOutlined, TeamOutlined, ToolOutlined, ProfileOutlined, FileSearchOutlined, UploadOutlined, FileDoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';

const { Sider } = Layout;

// 添加图标
const iconList = {
  "home": <HomeOutlined />,
  "user-manage/list": <TeamOutlined />,
  "power-manage": <ToolOutlined />,
  "news-manage": <ProfileOutlined />,
  "check-manage/list": <FileSearchOutlined />,
  "publish-manage": <UploadOutlined />,
  "check-manage": <FileDoneOutlined />,
}

// 传入一个对象，添加 icon 属性，返回新对象
function getItem(item) {
  return {
    ...item,
    icon: iconList[item.key]
  }
}

// 定义了侧边栏标题的样式，包括颜色、字体大小、对齐方式、内边距和边框
const titleStyle = {
  color: 'white',
  fontSize: '20px',
  lineHeight: '20px',
  textAlign: 'center',
  padding: '10px',
  borderBottom: '2px solid #eeeeee'
}

// 侧边栏组件，使用 mobx 的 observer 进行状态监听
export default observer(() => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);

  // 菜单点击事件处理函数，根据点击的菜单项 key 进行页面跳转
  const changeMenu = ({ key }) => {
    navigate(key);
  }

  // 组件挂载时，从 AdminStore 获取菜单模块，并设置菜单项的图标
  useEffect(() => {
    setMenus(AdminStore.modules.menuModules.map(item => getItem(item)));
  }, []);

  return (
    <Sider
      collapsible
      collapsed={AdminStore.collapse}
      style={{
        position: 'sticky', // 使侧边栏在滚动时保持可见
        top: 0,             // 当页面滚动到顶端时，侧边栏粘贴在页面顶部
        height: '100vh',
        width: '107%'
      }}
    >
      <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
        <div style={{...titleStyle}}>新闻发布管理系统</div>
        <div style={{flex: 1, overflow: "auto"}}>
          <Menu
            onClick={changeMenu}
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['4']}
            items={menus}
          />
        </div>
      </div>
    </Sider>
  )
})
