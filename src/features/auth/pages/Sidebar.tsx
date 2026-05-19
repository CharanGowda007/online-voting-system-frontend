import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button, Avatar, Modal, Popover } from 'antd';
import {
    UserAddOutlined,
    UserDeleteOutlined,
    EditOutlined,
    BarChartOutlined,
    CalendarOutlined,
    LogoutOutlined,
    DashboardOutlined,
    SolutionOutlined,
    ClusterOutlined,
    KeyOutlined,
    UsergroupAddOutlined,
    FileSearchOutlined,
    SafetyCertificateOutlined,
    SearchOutlined,
    BellOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { AuthService } from '../api/auth.service';
import { Storage } from '../../../shared/utils/storage-util';
import './LandingPage.css'; // Reuse the premium CSS layout

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    key: string;
    badge?: string;
}

const getNavItems = (role: string): NavItem[] => {
    const baseItems: NavItem[] = [
        { label: 'Dashboard', path: '/dashboard', icon: <DashboardOutlined />, key: 'dashboard' },
    ];

    if (role === 'SUPER_ADMIN' || role === 'Super Admin' || role === 'ADMIN') {
        return [
            ...baseItems,
            { label: 'Post Details', path: '/dashboard/post-details', icon: <ClusterOutlined />, key: 'post_details' },
            { label: 'Post Person Mapping', path: '/dashboard/post-person-mapping', icon: <SolutionOutlined />, key: 'mapping' },
            { label: 'Role Creation', path: '/dashboard/roles', icon: <KeyOutlined />, key: 'roles' },
            { label: 'Users Details', path: '/dashboard/users', icon: <UsergroupAddOutlined />, key: 'users' },
        ];
    }

    if (role === 'APPLICANT') {
        return [
            ...baseItems,
            { label: 'Application Status', path: '/dashboard/application-status', icon: <FileSearchOutlined />, key: 'status' },
            { label: 'Voter Registration', path: '/dashboard/voter-registration', icon: <UserAddOutlined />, key: 'voter_registration' },
        ];
    }

    return [
        ...baseItems,
        { label: 'New Voter Registration', path: '/dashboard/voter-registration', icon: <UserAddOutlined />, key: 'voter_registration', badge: 'New' },
        { label: 'Deletion Voter', path: '/dashboard/deletion', icon: <UserDeleteOutlined />, key: 'deletion' },
        { label: 'Correction of Voter', path: '/dashboard/correction', icon: <EditOutlined />, key: 'correction' },
        { label: 'Election Results', path: '/dashboard/results', icon: <BarChartOutlined />, key: 'results', badge: 'Live' },
        { label: 'Upcoming Elections', path: '/dashboard/elections', icon: <CalendarOutlined />, key: 'elections' },
    ];
};

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [userRole, setUserRole] = useState<string>('USER');
    const [userInfo, setUserInfo] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        // Check sessionStorage first (tab-specific), then localStorage
        const token = Storage.session.get("online voting system") || 
                      Storage.local.get("online voting system");
                      
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const role = payload.auth || payload.role || payload.userType || 'USER';
                setUserRole(role);

                // Extract User ID and Name
                const id = payload.loginId || payload.userId || 'N/A';
                const firstName = payload.firstName || '';
                const lastName = payload.lastName || '';
                const name = firstName ? `${firstName} ${lastName}`.trim() : (payload.role || 'User');
                setUserInfo({ id, name });
            } catch (e) {
                console.error("Error decoding token", e);
            }
        } else {
            // If no token found in either, redirect to landing
            navigate('/');
        }
    }, [navigate]);

    const navItems = getNavItems(userRole);

    const handleLogout = () => {
        Modal.confirm({
            title: 'Logout Confirmation',
            content: 'Are you sure you want to logout?',
            okText: 'Yes, Logout',
            cancelText: 'Cancel',
            okButtonProps: { danger: true },
            onOk: () => {
                AuthService.logout();
                navigate('/');
            }
        });
    };

    const popoverContent = (
        <div className="user-popover-content" style={{ padding: '4px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                    <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Name</span>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>{userInfo?.name || 'N/A'}</div>
                </div>
                <div style={{ borderTop: '1px solid rgba(139, 92, 246, 0.1)', paddingTop: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>User ID</span>
                    <div style={{ fontSize: '13px', fontFamily: 'monospace', color: '#a78bfa' }}>{userInfo?.id || 'N/A'}</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="landing-wrapper" style={{ overflow: 'hidden' }}>
            <div className="glow-orb" style={{ width: '400px', height: '400px', top: '-100px', left: '20%', background: 'rgba(99, 102, 241, 0.08)' }}></div>
            <div className="glow-orb" style={{ width: '280px', height: '280px', bottom: '10%', right: '10%', background: 'rgba(236, 72, 153, 0.06)' }}></div>

            <div className="app">
                {/* Sidebar */}
                <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                    <div className="logo-area" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <div className="logo-icon">
                            <SafetyCertificateOutlined />
                        </div>
                        {!collapsed && (
                            <div className="logo-text-wrap">
                                <div className="logo-text">VoteSecure</div>
                                <div className="logo-sub">Portal Access</div>
                            </div>
                        )}
                    </div>
                    <div className="nav-list">
                        {navItems.map(item => {
                            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                            return (
                                <div 
                                    key={item.key} 
                                    className={`nav-item ${isActive ? 'active' : ''}`}
                                    onClick={() => navigate(item.path)}
                                >
                                    {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'nav-icon' })}
                                    {!collapsed && <span className="nav-label">{item.label}</span>}
                                    {item.badge && !collapsed && (
                                        <span className={`nav-badge badge-${item.badge.toLowerCase()}`}>{item.badge}</span>
                                    )}
                                </div>
                            );
                        })}
                        
                        <div className="nav-item" style={{ marginTop: 'auto' }} onClick={handleLogout}>
                            <LogoutOutlined className="nav-icon" style={{ color: '#ef4444' }} />
                            {!collapsed && <span className="nav-label" style={{ color: '#ef4444' }}>Logout</span>}
                        </div>
                    </div>
                    <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </button>
                </div>

                {/* Main */}
                <div className="main">
                    {/* Topbar */}
                    <div className="topbar">
                        <div className="search-wrap">
                            <SearchOutlined className="search-icon" />
                            <input className="search-input" placeholder="Search system..." />
                        </div>
                        <div className="topbar-right">
                            <Button type="text" className="icon-btn" style={{ color: '#64748b' }}>
                                <BellOutlined />
                            </Button>
                            <Popover 
                                content={popoverContent} 
                                title={null} 
                                trigger="click" 
                                placement="bottomRight"
                                overlayClassName="user-popover-premium"
                            >
                                <div className="user-chip">
                                    <Avatar size="small" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
                                        {userRole.charAt(0)}
                                    </Avatar>
                                    <span>{userRole === 'APPLICANT' ? 'Applicant' : 'Administrator'}</span>
                                </div>
                            </Popover>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="content" style={{ padding: '24px', overflowY: 'auto', height: 'calc(100vh - 72px)' }}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
