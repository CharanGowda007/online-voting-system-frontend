import { Card, Form, Input, Button, message } from 'antd';
import { LockOutlined, PhoneOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/auth.service';
import './RegisterPage.css';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            await AuthService.register({
                mobile: values.mobile,
                password: values.password
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
        <div className="register-container">
            {/* Background Ambience */}
            <div className="bg-blob blob-white"></div>
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

            <Card className="register-card" bordered={false}>
                <div className="register-title">Create Account</div>

                <Form
                    form={form}
                    name="register_form"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                    scrollToFirstError
                >
                    <Form.Item
                        name="mobile"
                        rules={[
                            { required: true, message: 'Please enter your Mobile Number!' },
                            { pattern: /^[0-9]{10}$/, message: 'Mobile number must be exactly 10 digits!' }
                        ]}
                    >
                        <Input
                            prefix={<PhoneOutlined />}
                            placeholder="Mobile Number"
                            maxLength={10}
                            onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please enter your Password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' },
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please confirm your Password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirm Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="register-btn">
                            Register
                        </Button>
                    </Form.Item>
                </Form>

                <div className="register-footer">
                    Already have an account?
                    <span
                        onClick={() => navigate('/login')}
                        className="auth-link"
                    >
                        Login here
                    </span>
                </div>
            </Card>
        </div>
    );
}
