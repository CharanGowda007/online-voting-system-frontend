import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { Storage } from '../../utils/storage-util';
import {
  UserAddOutlined,
  UserDeleteOutlined,
  EditOutlined,
  BarChartOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import './LandingPage.css';

const { Sider, Content } = Layout;

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

export default function LandingPage() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const token = Storage.local.get("TimeSheet-authenticationToken") || Storage.session.get("TimeSheet-authenticationToken");
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // We won't use the theme token for background because we want to preserve the gradient
  // But we'll keep the layout structure

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
        style={{ zIndex: 50 }}
      >
        <div className="demo-logo-vertical" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
        <Menu theme="dark" defaultSelectedKeys={['0']} mode="inline" items={items} />
      </Sider>

      <Layout style={{ background: 'transparent' }}>
        <Content style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Original Landing Page Container and Content */}
          <div className="landing-container" style={{ position: 'absolute', inset: 0, height: '100%' }}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="bg-blob blob-purple"></div>
              <div className="bg-blob blob-yellow"></div>
              <div className="bg-blob blob-pink"></div>
            </div>

            {/* Main Content */}
            <div className="landing-content">
              <div className="landing-grid">
                {/* Left Section - Hero Content */}
                <div className="hero-content">
                  {/* Badge */}
                  <div className="inline-flex self-start">
                    <span className="status-badge">
                      <span className="status-dot-container">
                        <span className="status-dot-ping"></span>
                        <span className="status-dot"></span>
                      </span>
                      Secure & Transparent Voting Platform
                    </span>
                  </div>

                  {/* Main Heading */}
                  <div>
                    <h1 className="hero-title">
                      <span className="hero-gradient-text-1">
                        Online Voting
                      </span>
                      <br />
                      <span className="hero-gradient-text-2">
                        System
                      </span>
                    </h1>
                    <p className="hero-description">
                      Experience the future of democracy with our cutting-edge platform.
                      <span className="highlight"> Secure, transparent, and accessible</span> voting for everyone, anywhere.
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="cta-group">
                    <button
                      onClick={() => navigate('/login')}
                      className="btn-base btn-primary"
                    >
                      Login
                    </button>

                    <button
                      onClick={() => navigate('/register')}
                      className="btn-base btn-glass"
                    >
                      Register
                    </button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="trust-grid">
                    <div className="trust-card">
                      <span className="trust-icon">🔒</span>
                      <p className="trust-text">End-to-End Encrypted</p>
                    </div>

                    <div className="trust-card">
                      <span className="trust-icon">✓</span>
                      <p className="trust-text">Verified & Secure</p>
                    </div>

                    <div className="trust-card">
                      <span className="trust-icon">⚡</span>
                      <p className="trust-text">Instant Results</p>
                    </div>
                  </div>
                </div>

                {/* Right Section - Enhanced Illustration */}
                <div className="hidden lg:flex justify-center items-center animate-fade-in-right">
                  <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>

                    {/* Main Illustration */}
                    <svg
                      viewBox="0 0 500 500"
                      className="w-full h-auto max-w-lg drop-shadow-2xl relative z-10"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Background Circle */}
                      <circle cx="250" cy="250" r="200" fill="url(#bgGradient)" opacity="0.1" />

                      {/* Ballot Box - Modern Design */}
                      <defs>
                        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="paperGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#f3f4f6', stopOpacity: 1 }} />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Main Ballot Box */}
                      <g filter="url(#glow)">
                        <rect x="150" y="150" width="200" height="250" rx="15" fill="url(#boxGradient)" />
                        <rect x="150" y="150" width="200" height="60" rx="15" fill="#6366f1" opacity="0.8" />

                        {/* Slot Opening */}
                        <rect x="210" y="175" width="80" height="10" rx="5" fill="#fbbf24" />
                        <rect x="210" y="195" width="80" height="10" rx="5" fill="#f59e0b" />
                      </g>

                      {/* Floating Ballot Paper with Animation */}
                      <g className="animate-float">
                        <rect x="180" y="80" width="140" height="180" rx="8" fill="url(#paperGradient)" stroke="#8b5cf6" strokeWidth="3" />

                        {/* Paper Content Lines */}
                        <line x1="200" y1="110" x2="300" y2="110" stroke="#8b5cf6" strokeWidth="2" opacity="0.6" />
                        <line x1="200" y1="135" x2="300" y2="135" stroke="#8b5cf6" strokeWidth="2" opacity="0.6" />
                        <line x1="200" y1="160" x2="300" y2="160" stroke="#8b5cf6" strokeWidth="2" opacity="0.6" />

                        {/* Checkboxes */}
                        <circle cx="210" cy="190" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                        <circle cx="210" cy="220" r="6" fill="#8b5cf6" />
                        <path d="M 207 220 L 209 222 L 213 218" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
                        <circle cx="210" cy="250" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                      </g>

                      {/* Decorative Elements */}

                      {/* Check Mark Badge 1 */}
                      <g className="animate-bounce-slow">
                        <circle cx="120" cy="280" r="35" fill="#10b981" opacity="0.95" filter="url(#glow)" />
                        <path
                          d="M 108 280 L 118 290 L 132 276"
                          stroke="#fff"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>

                      {/* Check Mark Badge 2 */}
                      <g className="animate-bounce-slow delay-2000">
                        <circle cx="380" cy="320" r="35" fill="#10b981" opacity="0.95" filter="url(#glow)" />
                        <path
                          d="M 368 320 L 378 330 L 392 316"
                          stroke="#fff"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>

                      {/* Security Shield */}
                      <g className="animate-pulse">
                        <path
                          d="M 370 140 L 400 155 L 400 195 Q 400 220 385 235 Q 370 220 370 195 Z"
                          fill="#f97316"
                          opacity="0.9"
                          filter="url(#glow)"
                        />
                        <path
                          d="M 380 195 L 385 202 L 395 185"
                          stroke="#fff"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>

                      {/* Star Elements */}
                      <circle cx="100" cy="180" r="3" fill="#fbbf24" opacity="0.8" className="animate-twinkle" />
                      <circle cx="400" cy="240" r="3" fill="#fbbf24" opacity="0.8" className="animate-twinkle delay-1000" />
                      <circle cx="140" cy="400" r="3" fill="#a855f7" opacity="0.8" className="animate-twinkle delay-2000" />
                      <circle cx="360" cy="420" r="3" fill="#a855f7" opacity="0.8" className="animate-twinkle delay-3000" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0 opacity-10">
              <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white" />
              </svg>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
