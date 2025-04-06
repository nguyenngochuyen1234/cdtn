import React, { useState } from 'react';
import {
    Table,
    Button as ButtonAntd,
    Modal,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Select,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Button, Container } from '@mui/material';

interface Advertisement {
    key: string;
    name: string;
    description: string;
    price: number;
    advertisementTypeEnum: string;
    thumbnail: string;
    duration: string;
}

const initialData: Advertisement[] = [
    {
        key: '1',
        name: 'Sample Ad',
        description: 'This is a sample advertisement.',
        price: 100,
        advertisementTypeEnum: 'PREMIUM',
        thumbnail: 'https://via.placeholder.com/150',
        duration: new Date().toISOString(),
    },
];

const AdvertisementPage: React.FC = () => {
    const [data, setData] = useState<Advertisement[]>(initialData);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<Advertisement | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingItem(null);
        setModalVisible(true);
        form.resetFields();
    };

    const handleEdit = (record: Advertisement) => {
        setEditingItem(record);
        setModalVisible(true);
        form.setFieldsValue({ ...record, duration: dayjs(record.duration) });
    };

    const handleDelete = (key: string) => {
        setData(data.filter((item) => item.key !== key));
    };

    const handleFormSubmit = (values: any) => {
        const newData = {
            ...values,
            key: editingItem ? editingItem.key : Date.now().toString(),
            duration: values.duration.toISOString(),
        };
        if (editingItem) {
            setData(data.map((item) => (item.key === editingItem.key ? newData : item)));
        } else {
            setData([...data, newData]);
        }
        setModalVisible(false);
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        { title: 'Type', dataIndex: 'advertisementTypeEnum', key: 'advertisementTypeEnum' },
        {
            title: 'Thumbnail',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render: (url: string) => <img src={url} alt="Thumbnail" style={{ width: 50 }} />,
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Advertisement) => (
                <>
                    <ButtonAntd
                        style={{ marginRight: 5 }}
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <ButtonAntd
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.key)}
                        danger
                    />
                </>
            ),
        },
    ];

    return (
        <Container>
            <Button
                onClick={handleAdd}
                variant="contained"
                className="bg-blue-500 hover:bg-blue-600"
            >
                Thêm mới quảng cáo
            </Button>
            <Table columns={columns} dataSource={data} rowKey="key" />
            <Modal
                title={editingItem ? 'Edit Advertisement' : 'Add Advertisement'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="advertisementTypeEnum"
                        label="Type"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { value: 'PREMIUM', label: 'PREMIUM' },
                                { value: 'STANDARD', label: 'STANDARD' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="thumbnail" label="Thumbnail URL" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="duration" label="Duration" rules={[{ required: true }]}>
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </Container>
    );
};

export default AdvertisementPage;
