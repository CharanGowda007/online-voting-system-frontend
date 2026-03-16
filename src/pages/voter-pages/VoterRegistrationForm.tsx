
import { useEffect } from 'react';
import { Card, Form, Input, Button, DatePicker, Select, Divider, message, Typography } from 'antd';
import { IdcardOutlined, SendOutlined, PhoneOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../config/store';
import { submitVoterRegistration, resetVoterRegistrationState } from '../../reducers/voter-register.reducer';
import { fetchStates } from '../../reducers/masters/masterState.reducer';
import { fetchPCs, clearPCs } from '../../reducers/masters/masterPC.reducer';
import { fetchACs, clearACs } from '../../reducers/masters/masterAC.reducer';

const { Title, Paragraph } = Typography;
const { Option } = Select;

export default function VoterRegistrationForm() {
    const [form] = Form.useForm();
    const dispatch = useDispatch<AppDispatch>();
    
    // Auth & Form state
    const { loading } = useSelector((state: RootState) => state.voterRegistration);
    
    // Master data state
    const { states, loading: statesLoading } = useSelector((state: RootState) => state.masterState);
    const { pcs, loading: pcsLoading } = useSelector((state: RootState) => state.masterPC);
    const { acs, loading: acsLoading } = useSelector((state: RootState) => state.masterAC);

    // Initial load: Fetch all states
    useEffect(() => {
        dispatch(fetchStates(undefined)); // Fetch all states
    }, [dispatch]);

    const handleStateChange = (stateCode: number) => {
        form.setFieldsValue({ pcCode: undefined, acCode: undefined });
        dispatch(clearPCs());
        dispatch(clearACs());
        dispatch(fetchPCs(stateCode));
    };

    const handlePCChange = (pcCode: number) => {
        form.setFieldsValue({ acCode: undefined });
        dispatch(clearACs());
        dispatch(fetchACs(pcCode));
    };

    const onFinish = async (values: any) => {
        try {
            // Format dates simply for backend string digestion 
            const formattedValues = {
                ...values,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
            };
            
            await dispatch(submitVoterRegistration(formattedValues)).unwrap();
            message.success('Form 6 Voter Application submitted successfully! Registration ID saved.');
            form.resetFields();
            dispatch(resetVoterRegistrationState());
            
            // Clear downstream dropdowns
            dispatch(clearPCs());
            dispatch(clearACs());
            
            window.scrollTo(0, 0);
        } catch (errorMsg: any) {
            message.error(`Submission failed: ${errorMsg}`);
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
            <Card bordered={true} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Title level={3} style={{ margin: 0 }}>FORM 6</Title>
                    <Paragraph type="secondary">Application for inclusion of name in Elector Roll for First time Voter</Paragraph>
                </div>

                <Divider />

                <Form
                    form={form}
                    layout="vertical"
                    name="form6_voter_registration"
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Title level={5}>I. Personal Details</Title>
                    <Form.Item name="applicantName" label="Applicant's Full Name" rules={[{ required: true, message: 'Please enter your name' }]}>
                        <Input prefix={<IdcardOutlined />} placeholder="First Name followed by Surname" />
                    </Form.Item>
                    <Form.Item name="relativeName" label="Name of Relative of Applicant (Father/Mother/Husband/Guardian)" rules={[{ required: true, message: 'Please enter relative name' }]}>
                        <Input prefix={<IdcardOutlined />} placeholder="e.g. Rakesh Sharma" />
                    </Form.Item>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true, message: 'Please select DOB' }]}>
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                        </Form.Item>
                        <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select Gender' }]}>
                            <Select placeholder="Select Gender">
                                <Option value="Male">Male</Option>
                                <Option value="Female">Female</Option>
                                <Option value="Third Gender">Third Gender</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item name="placeOfBirth" label="Place of Birth" rules={[{ required: true, message: 'Please enter Village/Town of birth' }]}>
                        <Input placeholder="Enter place of birth" />
                    </Form.Item>

                    <Title level={5} style={{ marginTop: '24px' }}>II. Contact Information</Title>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item name="mobile" label="Mobile Number" rules={[
                            { required: true, message: 'Required' },
                            { pattern: /^[0-9]{10}$/, message: 'Must be exactly 10 digits' }
                        ]}>
                            <Input prefix={<PhoneOutlined />} placeholder="10-digit mobile" maxLength={10} onKeyPress={e => (!/[0-9]/.test(e.key)) && e.preventDefault()} />
                        </Form.Item>
                        <Form.Item name="email" label="Email Address">
                            <Input prefix={<MailOutlined />} placeholder="Optional Email" type="email" />
                        </Form.Item>
                    </div>

                    <Title level={5} style={{ marginTop: '24px' }}>III. Aadhaar Details</Title>
                    <Form.Item name="aadhaarNumber" label="Aadhaar Number (Optional)" rules={[
                        { pattern: /^[0-9]{12}$/, message: 'Aadhaar must be exactly 12 digits' }
                    ]}>
                        <Input prefix={<IdcardOutlined />} placeholder="12-digit Aadhaar Number" maxLength={12} onKeyPress={e => (!/[0-9]/.test(e.key)) && e.preventDefault()} />
                    </Form.Item>

                    <Title level={5} style={{ marginTop: '24px' }}>IV. Ordinary Residence Address</Title>
                    <Form.Item name="streetAddress" label="House/Building/Apartment No. & Street/Area" rules={[{ required: true, message: 'Enter full street address' }]}>
                        <Input prefix={<HomeOutlined />} placeholder="House No, Street Area" />
                    </Form.Item>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item name="villageTown" label="Town / Village" rules={[{ required: true, message: 'Enter your Town or Village' }]}>
                            <Input placeholder="Enter Town/Village" />
                        </Form.Item>
                        <Form.Item name="postOffice" label="Post Office (PO)" rules={[{ required: true, message: 'Enter PO Name' }]}>
                            <Input placeholder="Enter Post Office" />
                        </Form.Item>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <Form.Item name="pincode" label="PIN Code" rules={[
                            { required: true, message: 'Required' },
                            { pattern: /^[0-9]{6}$/, message: 'Must be exactly 6 digits' }
                        ]}>
                            <Input placeholder="6 digits" maxLength={6} onKeyPress={e => (!/[0-9]/.test(e.key)) && e.preventDefault()} />
                        </Form.Item>
                        <Form.Item name="tehsil" label="Tehsil/Mandal" rules={[{ required: true, message: 'Enter Tehsil' }]}>
                            <Input placeholder="Enter Tehsil" />
                        </Form.Item>
                        <Form.Item name="district" label="District" rules={[{ required: true, message: 'Enter District' }]}>
                            <Input placeholder="Enter District" />
                        </Form.Item>
                    </div>
                    
                    <Title level={5} style={{ marginTop: '24px' }}>V. Constituency Information</Title>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <Form.Item name="stateCode" label="State/UT" rules={[{ required: true, message: 'Select State' }]}>
                            <Select 
                                placeholder="Select State" 
                                onChange={handleStateChange}
                                loading={statesLoading}
                                showSearch
                                optionFilterProp="children"
                            >
                                {states.map(state => (
                                    <Option key={state.stateCode} value={state.stateCode}>
                                        {state.stateName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="pcCode" label="Parliamentary Constituency" rules={[{ required: true, message: 'Select PC' }]}>
                            <Select 
                                placeholder="Select PC" 
                                onChange={handlePCChange}
                                loading={pcsLoading}
                                disabled={pcs.length === 0 && !pcsLoading}
                                showSearch
                                optionFilterProp="children"
                            >
                                {pcs.map(pc => (
                                    <Option key={pc.pcCode} value={pc.pcCode}>
                                        {pc.parliamentName} ({pc.reservationCategory})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="acCode" label="Assembly Constituency" rules={[{ required: true, message: 'Select AC' }]}>
                            <Select 
                                placeholder="Select AC" 
                                loading={acsLoading}
                                disabled={acs.length === 0 && !acsLoading}
                                showSearch
                                optionFilterProp="children"
                            >
                                {acs.map(ac => (
                                    <Option key={ac.assemblyCode} value={ac.assemblyCode}>
                                        {ac.assemblyName} ({ac.reservationCategory})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <Divider />
                    
                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" shape="round" icon={<SendOutlined />} size="large" loading={loading} style={{ width: '200px', backgroundColor: '#52c41a' }}>
                            Submit Application
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
