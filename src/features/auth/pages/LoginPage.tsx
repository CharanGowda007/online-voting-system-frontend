import React from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Checkbox, 
  message, 
  Tabs, 
  Typography, 
  Row, 
  Col 
} from 'antd';
import { 
  LockOutlined, 
  ArrowLeftOutlined, 
  IdcardOutlined, 
  PhoneOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../api/auth.service';
import { Storage } from '../../../shared/utils/storage-util';
import './LoginPage.css';

const { Text, Title } = Typography;

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const [captchaData, setCaptchaData] = React.useState<{ captchaId: string; svg: string } | null>(null);
    
    // Determine initial login type from URL
    const queryParams = new URLSearchParams(location.search);
    const initialType = queryParams.get('type') === 'user' ? 'user' : 'applicant';
    const [loginType, setLoginType] = React.useState(initialType);

    const loadCaptcha = async () => {
        try {
            const data = await AuthService.generateCaptcha();
            setCaptchaData(data);
        } catch (error) {
            console.error("Failed to load captcha", error);
        }
    };

    React.useEffect(() => {
        loadCaptcha();
    }, []);

    const onFinish = async (values: any) => {
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
                navigate('/change-password', { state: { loginId: values.identifier } });
            } else {
                message.success('Login successful!');
                navigate('/dashboard');
            }
        } catch (error: any) {
            message.error(error.response?.data?.message || "Login failed. Please try again.");
            loadCaptcha();
            form.setFieldsValue({ captcha: '' });
        }
    };

    return (
        <div className="login-premium-wrapper">
            {/* Background Orbs */}
            <div className="glow-orb" style={{ width: '400px', height: '400px', top: '-100px', left: '30%', background: 'rgba(99, 102, 241, 0.1)' }}></div>
            <div className="glow-orb" style={{ width: '300px', height: '300px', bottom: '10%', right: '15%', background: 'rgba(236, 72, 153, 0.08)', animationDelay: '2s' }}></div>

            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                className="back-btn-premium"
                onClick={() => navigate('/')}
            >
                Back to Home
            </Button>

            <div className="login-card-container">
                <Card className="login-card-premium glass-card" bordered={false}>
                    <div className="modal-header-premium">
                        <div className="modal-icon-premium">
                            <SafetyCertificateOutlined />
                        </div>
                        <Title level={3} className="modal-title-premium">
                            {loginType === 'applicant' ? 'Applicant Portal' : 'Staff Portal'}
                        </Title>
                        <Text className="modal-sub-premium">Sign in to your account securely</Text>
                    </div>
                    
                    <Tabs 
                        activeKey={loginType} 
                        onChange={(key) => {
                            setLoginType(key);
                            form.resetFields();
                        }}
                        centered
                        className="login-tabs-premium"
                        items={[
                            { label: 'Applicant', key: 'applicant' },
                            { label: 'Staff / User', key: 'user' },
                        ]}
                    />

                    <Form
                        form={form}
                        name="login_form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                        className="login-form-premium"
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
                                onClick={() => navigate('/forgot-password')}
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
                                <Text className="link-text-premium" onClick={() => navigate('/register')}>
                                    Register now
                                </Text>
                            </>
                        ) : (
                            <Text className="muted-text-premium">Contact admin for account issues</Text>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
