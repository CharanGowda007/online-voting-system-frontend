import { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, message, Typography, Tabs, Row, Col } from 'antd';
import { 
  LockOutlined, 
  PhoneOutlined, 
  SafetyCertificateOutlined,
  IdcardOutlined,
  UserOutlined,
  MailOutlined,
  CloseOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../api/auth.service';
import { Storage } from '../../../shared/utils/storage-util';
import './AuthModal.css';

const { Title, Text } = Typography;

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode: 'login_applicant' | 'login_staff' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode }: AuthModalProps) {
    const navigate = useNavigate();
    const [loginForm] = Form.useForm();
    const [registerForm] = Form.useForm();
    
    // 'login' or 'register'
    const [view, setView] = useState<'login' | 'register'>(initialMode === 'register' ? 'register' : 'login');
    // 'applicant' or 'user' (staff)
    const [loginType, setLoginType] = useState<'applicant' | 'user'>(initialMode === 'login_staff' ? 'user' : 'applicant');
    const [captchaData, setCaptchaData] = useState<{ captchaId: string; svg: string } | null>(null);

    const loadCaptcha = async () => {
        try {
            const data = await AuthService.generateCaptcha();
            setCaptchaData(data);
        } catch (error) {
            console.error("Failed to load captcha", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setView(initialMode === 'register' ? 'register' : 'login');
            setLoginType(initialMode === 'login_staff' ? 'user' : 'applicant');
            loginForm.resetFields();
            registerForm.resetFields();
            if (view === 'login') {
                loadCaptcha();
            }
        }
    }, [isOpen, initialMode, loginForm, registerForm, view]);

    if (!isOpen) return null;

    const onLoginFinish = async (values: any) => {
        try {
            const response = await AuthService.login({
                loginId: values.identifier,
                password: values.password,
                captchaId: captchaData?.captchaId,
                captchaText: values.captcha
            });
            const token = response.accessToken || response.token || response.access_token;
            if (token) {
                if (values.remember) {
                    Storage.local.set("online voting system", token);
                } else {
                    Storage.session.set("online voting system", token);
                }
            }
            if (response.changePasswordRequired) {
                message.info('Please change your temporary password to continue.');
                onClose();
                navigate('/change-password', { state: { loginId: values.identifier } });
            } else {
                message.success('Login successful!');
                onClose();
                navigate('/dashboard');
            }
        } catch (error: any) {
            message.error(error.response?.data?.message || "Login failed. Please try again.");
            loadCaptcha(); // refresh captcha on failure
            loginForm.setFieldsValue({ captcha: '' });
        }
    };

    const onRegisterFinish = async (values: any) => {
        try {
            await AuthService.register({
                mobile: values.mobile,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                aliasName: values.mobile 
            });
            message.success('Registration successful! Please log in.');
            setView('login');
            setLoginType('applicant');
        } catch (error: any) {
            let errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
            if (Array.isArray(errorMsg)) errorMsg = errorMsg[0];
            message.error(errorMsg);
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="auth-modal glass-card">
                <button className="close-btn" onClick={onClose}>
                    <CloseOutlined />
                </button>

                <div className="modal-header-premium">
                    <div className="modal-icon-premium">
                        <SafetyCertificateOutlined />
                    </div>
                    <Title level={3} className="modal-title-premium">
                        {view === 'login' ? (loginType === 'applicant' ? 'Applicant Portal' : 'Staff Portal') : 'Voter Registration'}
                    </Title>
                    <Text className="modal-sub-premium">
                        {view === 'login' ? 'Sign in to your account securely' : 'Create your secure voter account'}
                    </Text>
                </div>

                {view === 'login' ? (
                    <>
                        <Tabs 
                            activeKey={loginType} 
                            onChange={(key) => {
                                setLoginType(key as 'applicant' | 'user');
                                loginForm.resetFields();
                            }}
                            centered
                            className="login-tabs-premium"
                            items={[
                                { label: 'Applicant', key: 'applicant' },
                                { label: 'Staff / User', key: 'user' },
                            ]}
                        />

                        <Form
                            form={loginForm}
                            name="login_form"
                            initialValues={{ remember: true }}
                            onFinish={onLoginFinish}
                            layout="vertical"
                            size="large"
                            className="auth-form-premium"
                        >
                            <Form.Item
                                name="identifier"
                                label={loginType === 'applicant' ? 'Mobile Number' : 'User ID'}
                                rules={[
                                    { required: true, message: `Please enter your ${loginType === 'applicant' ? 'Mobile Number' : 'User ID'}!` },
                                    ...(loginType === 'applicant' ? [{ pattern: /^[0-9]{10}$/, message: 'Must be a 10-digit mobile number!' }] : [])
                                ]}
                            >
                                <Input
                                    prefix={loginType === 'applicant' ? <PhoneOutlined className="input-icon-premium" /> : <IdcardOutlined className="input-icon-premium" />}
                                    placeholder={loginType === 'applicant' ? "10-digit mobile number" : "OVS-XXXX"}
                                    className="field-input-premium"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    { required: true, message: 'Please enter your Password!' },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="input-icon-premium" />}
                                    placeholder="Enter password"
                                    className="field-input-premium"
                                />
                            </Form.Item>

                            <Row gutter={8} align="bottom">
                                <Col span={13}>
                                    <Form.Item
                                        name="captcha"
                                        label="Captcha"
                                        rules={[{ required: true, message: 'Required!' }]}
                                    >
                                        <Input 
                                            prefix={<SafetyCertificateOutlined className="input-icon-premium" />}
                                            placeholder="Enter captcha" 
                                            className="field-input-premium" 
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={11}>
                                    <div className="captcha-wrapper-premium">
                                        <div 
                                            className="captcha-svg-premium"
                                            dangerouslySetInnerHTML={{ __html: captchaData?.svg || '' }} 
                                        />
                                        <Button 
                                            type="text" 
                                            icon={<ReloadOutlined />} 
                                            onClick={loadCaptcha}
                                            className="captcha-reload-premium"
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <div className="login-options-premium">
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox className="checkbox-premium">Remember me</Checkbox>
                                </Form.Item>
                                <Button 
                                    type="link" 
                                    className="forgot-link-premium" 
                                    onClick={() => {
                                        onClose();
                                        navigate('/forgot-password');
                                    }}
                                    style={{ padding: 0, height: 'auto' }}
                                >
                                    Forgot password?
                                </Button>
                            </div>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="submit-btn-premium">
                                    Log in as {loginType === 'applicant' ? 'Applicant' : 'Staff'}
                                </Button>
                            </Form.Item>
                        </Form>

                        <div className="login-footer-premium">
                            {loginType === 'applicant' ? (
                                <>
                                    Don't have an account?{' '}
                                    <span className="link-text-premium" onClick={() => setView('register')}>
                                        Register now
                                    </span>
                                </>
                            ) : (
                                <Text className="muted-text-premium">Contact admin for account issues</Text>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <Form
                            form={registerForm}
                            name="register_form"
                            onFinish={onRegisterFinish}
                            layout="vertical"
                            size="large"
                            className="auth-form-premium"
                        >
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item
                                        name="firstName"
                                        label="First Name"
                                        rules={[{ required: true, message: 'Required!' }]}
                                    >
                                        <Input prefix={<UserOutlined className="input-icon-premium" />} placeholder="First" className="field-input-premium" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="lastName"
                                        label="Last Name"
                                        rules={[{ required: true, message: 'Required!' }]}
                                    >
                                        <Input prefix={<UserOutlined className="input-icon-premium" />} placeholder="Last" className="field-input-premium" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="email"
                                label="Email Address"
                                rules={[
                                    { required: true, message: 'Required!' },
                                    { type: 'email', message: 'Invalid email!' }
                                ]}
                            >
                                <Input prefix={<MailOutlined className="input-icon-premium" />} placeholder="Enter email" className="field-input-premium" />
                            </Form.Item>

                            <Form.Item
                                name="mobile"
                                label="Mobile Number"
                                rules={[
                                    { required: true, message: 'Required!' },
                                    { pattern: /^[0-9]{10}$/, message: 'Must be 10 digits!' }
                                ]}
                            >
                                <Input
                                    prefix={<PhoneOutlined className="input-icon-premium" />}
                                    placeholder="10-digit number"
                                    maxLength={10}
                                    className="field-input-premium"
                                />
                            </Form.Item>

                            <div style={{ marginBottom: '24px' }}>
                                <Text className="muted-text-premium" style={{ fontSize: '13px', display: 'block', lineHeight: '1.4' }}>
                                    <SafetyCertificateOutlined style={{ marginRight: '8px', color: '#8b5cf6' }} />
                                    For security, a system-generated password will be sent to your registered email address upon successful registration.
                                </Text>
                            </div>

                            <Form.Item style={{ marginTop: '24px' }}>
                                <Button type="primary" htmlType="submit" className="submit-btn-premium">
                                    Create Account
                                </Button>
                            </Form.Item>
                        </Form>

                        <div className="login-footer-premium">
                            Already registered?{' '}
                            <span className="link-text-premium" onClick={() => {
                                setView('login');
                                setLoginType('applicant');
                            }}>
                                Sign in
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
