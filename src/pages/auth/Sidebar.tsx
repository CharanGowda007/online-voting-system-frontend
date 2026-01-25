import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    UserAddOutlined,
    UserDeleteOutlined,
    EditOutlined,
    BarChartOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem(<Link to="/register">New Voter Registration</Link>, '1', <UserAddOutlined />),
    getItem('Deletion Voter', '2', <UserDeleteOutlined />),
    getItem('Correction of Voter', '3', <EditOutlined />),
    getItem('Election Results', '4', <BarChartOutlined />),
    getItem('Past and Upcoming Elections', '5', <CalendarOutlined />),
];

const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={items}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'Admin' }, { title: 'Dashboard' }]} />
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        Hello
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Online Voting System ©{new Date().getFullYear()}
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Sidebar;
