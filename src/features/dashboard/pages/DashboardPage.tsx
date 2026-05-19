import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Spin, Typography, Tag, Select, Space, Button, Divider } from 'antd';
import { UserOutlined, ManOutlined, WomanOutlined, TeamOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { fetchVoterStats } from '../redux/dashboard.reducer';
import { fetchStates, MasterState } from '../../admin/redux/masterState.reducer';
import { fetchPCs, clearPCs, MasterPC } from '../../admin/redux/masterPC.reducer';
import { fetchACs, clearACs, MasterAC } from '../../admin/redux/masterAC.reducer';

ChartJS.register(ArcElement, Tooltip, Legend);

const { Title, Text } = Typography;

const GENDER_COLORS: Record<string, string> = {
    Male: '#60a5fa', // lighter blue for dark theme
    Female: '#f472b6', // pink
    'Third Gender': '#c084fc', // purple
    Other: '#4ade80', // green
};

const GENDER_ICONS: Record<string, React.ReactNode> = {
    Male: <ManOutlined />,
    Female: <WomanOutlined />,
    'Third Gender': <TeamOutlined />,
    Other: <UserOutlined />,
};

export default function DashboardPage() {
    const dispatch = useDispatch<AppDispatch>();

    // Stats
    const { total, byGender, loading } = useSelector((state: RootState) => state.dashboard);

    // Master data for filters
    const { states, loading: statesLoading } = useSelector((state: RootState) => state.masterState);
    const { pcs, loading: pcsLoading } = useSelector((state: RootState) => state.masterPC);
    const { acs, loading: acsLoading } = useSelector((state: RootState) => state.masterAC);

    // Local filter state
    const [selectedState, setSelectedState] = useState<number | undefined>();
    const [selectedPC, setSelectedPC] = useState<number | undefined>();
    const [selectedAC, setSelectedAC] = useState<number | undefined>();

    // On mount: load states and initial stats
    useEffect(() => {
        dispatch(fetchStates(undefined));
        dispatch(fetchVoterStats(undefined));
    }, [dispatch]);

    const handleStateChange = (val: number) => {
        setSelectedState(val);
        setSelectedPC(undefined);
        setSelectedAC(undefined);
        dispatch(clearPCs());
        dispatch(clearACs());
        dispatch(fetchPCs(val));
        dispatch(fetchVoterStats({ stateCode: val }));
    };

    const handlePCChange = (val: number) => {
        setSelectedPC(val);
        setSelectedAC(undefined);
        dispatch(clearACs());
        dispatch(fetchACs(val));
        dispatch(fetchVoterStats({ stateCode: selectedState, pcCode: val }));
    };

    const handleACChange = (val: number) => {
        setSelectedAC(val);
        dispatch(fetchVoterStats({ stateCode: selectedState, pcCode: selectedPC, acCode: val }));
    };

    const handleClearFilters = () => {
        setSelectedState(undefined);
        setSelectedPC(undefined);
        setSelectedAC(undefined);
        dispatch(clearPCs());
        dispatch(clearACs());
        dispatch(fetchVoterStats(undefined));
    };

    const filterLabel = selectedAC
        ? `AC: ${acs.find((a: MasterAC) => a.assemblyCode === selectedAC)?.assemblyName}`
        : selectedPC
        ? `PC: ${pcs.find((p: MasterPC) => p.parliamentCode === selectedPC)?.parliamentName}`
        : selectedState
        ? `State: ${states.find((s: MasterState) => s.stateCode === selectedState)?.stateName}`
        : 'All Voters';

    const chartData = {
        labels: byGender.map((g: { gender: string; count: number }) => g.gender),
        datasets: [
            {
                data: byGender.map((g: { gender: string; count: number }) => g.count),
                backgroundColor: byGender.map((g: { gender: string; count: number }) => GENDER_COLORS[g.gender] ?? '#94a3b8'),
                borderColor: 'rgba(13, 5, 39, 0.9)', // match dark background
                borderWidth: 2,
                hoverOffset: 12,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: '#f1f5f9', // dark theme text
                    padding: 24,
                    font: { size: 13 },
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(13, 5, 39, 0.95)',
                titleColor: '#f1f5f9',
                bodyColor: '#f1f5f9',
                borderColor: 'rgba(139, 92, 246, 0.3)',
                borderWidth: 1,
                callbacks: {
                    label: (ctx: any) => {
                        const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0.0';
                        return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
                    },
                },
            },
        },
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0, color: '#f1f5f9' }}>📊 Voter Dashboard</Title>
                <Text style={{ color: '#94a3b8' }}>Real-time overview of registered voters</Text>
            </div>

            {/* Filter Panel */}
            <Card
                className="glass-card"
                bordered={false}
                style={{ marginBottom: 28 }}
                bodyStyle={{ padding: '16px 24px' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <FilterOutlined style={{ fontSize: 18, color: '#8b5cf6' }} />
                    <Text strong style={{ color: '#8b5cf6', marginRight: 8 }}>Filter by Constituency</Text>
                    <Space wrap>
                        <Select
                            placeholder="Select State"
                            value={selectedState}
                            onChange={handleStateChange}
                            loading={statesLoading}
                            showSearch
                            optionFilterProp="children"
                            style={{ minWidth: 180 }}
                            allowClear
                            onClear={handleClearFilters}
                            popupClassName="dark-dropdown"
                        >
                            {states.map((s: MasterState) => (
                                <Select.Option key={s.stateCode} value={s.stateCode}>{s.stateName}</Select.Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Select PC"
                            value={selectedPC}
                            onChange={handlePCChange}
                            loading={pcsLoading}
                            disabled={!selectedState}
                            showSearch
                            optionFilterProp="children"
                            style={{ minWidth: 220 }}
                            allowClear
                            onClear={() => {
                                setSelectedPC(undefined);
                                setSelectedAC(undefined);
                                dispatch(clearACs());
                                dispatch(fetchVoterStats({ stateCode: selectedState }));
                            }}
                            popupClassName="dark-dropdown"
                        >
                            {pcs.map((p: MasterPC) => (
                                <Select.Option key={p.parliamentCode} value={p.parliamentCode}>
                                    {p.parliamentName} <Tag color="purple" style={{ fontSize: 10 }}>{p.reservationCategory}</Tag>
                                </Select.Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Select AC"
                            value={selectedAC}
                            onChange={handleACChange}
                            loading={acsLoading}
                            disabled={!selectedPC}
                            showSearch
                            optionFilterProp="children"
                            style={{ minWidth: 220 }}
                            allowClear
                            onClear={() => {
                                setSelectedAC(undefined);
                                dispatch(fetchVoterStats({ stateCode: selectedState, pcCode: selectedPC }));
                            }}
                            popupClassName="dark-dropdown"
                        >
                            {acs.map((a: MasterAC) => (
                                <Select.Option key={a.assemblyCode} value={a.assemblyCode}>
                                    {a.assemblyName} <Tag color="purple" style={{ fontSize: 10 }}>{a.reservationCategory}</Tag>
                                </Select.Option>
                            ))}
                        </Select>
                        {(selectedState || selectedPC || selectedAC) && (
                            <Button icon={<ClearOutlined />} onClick={handleClearFilters} style={{ background: 'transparent', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.2)' }}>
                                Clear
                            </Button>
                        )}
                    </Space>
                </div>
            </Card>

            {/* Summary Cards */}
            <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        className="glass-card"
                        hoverable
                        style={{ border: '1px solid rgba(96, 165, 250, 0.3)' }}
                    >
                        <Statistic
                            title={<Text style={{ color: '#94a3b8' }} strong>Total Voters</Text>}
                            value={total}
                            prefix={<UserOutlined style={{ color: '#60a5fa' }} />}
                            valueStyle={{ color: '#60a5fa', fontSize: 28, fontWeight: 700 }}
                            loading={loading}
                        />
                        <div style={{ marginTop: 4 }}>
                            <Text style={{ color: '#64748b', fontSize: 11 }}>{filterLabel}</Text>
                        </div>
                    </Card>
                </Col>
                {byGender.map((g: { gender: string; count: number }) => (
                    <Col xs={24} sm={12} lg={6} key={g.gender}>
                        <Card
                            className="glass-card"
                            hoverable
                            style={{ border: `1px solid ${GENDER_COLORS[g.gender] ?? '#94a3b8'}44` }}
                        >
                            <Statistic
                                title={<Text style={{ color: '#94a3b8' }} strong>{g.gender}</Text>}
                                value={g.count}
                                prefix={<span style={{ color: GENDER_COLORS[g.gender] ?? '#94a3b8' }}>{GENDER_ICONS[g.gender] ?? <UserOutlined />}</span>}
                                valueStyle={{ color: GENDER_COLORS[g.gender] ?? '#94a3b8', fontSize: 28, fontWeight: 700 }}
                                suffix={
                                    <Tag color={GENDER_COLORS[g.gender] ?? 'default'} style={{ marginLeft: 8, fontSize: 11, background: 'transparent', border: `1px solid ${GENDER_COLORS[g.gender]}` }}>
                                        {total > 0 ? ((g.count / total) * 100).toFixed(1) : '0.0'}%
                                    </Tag>
                                }
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Doughnut Chart */}
            <Row gutter={[20, 20]} justify="center">
                <Col xs={24} md={14} lg={12}>
                    <Card
                        className="glass-card"
                        bordered={false}
                    >
                        <div style={{ textAlign: 'center', marginBottom: 4 }}>
                            <Title level={4} style={{ margin: 0, color: '#f1f5f9' }}>Gender Breakdown</Title>
                            <Text style={{ color: '#94a3b8', fontSize: 13 }}>{filterLabel}</Text>
                        </div>
                        <Divider style={{ margin: '12px 0', borderColor: 'rgba(255,255,255,0.1)' }} />

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                <Spin size="large" />
                                <div style={{ marginTop: 16 }}>
                                    <Text style={{ color: '#94a3b8' }}>Loading voter data...</Text>
                                </div>
                            </div>
                        ) : total === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                <UserOutlined style={{ fontSize: 48, color: '#475569' }} />
                                <div style={{ marginTop: 16 }}>
                                    <Text style={{ color: '#94a3b8' }}>No voter registrations found for the selected filter.</Text>
                                </div>
                            </div>
                        ) : (
                            <div style={{ position: 'relative', maxWidth: 380, margin: '0 auto' }}>
                                <Doughnut data={chartData} options={chartOptions} />
                                <div style={{
                                    position: 'absolute',
                                    top: '45%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center',
                                    pointerEvents: 'none',
                                }}>
                                    <div style={{ fontSize: 32, fontWeight: 800, color: '#8b5cf6', lineHeight: 1 }}>
                                        {total}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Total</div>
                                </div>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
