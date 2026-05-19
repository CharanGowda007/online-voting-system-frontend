import React from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { 
  LockOutlined, 
  SafetyCertificateOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../api/auth.service';
import './LoginPage.css';

const { Text, Title } = Typography;

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);


    const onFinish = async (values: any) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error('Passwords do not match!');
            return;
        }

        setLoading(true);
        try {
            await AuthService.changePassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword
            });
            message.success('Password changed successfully! Please login with your new password.');
            navigate('/login');
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to change password. Please check your old password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-premium-wrapper">
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

            <div className="login-card-container" style={{ maxWidth: '420px' }}>
                <Card className="login-card-premium glass-card" bordered={false}>
                    <div className="modal-header-premium">
                        <div className="modal-icon-premium" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                            <LockOutlined />
                        </div>
                        <Title level={3} className="modal-title-premium">Change Password</Title>
                        <Text className="modal-sub-premium">Please update your temporary password to secure your account</Text>
                    </div>

                    <Form
                        form={form}
                        name="change_password_form"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                        className="login-form-premium"
                        style={{ marginTop: '24px' }}
                    >
                        <Form.Item
                            name="oldPassword"
                            label="Current Temporary Password"
                            rules={[{ required: true, message: 'Please enter your current password!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="input-icon-premium" />}
                                placeholder="Enter temporary password"
                                className="field-input-premium"
                            />
                        </Form.Item>

                        <Form.Item
                            name="newPassword"
                            label="New Secure Password"
                            rules={[
                                { required: true, message: 'Please enter a new password!' },
                                { min: 6, message: 'Password must be at least 6 characters!' }
                            ]}
                        >
                            <Input.Password
                                prefix={<SafetyCertificateOutlined className="input-icon-premium" />}
                                placeholder="Enter new password"
                                className="field-input-premium"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirm New Password"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Please confirm your new password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<SafetyCertificateOutlined className="input-icon-premium" />}
                                placeholder="Confirm new password"
                                className="field-input-premium"
                            />
                        </Form.Item>

                        <Form.Item style={{ marginTop: '32px' }}>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                className="submit-btn-premium" 
                                loading={loading}
                                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none' }}
                            >
                                Update Password
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="login-footer-premium">
                        Want to do this later?{' '}
                        <Text className="link-text-premium" onClick={() => navigate('/login')}>
                            Cancel and Logout
                        </Text>
                    </div>
                </Card>
            </div>
        </div>
    );
}
