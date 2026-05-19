import React, { useState, useEffect } from 'react';
import { Typography, Card, Table, Tag, Space, Button, Modal, Form, Input, InputNumber, Select, message, Row, Col } from 'antd';
import { ClusterOutlined, PlusOutlined } from '@ant-design/icons';
import { AdminService } from '../api/admin.service';

const { Title, Text } = Typography;

const PostDetailsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [postsData, rolesData] = await Promise.all([
                AdminService.getPosts().catch(err => { console.error('Error fetching posts:', err); return []; }),
                AdminService.getRoles().catch(err => { console.error('Error fetching roles:', err); return []; })
            ]);
            console.log('Posts response:', postsData);
            
            // Handle different potential response structures from NestJS
            let postItems = [];
            if (Array.isArray(postsData)) {
                postItems = postsData;
            } else if (postsData && typeof postsData === 'object') {
                postItems = postsData.items || postsData.data || postsData.content || [];
            }
            
            setPosts(postItems);
            setRoles(Array.isArray(rolesData) ? rolesData : rolesData.data || []);
        } catch (error) {
            message.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showModal = (post?: any) => {
        if (post) {
            setEditingPost(post);
            form.setFieldsValue(post);
        } else {
            setEditingPost(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };


    const columns = [
        { title: 'Post Name', dataIndex: 'postName', key: 'postName' },
        { title: 'Department', dataIndex: 'departmentName', key: 'departmentName' },
        { title: 'Role', dataIndex: 'roleName', key: 'roleName' },
        { title: 'Location', dataIndex: 'location', key: 'location' },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Active' || !status ? 'green' : 'red'}>{status || 'Active'}</Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button type="link" onClick={() => showModal(record)}>Edit</Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
                </Space>
            ),
        },
    ];

    const handleDelete = async (id: string) => {
        try {
            await AdminService.deletePost(id);
            message.success('Post deleted successfully');
            fetchData();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to delete post');
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            const selectedRole = roles.find(r => r.id === values.roleId);
            const payload = {
                ...values,
                roleName: selectedRole?.name || values.roleName
            };

            if (editingPost) {
                await AdminService.updatePost(editingPost.id, payload);
                message.success('Post updated successfully');
            } else {
                await AdminService.createPost(payload);
                message.success('Post created successfully');
            }
            setIsModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to save post');
        }
    };

    return (
        <div className="admin-page-content">
            <div className="page-header-premium">
                <div>
                    <Title level={2} className="grad-text" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ClusterOutlined /> Post Details Management
                    </Title>
                    <Text className="section-sub" style={{ display: 'block', marginTop: '8px' }}>
                        Manage organizational posts, designations, and departmental structures
                    </Text>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => showModal()}
                    size="large"
                    className="cta-primary"
                >
                    Create New Post
                </Button>
            </div>

            <Card className="glass-card" bordered={false} bodyStyle={{ padding: 0 }}>
                <Table 
                    columns={columns} 
                    dataSource={posts} 
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        className: "premium-pagination"
                    }}
                />
            </Card>

            <Modal
                title={editingPost ? "Edit Post" : "Create New Post"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                width={700}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ locationId: 1 }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="postName" label="Post Name" rules={[{ required: true }]}>
                                <Input placeholder="e.g. Chief Election Officer" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="departmentName" label="Department" rules={[{ required: true }]}>
                                <Input placeholder="e.g. IT Department" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="roleId" label="Select Role" rules={[{ required: true }]}>
                                <Select 
                                    placeholder="Select a role" 
                                >
                                    {roles.map(role => (
                                        <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="location" label="Location Name" rules={[{ required: true }]}>
                                <Input placeholder="e.g. Bangalore" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="locationId" label="Location ID" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="ofcAddress" label="Office Address" rules={[{ required: true }]}>
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="email" label="Contact Email" rules={[{ type: 'email' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="phoneNumber" label="Phone Number">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="aliasName" label="Alias Name (Login ID Reference)">
                        <Input placeholder="Optional alias" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PostDetailsPage;
