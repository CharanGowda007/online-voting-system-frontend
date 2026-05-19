import { Card, Form, Input, Button, message, Typography, Row, Col } from 'antd';
import { 
  PhoneOutlined, 
  ArrowLeftOutlined, 
  UserOutlined, 
  MailOutlined,
  SafetyCertificateOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../api/auth.service';
import './LoginPage.css';
import './RegisterPage.css';
const { Title, Text } = Typography;

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            await AuthService.register({
                mobile: values.mobile,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                aliasName: values.mobile 
            });
            message.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error: any) {
            let errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
            if (Array.isArray(errorMsg)) errorMsg = errorMsg[0];
            message.error(errorMsg);
        }
    };

    return (
        <div className="register-premium-wrapper">
            {/* Background Orbs */}
            <div className="glow-orb" style={{ width: '400px', height: '400px', top: '-50px', right: '10%', background: 'rgba(99, 102, 241, 0.08)' }}></div>
            <div className="glow-orb" style={{ width: '300px', height: '300px', bottom: '10%', left: '5%', background: 'rgba(236, 72, 153, 0.06)', animationDelay: '1s' }}></div>

            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                className="back-btn-premium"
                onClick={() => navigate('/')}
            >
                Back to Home
            </Button>

            <div className="register-card-container">
                <Card className="register-card-premium glass-card" bordered={false}>
                    <div className="modal-header-premium">
                        <div className="modal-icon-premium">
                            <SafetyCertificateOutlined />
                        </div>
                        <Title level={3} className="modal-title-premium">Voter Registration</Title>
                        <Text className="modal-sub-premium">Create your secure voter account</Text>
                    </div>

                    <Form
                        form={form}
                        name="register_form"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                        className="register-form-premium"
                        scrollToFirstError
                    >
                        <Row gutter={16}>
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
                                { required: true, message: 'Email is required!' },
                                { type: 'email', message: 'Enter a valid email!' }
                            ]}
                        >
                            <Input prefix={<MailOutlined className="input-icon-premium" />} placeholder="Enter email" className="field-input-premium" />
                        </Form.Item>

                        <Form.Item
                            name="mobile"
                            label="Mobile Number"
                            rules={[
                                { required: true, message: 'Mobile is required!' },
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

                        <Form.Item style={{ marginTop: '32px' }}>
                            <Button type="primary" htmlType="submit" className="submit-btn-premium">
                                Create Account
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="login-footer-premium">
                        Already registered?{' '}
                        <Text className="link-text-premium" onClick={() => navigate('/login')}>
                            Sign in
                        </Text>
                    </div>
                </Card>
            </div>
        </div>
    );
}
