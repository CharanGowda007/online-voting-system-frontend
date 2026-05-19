import React, { useState, useEffect } from 'react';
import { Typography, Card, Table, Tag, Avatar, Space, Input, Button, Modal, Form, Select, message, Row, Col, Divider } from 'antd';
import { UsergroupAddOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { UserManagementService } from '../api/user-management.service';

const { Title, Text } = Typography;

const UserDetailsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await UserManagementService.getUsers();
            setUsers(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            message.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        { 
            title: 'User', 
            dataIndex: 'loginId', 
            key: 'loginId',
            render: (text: string) => (
                <Space>
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UsergroupAddOutlined />} />
                    {text}
                </Space>
            )
        },
        { title: 'User Type', dataIndex: 'userType', key: 'userType', render: (type: string) => <Tag color="blue">{type}</Tag> },
        { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color="green">{status}</Tag> },
        { title: 'Last Login', dataIndex: 'lastLogin', key: 'lastLogin' },
    ];

    const handleCreate = async (values: any) => {
        try {
            await UserManagementService.createUser({ ...values, resetRequired: true });
            message.success('User account created');
            setIsModalOpen(false);
            form.resetFields();
            fetchUsers();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to create user');
        }
    };

    return (
        <div className="admin-page-content">
            <div className="page-header-premium">
                <div>
                    <Title level={2} className="grad-text" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <UsergroupAddOutlined /> User Directory
                    </Title>
                    <Text className="section-sub" style={{ display: 'block', marginTop: '8px' }}>
                        View and manage all registered system users and their access levels
                    </Text>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setIsModalOpen(true)}
                    size="large"
                    className="cta-primary"
                >
                    Create New User
                </Button>
            </div>

            <Card className="glass-card" bordered={false}>
                <div style={{ marginBottom: 24 }}>
                    <Input 
                        prefix={<SearchOutlined style={{ color: '#64748b' }} />} 
                        placeholder="Search by name, ID or role..." 
                        style={{ maxWidth: 350 }} 
                        className="search-input"
                    />
                </div>
                <Table 
                    columns={columns} 
                    dataSource={users} 
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title="Create New User Account"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreate}
                    initialValues={{ status: 'ACTIVE', userType: 'ADMIN' }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                                <Input placeholder="John" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                                <Input placeholder="Doe" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                        <Input placeholder="john.doe@example.com" />
                    </Form.Item>
                    <Form.Item name="loginId" label="Mobile Number" rules={[{ required: true }]}>
                        <Input placeholder="e.g. 9876543210" />
                    </Form.Item>
                    <Form.Item name="password" label="Initial Password" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    
                    <Divider>Organizational Details</Divider>
                    
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="departmentName" label="Department">
                                <Input placeholder="e.g. IT Dept" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="location" label="Location">
                                <Input placeholder="e.g. Bangalore" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="ofcAddress" label="Office Address">
                        <Input.TextArea rows={2} />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="userType" label="User Type" rules={[{ required: true }]}>
                                <Select>
                                    <Select.Option value="ADMIN">Administrator</Select.Option>
                                    <Select.Option value="VOTER">Voter</Select.Option>
                                    <Select.Option value="CANDIDATE">Candidate</Select.Option>
                                    <Select.Option value="APPLICANT">Applicant</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="status" label="Account Status" rules={[{ required: true }]}>
                                <Select>
                                    <Select.Option value="ACTIVE">Active</Select.Option>
                                    <Select.Option value="INACTIVE">Inactive</Select.Option>
                                    <Select.Option value="BLOCKED">Blocked</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default UserDetailsPage;
