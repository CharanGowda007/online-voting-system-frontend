import { useState } from 'react';
import { Button, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRightOutlined, 
  LockOutlined, 
  CheckCircleOutlined, 
  ThunderboltOutlined, 
  SafetyCertificateOutlined,
  SearchOutlined,
  BellOutlined,
  AppstoreOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  EditOutlined,
  BarChartOutlined,
  CalendarOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import './LandingPage.css';
import AuthModal from './AuthModal';

export default function LandingPage() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    
    // Auth Modal State
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<'login_applicant' | 'login_staff' | 'register'>('login_applicant');

    const openModal = (mode: 'login_applicant' | 'login_staff' | 'register') => {
        setAuthModalMode(mode);
        setAuthModalOpen(true);
    };

    const features = [
        {
            title: "End-to-End Encrypted",
            desc: "AES-256 military-grade encryption on all ballot transmissions.",
            icon: <LockOutlined />,
            color: "#8b5cf6"
        },
        {
            title: "Verified & Secure",
            desc: "Multi-layer identity verification with biometric authentication.",
            icon: <CheckCircleOutlined />,
            color: "#6366f1"
        },
        {
            title: "Instant Results",
            desc: "Real-time vote tallying with zero-latency result broadcasting.",
            icon: <ThunderboltOutlined />,
            color: "#ec4899"
        },
        {
            title: "Blockchain Security",
            desc: "Immutable distributed ledger ensures tamper-proof vote records.",
            icon: <SafetyCertificateOutlined />,
            color: "#10b981"
        }
    ];

    const stats = [
        { label: "Total Voters", value: "4.2M", growth: "▲ 12.4%", color: "#10b981", iconColor: "#8b5cf6", iconBg: "rgba(139,92,246,0.15)" },
        { label: "Active Elections", value: "7", growth: "▲ +2", color: "#10b981", iconColor: "#6366f1", iconBg: "rgba(99,102,241,0.15)" },
        { label: "Votes Cast", value: "1.8M", growth: "▲ 8.7%", color: "#10b981", iconColor: "#ec4899", iconBg: "rgba(236,72,153,0.15)" },
        { label: "Security Status", value: "100%", growth: "Optimal", color: "#10b981", iconColor: "#10b981", iconBg: "rgba(16,185,129,0.15)" }
    ];

    return (
        <div className="landing-wrapper">
            <div className="glow-orb" style={{ width: '400px', height: '400px', top: '-100px', left: '30%', background: 'rgba(99, 102, 241, 0.08)' }}></div>
            <div className="glow-orb" style={{ width: '280px', height: '280px', bottom: '10%', right: '15%', background: 'rgba(236, 72, 153, 0.06)' }}></div>

            <div className="app">
                {/* Sidebar */}
                <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                    <div className="logo-area">
                        <div className="logo-icon">
                            <SafetyCertificateOutlined />
                        </div>
                        {!collapsed && (
                            <div className="logo-text-wrap">
                                <div className="logo-text">VoteSecure</div>
                                <div className="logo-sub">National Platform</div>
                            </div>
                        )}
                    </div>
                    <div className="nav-list">
                        <div className="nav-item active" onClick={() => navigate('/')}>
                            <AppstoreOutlined className="nav-icon" />
                            {!collapsed && <span className="nav-label">Dashboard</span>}
                        </div>
                        <div className="nav-item" onClick={() => openModal('register')}>
                            <UserAddOutlined className="nav-icon" />
                            {!collapsed && <span className="nav-label">New Voter Reg.</span>}
                            {!collapsed && <span className="nav-badge badge-new">New</span>}
                        </div>
                        <div className="nav-item">
                            <UserDeleteOutlined className="nav-icon" />
                            {!collapsed && <span className="nav-label">Delete Voter</span>}
                        </div>
                        <div className="nav-item">
                            <EditOutlined className="nav-icon" />
                            {!collapsed && <span className="nav-label">Voter Correction</span>}
                        </div>
                        <div className="nav-item">
                            <BarChartOutlined className="nav-icon" />
                            {!collapsed && <span className="nav-label">Election Results</span>}
                            {!collapsed && <span className="nav-badge badge-live">Live</span>}
                        </div>
                        <div className="nav-item">
                            <CalendarOutlined className="nav-icon" />
                            {!collapsed && <span className="nav-label">Upcoming Elections</span>}
                            {!collapsed && <span className="nav-badge badge-num">3</span>}
                        </div>
                        <div className="nav-item" style={{ marginTop: 'auto' }}>
                            <SettingOutlined className="nav-icon" />
                            {!collapsed && <span className="nav-label">Settings</span>}
                        </div>
                        <div className="nav-item" onClick={() => openModal('login_staff')}>
                            <LogoutOutlined className="nav-icon" style={{ color: '#ef4444' }} />
                            {!collapsed && <span className="nav-label" style={{ color: '#ef4444' }}>Staff Login</span>}
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
                            <input className="search-input" placeholder="Search voters, elections..." />
                        </div>
                        <div className="topbar-right">
                            <Button type="text" className="icon-btn">
                                <BellOutlined />
                            </Button>
                            <div className="user-chip" onClick={() => openModal('login_staff')}>
                                <Avatar size="small" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>SL</Avatar>
                                <span>Staff Login</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="content">
                        <div className="hero-section">
                            <div className="hero-text-area">
                                <div className="pill-badge">
                                    <div className="pill-dot"></div>
                                    <span>Secure & Transparent Voting Platform</span>
                                </div>
                                <h1 className="hero-title">
                                    Secure<br />
                                    <span className="grad-text">Digital Voting</span><br />
                                    Platform
                                </h1>
                                <p className="hero-sub">
                                    Experience the future of democracy with our <b>secure, transparent, and accessible</b> national voting infrastructure trusted by millions.
                                </p>
                                <div className="cta-group">
                                    <Button 
                                        type="primary" 
                                        size="large" 
                                        icon={<ArrowRightOutlined />} 
                                        className="cta-primary"
                                        onClick={() => openModal('login_applicant')}
                                    >
                                        Applicant Login
                                    </Button>
                                    <Button 
                                        size="large" 
                                        className="cta-secondary"
                                        onClick={() => openModal('register')}
                                    >
                                        Register to Vote
                                    </Button>
                                </div>

                                <div className="stats-grid">
                                    {stats.map((s, i) => (
                                        <div className="stat-card glass-card" key={i}>
                                            <div className="stat-header">
                                                <div className="stat-icon-wrap" style={{ background: s.iconBg, color: s.iconColor }}>
                                                    <SafetyCertificateOutlined />
                                                </div>
                                                <span className="stat-growth" style={{ color: s.color, background: 'rgba(16,185,129,0.15)' }}>{s.growth}</span>
                                            </div>
                                            <div className="stat-value">{s.value}</div>
                                            <div className="stat-label">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="hero-visual">
                                <div className="visual-container">
                                    <div className="ring-1"></div>
                                    <div className="ring-2"></div>
                                    <div className="floating-card glass-card">
                                        <div className="card-doc">
                                            <div className="doc-line purple"></div>
                                            <div className="doc-line"></div>
                                            <div className="doc-dots">
                                                <div className="dot"></div>
                                                <div className="dot active"></div>
                                                <div className="dot"></div>
                                            </div>
                                        </div>
                                        <div className="card-label">Official Ballot</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="features-section">
                            <div className="section-header">
                                <h2 className="section-title">Security Features</h2>
                                <p className="section-sub">Military-grade protection for every vote cast on our platform.</p>
                            </div>
                            <div className="features-grid">
                                {features.map((f, i) => (
                                    <div className="feature-card glass-card" key={i}>
                                        <div className="feature-icon" style={{ background: `${f.color}20`, color: f.color }}>
                                            {f.icon}
                                        </div>
                                        <h3 className="feature-title">{f.title}</h3>
                                        <p className="feature-desc">{f.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setAuthModalOpen(false)} 
                initialMode={authModalMode} 
            />
        </div>
    );
}
