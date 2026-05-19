import React, { useState, useEffect } from 'react';
import { Typography, Card, Table, Tag, Button, Input, Modal, Form, message } from 'antd';
import { KeyOutlined, PlusOutlined } from '@ant-design/icons';
import { AdminService } from '../api/admin.service';

const { Title, Text } = Typography;

const RoleCreationPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const data = await AdminService.getRoles();
            setRoles(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            message.error('Failed to fetch roles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const columns = [
        { title: 'Role Code', dataIndex: 'code', key: 'code' },
        { title: 'Role Name', dataIndex: 'name', key: 'name' },
        { 
            title: 'Permissions Count', 
            dataIndex: 'permCount', 
            key: 'permCount',
            render: (count: number) => <Tag color="purple">{count || 0} Permissions</Tag>
        },
        {
            title: 'Action',
            key: 'action',
            render: () => <Button type="link">Manage Permissions</Button>,
        },
    ];

    const handleCreate = async (values: any) => {
        try {
            await AdminService.createRole(values);
            message.success('Role created successfully');
            setIsModalOpen(false);
            form.resetFields();
            fetchRoles();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to create role');
        }
    };

    return (
        <div className="admin-page-content">
            <div className="page-header-premium">
                <div>
                    <Title level={2} className="grad-text" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <KeyOutlined /> Role Management
                    </Title>
                    <Text className="section-sub" style={{ display: 'block', marginTop: '8px' }}>
                        Define system-wide roles, access controls, and granular permission sets
                    </Text>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setIsModalOpen(true)}
                    size="large"
                    className="cta-primary"
                >
                    Create New Role
                </Button>
            </div>

            <Card className="glass-card" bordered={false} bodyStyle={{ padding: 0 }}>
                <Table 
                    columns={columns} 
                    dataSource={roles} 
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title="Create New Role"
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
                    <Form.Item name="name" label="Role Name" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Regional Manager" />
                    </Form.Item>
                    <Form.Item name="code" label="Role Code (Uppercase)" rules={[{ required: true }]}>
                        <Input placeholder="e.g. REGIONAL_MGR" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea placeholder="What this role can do..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RoleCreationPage;
