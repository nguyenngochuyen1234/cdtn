import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Upload, message, Select, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import userApi from '@/api/userApi';
import shopApi from '@/api/shopApi';

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
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [form] = Form.useForm();
    const [email, setEmail] = useState('');
    const fetchDataUser = async () => {
        try {
            const res = await userApi.getUser();
            if (res.data.success) {
                setEmail(res.data.data.email);
            }
        } catch (err) {}
    };
    useEffect(() => {
        fetchDataUser();
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

    const handleDelete = (id: string) => {
        setServices(services.filter((service) => service.id !== id));
        message.success('Xóa dịch vụ thành công');
    };

    const handleSave = async () => {
        console.log(email);
        try {
            // form.validateFields().then(async (values) => {
            //     const { mediaUrl, ...rest } = values;
            //     // Lấy danh sách File từ `fileList`
            //     const fileList = mediaUrl?.fileList || [];
            //     const files: File[] = fileList
            //         .map(
            //             (file: any) => file.originFileObj // Lấy file gốc từ Ant Design
            //         )
            //         .filter(Boolean); // Lọc các giá trị undefined (nếu có)
            //     const newService = {
            //         ...rest,
            //         mediaUrl: files, // Lưu dưới dạng File[]
            //     };
            //     // const meadiaUrls = await shopApi.uploadMultipleImage(
            //     //     files as File[],
            //     //     email as string
            //     // );
            //     console.log({ files, email });
            //     if (editingService) {
            //         setServices((prev) =>
            //             prev.map((service) =>
            //                 service.id === editingService.id
            //                     ? { ...newService, id: service.id }
            //                     : service
            //             )
            //         );
            //         message.success('Cập nhật dịch vụ thành công');
            //     } else {
            //         setServices([
            //             ...services,
            //             { ...newService, id: Math.random().toString(36).substr(2, 9) },
            //         ]);
            //         message.success('Thêm dịch vụ thành công');
            //     }
            //     setIsModalOpen(false);
            // });
        } catch (err) {}
    };

    const columns: ColumnsType<Service> = [
        { title: 'Tên dịch vụ', dataIndex: 'name', key: 'name' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Hình ảnh',
            dataIndex: 'mediaUrl',
            key: 'mediaUrl',
            // render: (mediaUrl: string[]) =>
            //     (mediaUrl || []).map((url, index) => (
            //         <img key={index} src={url} alt="media" style={{ width: 50, marginRight: 5 }} />
            //     )),
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
