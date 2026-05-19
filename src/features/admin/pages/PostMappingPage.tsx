import React, { useState, useEffect } from 'react';
import { Typography, Card, Table, Tag, Space, Button, Avatar, Modal, Form, Select, DatePicker, message } from 'antd';
import { SolutionOutlined, PlusOutlined } from '@ant-design/icons';
import { AdminService } from '../api/admin.service';

const { Title, Text } = Typography;

const PostMappingPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mappings, setMappings] = useState<any[]>([]);
    const [unmappedPersons, setUnmappedPersons] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [mappingData, unmappedData, postData] = await Promise.all([
                AdminService.getMappings(),
                AdminService.getUnmappedPersons(),
                AdminService.getPosts()
            ]);
            
            // Post Person Mapping - checking for items or direct array
            const mapItems = Array.isArray(mappingData) ? mappingData : (mappingData.items || mappingData.data || []);
            setMappings(mapItems);

            // Unmapped Persons
            const personItems = Array.isArray(unmappedData) ? unmappedData : (unmappedData.items || unmappedData.data || []);
            setUnmappedPersons(personItems);

            // Posts
            const postItems = Array.isArray(postData) ? postData : (postData.items || postData.data || []);
            setPosts(postItems);
        } catch (error) {
            message.error('Failed to fetch mapping data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { 
            title: 'Person', 
            dataIndex: 'personName', 
            key: 'personName',
            render: (text: string, record: any) => (
                <Space>
                    <Avatar icon={<SolutionOutlined />} />
                    {text || record.person?.firstName + ' ' + (record.person?.lastName || '')}
                </Space>
            )
        },
        { 
            title: 'Assigned Post', 
            dataIndex: 'postName', 
            key: 'postName',
            render: (text: string, record: any) => text || record.post?.postName
        },
        { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
        { 
            title: 'Mapping Status', 
            dataIndex: 'status', 
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'ACTIVE' ? 'blue' : 'default'}>{status}</Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: () => <Button size="small" onClick={() => message.info('Not implemented')}>Reassign</Button>,
        },
    ];

    const handleCreate = async (values: any) => {
        try {
            // Format dates for backend
            const payload = {
                ...values,
                startDate: values.startDate.format('YYYY-MM-DD'),
                endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : undefined
            };
            await AdminService.createMapping(payload);
            message.success('Post-Person mapping created');
            setIsModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to create mapping');
        }
    };

    return (
        <div className="admin-page-content">
            <div className="page-header-premium">
                <div>
                    <Title level={2} className="grad-text" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <SolutionOutlined /> Post-Person Mapping
                    </Title>
                    <Text className="section-sub" style={{ display: 'block', marginTop: '8px' }}>
                        Assign individuals to specific organizational posts and track appointment histories
                    </Text>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setIsModalOpen(true)}
                    size="large"
                    className="cta-primary"
                >
                    Create New Mapping
                </Button>
            </div>

            <Card className="glass-card" bordered={false} bodyStyle={{ padding: 0 }}>
                <Table 
                    columns={columns} 
                    dataSource={mappings} 
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title="Create New Mapping"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreate}
                >
                    <Form.Item name="personId" label="Select Person" rules={[{ required: true }]}>
                        <Select placeholder="Search unmapped persons">
                            {unmappedPersons.map(p => (
                                <Select.Option key={p.id} value={p.id}>
                                    {p.firstName} {p.lastName} ({p.uniqueId || p.aliasName})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="postId" label="Select Post" rules={[{ required: true }]}>
                        <Select placeholder="Select designation">
                            {posts.map(p => (
                                <Select.Option key={p.id} value={p.id}>{p.postName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="endDate" label="End Date (Optional)">
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PostMappingPage;
