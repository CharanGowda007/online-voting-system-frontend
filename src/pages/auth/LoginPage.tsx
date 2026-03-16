import { Card, Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/auth.service';
import { Storage } from '../../utils/storage-util';
import './LoginPage.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            const response = await AuthService.login({
                mobile: values.identifier,
                password: values.password
            });
            // Try different common token keys from NestJS responses
            const token = response.accessToken || response.token || response.access_token;
            if (token) {
                Storage.local.set("TimeSheet-authenticationToken", token);
            }
            message.success('Login successful!');
            navigate('/dashboard');
        } catch (error: any) {
            message.error(error.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="login-container">
            {/* Background Ambience */}
            <div className="bg-blob blob-purple"></div>
            <div className="bg-blob blob-pink"></div>

            {/* Back Button */}
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                className="back-btn"
                onClick={() => navigate('/')}
            >
                Back to Home
            </Button>

            <Card className="login-card" bordered={false}>
                <div className="login-title">Welcome Back</div>

                <Form
                    form={form}
                    name="login_form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="identifier"
                        rules={[
                            { required: true, message: 'Please enter your Email or Phone Number!' },
                            { 
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve();
                                    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                                    const isPhone = /^[0-9]{10}$/.test(value);
                                    if (!isEmail && !isPhone) {
                                        return Promise.reject(new Error('Must be a valid email or 10-digit phone number!'));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Email or Phone Number"
                            maxLength={50} // 50 to accommodate emails, but phone logic remains governed by regex
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please enter your Password!' },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a href="#" className="login-link" style={{ marginLeft: 0 }}>Forgot password?</a>
                    </div>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-btn">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>

                <div className="login-footer">
                    Don't have an account?
                    <span
                        onClick={() => navigate('/register')}
                        className="login-link"
                        style={{ cursor: 'pointer' }}
                    >
                        Register now
                    </span>
                </div>
            </Card>
        </div>
    );
}
