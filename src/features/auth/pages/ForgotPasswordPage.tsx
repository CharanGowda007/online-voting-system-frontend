import React from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { 
  ArrowLeftOutlined, 
  MailOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../api/auth.service';
import './LoginPage.css'; // Reusing the same styling for consistency

const { Text, Title } = Typography;

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await AuthService.forgotPassword(values.identifier);
            message.success(response.message || "Temporary password sent to your email!");
            navigate('/login');
        } catch (error: any) {
            message.error(error.response?.data?.message || "Failed to initiate password reset. Please try again.");
        } finally {
            setLoading(false);
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
                onClick={() => navigate('/login')}
            >
                Back to Login
            </Button>

            <div className="login-card-container">
                <Card className="login-card-premium glass-card" bordered={false}>
                    <div className="modal-header-premium">
                        <div className="modal-icon-premium" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                            <MailOutlined />
                        </div>
                        <Title level={3} className="modal-title-premium">Reset Password</Title>
                        <Text className="modal-sub-premium">Enter your credentials to receive a temporary password</Text>
                    </div>

                    <Form
                        form={form}
                        name="forgot_password_form"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                        className="login-form-premium"
                        style={{ marginTop: '24px' }}
                    >
                        <Form.Item
                            name="identifier"
                            label="User ID / Mobile Number / Email"
                            rules={[
                                { required: true, message: 'Please enter your account identifier!' },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined className="input-icon-premium" />}
                                placeholder="Enter your registered identifier"
                                className="field-input-premium"
                            />
                        </Form.Item>

                        <div style={{ marginBottom: '24px' }}>
                            <Text className="muted-text-premium" style={{ fontSize: '13px', display: 'block', lineHeight: '1.4' }}>
                                <SafetyCertificateOutlined style={{ marginRight: '8px', color: '#f59e0b' }} />
                                We will send a system-generated temporary password to your registered email address.
                            </Text>
                        </div>

                        <Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                className="submit-btn-premium" 
                                loading={loading}
                                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none' }}
                            >
                                Send Temporary Password
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="login-footer-premium">
                        Suddenly remembered?{' '}
                        <Text className="link-text-premium" onClick={() => navigate('/login')}>
                            Back to Login
                        </Text>
                    </div>
                </Card>
            </div>
        </div>
    );
}
