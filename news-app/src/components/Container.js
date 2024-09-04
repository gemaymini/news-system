import React from 'react'
import {Outlet} from 'react-router-dom' 
// Outlet 是 React Router v6 中的一个组件，它表示嵌套路由的占位符。
// 当访问某个嵌套路由时，Outlet 会渲染匹配的子路由组件。
import { Layout } from 'antd';
const {Content}=Layout
export default function Container() {
  return (
    <Content className="site-layout-background"
        style={{
        margin: '24px 16px',
        padding: 24,
        minHeight: 280,
    }}>
        <Outlet></Outlet>
    </Content>
  )
}
