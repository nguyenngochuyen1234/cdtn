import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Upload, message, Select, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import userApi from '@/api/userApi';
import shopApi from '@/api/shopApi';
import ownerApi from '@/api/ownApi';

interface Service {
    id?: string;
    name: string;
    description: string;
    thumbnail: string;
    mediaUrl: string[];
    countReview: number;
    point: number;
    price: number;
    status: 'Open' | 'Close';
}

const ServiceTable: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [editingService, setEditingService] = useState<Service | null>(null);
    const [form] = Form.useForm();
    const [email, setEmail] = useState('');
    const fetchData = async () => {
        try {
            const res = await userApi.getUser();
            const dataService = await ownerApi.getAllService({
                limit: 12,
                page: 0,
            });
            if (res.data.success) {
                setEmail(res.data.data.email);
            }
            console.log(dataService.data.data);
            if (dataService.data.success) {
                setServices(dataService.data.data);
            }
        } catch (err) {}
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleAdd = () => {
        setEditingService(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: Service) => {
        setEditingService(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            setServices(services.filter((service) => service.id !== id));
            await ownerApi.deleteService(id);
            message.success('Xóa dịch vụ thành công');
        } catch {}
    };

    const handleSave = async () => {
        try {
            form.validateFields().then(async (values) => {
                const { mediaUrl, thumbnail, ...rest } = values;

                const mediaFiles = mediaUrl?.fileList || [];
                const thumbFile = thumbnail?.fileList?.[0]?.originFileObj;

                const mediaUrls = await shopApi.uploadMultipleImage(
                    mediaFiles.map((file: { originFileObj: any }) => file.originFileObj),
                    email
                );

                let thumbnailUrl = editingService?.thumbnail;
                if (thumbFile) {
                    const response = await shopApi.uploadImageShop(thumbFile, email);
                    thumbnailUrl = typeof response === 'string' ? response : response.data?.data;
                }

                const newService = {
                    ...rest,
                    mediaUrl: mediaUrls.data.data,
                    thumbnail: thumbnailUrl || '',
                };
                if (editingService) {
                    setServices((prev) =>
                        prev.map((service) =>
                            service.id === editingService.id
                                ? { ...newService, id: service.id }
                                : service
                        )
                    );
                    message.success('Cập nhật dịch vụ thành công');
                } else {
                    const res = await ownerApi.createService(newService);
                    if (res.data.success) {
                        setServices([...services, { ...res.data.data }]);
                        message.success('Thêm dịch vụ thành công');
                    }
                }
                setIsModalOpen(false);
            });
        } catch (err) {
            console.error('Lỗi khi lưu dịch vụ:', err);
        }
    };

    const columns: ColumnsType<Service> = [
        { title: 'Tên dịch vụ', dataIndex: 'name', key: 'name' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Ảnh đại diện',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render: (thumbnail) => (
                <img
                    src={thumbnail}
                    alt="Thumbnail"
                    style={{ width: 50, height: 50, borderRadius: 8 }}
                />
            ),
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'mediaUrl',
            key: 'mediaUrl',
            render: (mediaUrl: string[]) =>
                (mediaUrl || []).map((url, index) => (
                    <img key={index} src={url} alt="media" style={{ width: 50, marginRight: 5 }} />
                )),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price.toLocaleString()} VND`,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) =>
                status === 'Open' ? <Tag color="green">Mở</Tag> : <Tag color="red">Đóng</Tag>,
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        style={{ marginRight: 8 }}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id!)}
                        danger
                    />
                </>
            ),
        },
    ];

    return (
        <>
            <Button icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
                Thêm dịch vụ
            </Button>
            <Table dataSource={services} columns={columns} rowKey="id" />
            <Modal
                title={editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                        Hủy bỏ
                    </Button>,
                    <Button key="submit" onClick={handleSave}>
                        Lưu
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên dịch vụ"
                        rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="thumbnail"
                        label="Ảnh đại diện"
                        rules={[{ required: true, message: 'Vui lòng chọn ảnh đại diện!' }]}
                    >
                        <Upload beforeUpload={() => false} listType="picture">
                            <Button icon={<UploadOutlined />}>Chọn ảnh đại diện</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        name="mediaUrl"
                        label="Hình ảnh"
                        rules={[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]}
                    >
                        <Upload beforeUpload={() => false} listType="picture" multiple>
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Giá"
                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select>
                            <Select.Option value="Open">Mở</Select.Option>
                            <Select.Option value="Close">Đóng</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ServiceTable;
