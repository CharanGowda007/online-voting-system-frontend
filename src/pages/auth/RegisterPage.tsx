import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, SafetyOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        message.success('Registration successful! Please login.');
        navigate('/login');
    };

    return (
        <div className="register-container">
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
                        name="fullName"
                        rules={[{ required: true, message: 'Please enter your Full Name!' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Full Name"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { type: 'email', message: 'The input is not valid E-mail!' },
                            { required: true, message: 'Please enter your E-mail!' },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email Address"
                        />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        rules={[{ required: true, message: 'Please enter your Phone Number!' }]}
                    >
                        <Input
                            prefix={<PhoneOutlined />}
                            placeholder="Phone Number"
                        />
                    </Form.Item>

                    <Form.Item
                        name="voterId"
                        rules={[{ required: true, message: 'Please enter your Voter ID!' }]}
                    >
                        <Input
                            prefix={<SafetyOutlined />}
                            placeholder="Voter ID Number"
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
