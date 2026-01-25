import React, { useState } from 'react';
import {
    Form,
    Input,
    Select,
    DatePicker,
    Button,
    Card,
    Upload,
    Radio,
    message,
    Checkbox,
    Row,
    Col,
    Space
} from 'antd';
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function VoterForm() {
    const [form] = Form.useForm();
    const [hasAadhaar, setHasAadhaar] = useState(true);

    const onFinish = (values: any) => {
        console.log('Success:', values);
        message.success('Form submitted successfully!');
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        message.error('Please fill in all required fields correctly.');
    };

    return (
        <div style={{ padding: '2rem', background: '#f0f2f5', minHeight: '100vh' }}>
            <Card title="New Voter Registration Form (Form 6)" bordered={false} style={{ maxWidth: 1000, margin: '0 auto' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{ hasAadhaar: true }}
                >
                    {/* 1. Constituency Details */}
                    <Card type="inner" title="1. Constituency Details" style={{ marginBottom: 24 }}>
                        <Form.Item
                            name="constituency"
                            label="Assembly / Parliamentary Constituency"
                            rules={[{ required: true, message: 'Please enter your Constituency' }]}
                        >
                            <Input placeholder="Enter Assembly/Parliamentary Constituency" />
                        </Form.Item>
                    </Card>

                    {/* 2. Personal Details */}
                    <Card type="inner" title="2. Personal Details" style={{ marginBottom: 24 }}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="fullName"
                                    label="Full Name (includes Surname)"
                                    rules={[{ required: true, message: 'Please enter your Full Name' }]}
                                >
                                    <Input placeholder="Full Name" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="gender"
                                    label="Gender"
                                    rules={[{ required: true, message: 'Please select your Gender' }]}
                                >
                                    <Radio.Group>
                                        <Radio value="male">Male</Radio>
                                        <Radio value="female">Female</Radio>
                                        <Radio value="transgender">Third Gender</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="relativeName"
                                    label="Relative's Name & Surname"
                                    rules={[{ required: true, message: 'Please enter Relative\'s Name' }]}
                                >
                                    <Input placeholder="Name of Relative" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="relationshipType"
                                    label="Relationship Type"
                                    rules={[{ required: true, message: 'Please select Relationship Type' }]}
                                >
                                    <Select placeholder="Select Relationship">
                                        <Option value="father">Father</Option>
                                        <Option value="mother">Mother</Option>
                                        <Option value="husband">Husband</Option>
                                        <Option value="wife">Wife</Option>
                                        <Option value="guardian">Legal Guardian</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* 3. Age and Date of Birth */}
                    <Card type="inner" title="3. Age and Date of Birth" style={{ marginBottom: 24 }}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="dob"
                                    label="Date of Birth"
                                    rules={[{ required: true, message: 'Please select DOB' }]}
                                >
                                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="DD/MM/YYYY" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="age"
                                    label="Age as of Jan 1st of Current Year"
                                    help="Auto-calculated (Simulated)"
                                >
                                    <Input type="number" placeholder="Age" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* 4. Contact Details */}
                    <Card type="inner" title="4. Contact Details (Optional)" style={{ marginBottom: 24 }}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="mobile"
                                    label="Mobile Number"
                                    rules={[{ pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' }]}
                                >
                                    <Input prefix="+91" placeholder="Mobile Number" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="email"
                                    label="Email ID"
                                    rules={[{ type: 'email', message: 'Please enter a valid email' }]}
                                >
                                    <Input placeholder="Email ID" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* 5. Aadhaar Details */}
                    <Card type="inner" title="5. Aadhaar Details" style={{ marginBottom: 24 }}>
                        <Form.Item name="hasAadhaar" valuePropName="checked">
                            <Checkbox onChange={(e) => setHasAadhaar(e.target.checked)}>I have an Aadhaar Number</Checkbox>
                        </Form.Item>

                        {hasAadhaar ? (
                            <Form.Item
                                name="aadhaarNumber"
                                label="Aadhaar Number"
                                rules={[{ required: true, message: 'Please enter Aadhaar Number' }]}
                            >
                                <Input placeholder="Enter 12-digit Aadhaar Number" maxLength={12} />
                            </Form.Item>
                        ) : (
                            <div style={{ color: 'gray', fontStyle: 'italic', marginBottom: 16 }}>
                                Note: If you don't have an Aadhaar number, you must explicitly declare so.
                            </div>
                        )}
                    </Card>

                    {/* 6. Current Address */}
                    <Card type="inner" title="6. Current Address" style={{ marginBottom: 24 }}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="houseNo" label="House No. / Building Name" rules={[{ required: true, message: 'Required' }]}>
                                    <Input placeholder="House No." />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="locality" label="Locality / Area / Street" rules={[{ required: true, message: 'Required' }]}>
                                    <Input placeholder="Locality" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="town" label="Town / Village" rules={[{ required: true, message: 'Required' }]}>
                                    <Input placeholder="Town / Village" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="postOffice" label="Post Office" rules={[{ required: true, message: 'Required' }]}>
                                    <Input placeholder="Post Office" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item name="pincode" label="PIN Code" rules={[{ required: true, message: 'Required' }]}>
                                    <Input placeholder="PIN Code" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="district" label="District" rules={[{ required: true, message: 'Required' }]}>
                                    <Input placeholder="District" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="state" label="State/UT" rules={[{ required: true, message: 'Required' }]}>
                                    <Input placeholder="State/UT" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* 7. Disability Category */}
                    <Card type="inner" title="7. Disability Category (Optional)" style={{ marginBottom: 24 }}>
                        <Form.Item name="disability">
                            <Checkbox.Group>
                                <Row>
                                    <Col span={8}><Checkbox value="visual">Visual Impairment</Checkbox></Col>
                                    <Col span={8}><Checkbox value="speech">Speech & Hearing</Checkbox></Col>
                                    <Col span={8}><Checkbox value="locomotor">Locomotor</Checkbox></Col>
                                    <Col span={8}><Checkbox value="other">Other</Checkbox></Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                    </Card>

                    {/* 8. Family Member Details */}
                    <Card type="inner" title="8. Family Member Details (For Verification)" style={{ marginBottom: 24 }}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="familyMemberName" label="Name of Family Member">
                                    <Input placeholder="Name" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="familyMemberEpic" label="EPIC Number (Voter ID)">
                                    <Input placeholder="EPIC Number" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* 9. Upload Documents */}
                    <Card type="inner" title="9. Upload Documents" style={{ marginBottom: 24 }}>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item
                                    name="photo"
                                    label="Passport Size Photo"
                                    tooltip="3.5cm x 3.5cm, White Background"
                                    rules={[{ required: true, message: 'Please upload Photo' }]}
                                >
                                    <Upload listType="picture" maxCount={1}>
                                        <Button icon={<UploadOutlined />}>Upload Photo</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="ageProof"
                                    label="Proof of Age Document"
                                    rules={[{ required: true, message: 'Please upload Proof of Age' }]}
                                >
                                    <Upload maxCount={1}>
                                        <Button icon={<UploadOutlined />}>Upload Age Proof</Button>
                                    </Upload>
                                    <Select placeholder="Select Document Type" style={{ marginTop: 8 }}>
                                        <Option value="aadhaar">Aadhaar Card</Option>
                                        <Option value="pan">PAN Card</Option>
                                        <Option value="dl">Driving License</Option>
                                        <Option value="passport">Indian Passport</Option>
                                        <Option value="marksheet">Class X/XII Marksheet</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="residenceProof"
                                    label="Proof of Residence"
                                    rules={[{ required: true, message: 'Please upload Proof of Residence' }]}
                                >
                                    <Upload maxCount={1}>
                                        <Button icon={<UploadOutlined />}>Upload Residence Proof</Button>
                                    </Upload>
                                    <Select placeholder="Select Document Type" style={{ marginTop: 8 }}>
                                        <Option value="bill">Water/Elec/Gas Bill</Option>
                                        <Option value="bank">Bank/Post Office Passbook</Option>
                                        <Option value="passport">Indian Passport</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* Declaration & Submit */}
                    <div style={{ textAlign: 'center', marginTop: 32 }}>
                        <Form.Item name="declaration" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Should accept declaration')) }]}>
                            <Checkbox>I hereby declare that the information given above is true to the best of my knowledge.</Checkbox>
                        </Form.Item>

                        <Button type="primary" htmlType="submit" size="large" style={{ width: 200, height: 48, fontSize: 18 }}>
                            Submit Application
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
