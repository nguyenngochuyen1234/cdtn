import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, TextField, Typography, CircularProgress, Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ownerApi from '@/api/ownApi';
import { Review } from '@/models';

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const ReviewsPage = () => {
    const [recentReviews, setRecentReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedReviewDetail, setSelectedReviewDetail] = useState<Review | null>(null);

    const fetchDataShop = async () => {
        try {
            setLoading(true);
            const resReviews = await ownerApi.getReview({ limit: 12, page: 0 });
            setRecentReviews(resReviews.data.data || []);
        } catch (error) {
            console.error('Error fetching shop data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataShop();
    }, []);

    const handleOpenReplyModal = (reviewId: string) => {
        setSelectedReviewId(reviewId);
        setReplyModalOpen(true);
    };

    const handleSendReply = async () => {
        console.log('Send reply for:', selectedReviewId, replyContent);
        setReplyModalOpen(false);
        setReplyContent('');
    };

    const handleRowClick = (params: any) => {
        setSelectedReviewDetail(params.row);
        setDetailModalOpen(true);
    };

    const columns: GridColDef[] = [
        {
            field: 'reviewContent',
            headerName: 'Nội dung',
            flex: 1,
        },
        {
            field: 'rating',
            headerName: 'Số sao',
            width: 100,
        },
        {
            field: 'mediaUrlReview',
            headerName: 'Ảnh',
            width: 100,
            renderCell: (params) => {
                const firstImage = (params.value as string[])[0];
                return firstImage ? (
                    <img
                        src={firstImage}
                        alt="media"
                        width={40}
                        height={40}
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                    />
                ) : null;
            },
        },
        {
            field: 'createdAt',
            headerName: 'Ngày tạo',
            width: 180,
            valueFormatter: (params) => new Date(params.value).toLocaleString(),
        },
        {
            field: 'actions',
            headerName: '',
            width: 150,
            renderCell: (params) => (
                <Button variant="outlined" onClick={() => handleOpenReplyModal(params.row.id)}>
                    Trả lời
                </Button>
            ),
        },
    ];

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Đánh giá gần đây
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                <DataGrid
                    rows={recentReviews}
                    columns={columns}
                    getRowId={(row) => row.id}
                    autoHeight
                    pageSizeOptions={[5, 10]}
                    onRowClick={handleRowClick}
                />
            )}

            {/* Modal trả lời */}
            <Modal open={replyModalOpen} onClose={() => setReplyModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>
                        Trả lời đánh giá
                    </Typography>
                    <TextField
                        label="Nội dung phản hồi"
                        fullWidth
                        multiline
                        minRows={3}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        margin="normal"
                    />
                    <Button variant="contained" onClick={handleSendReply} fullWidth>
                        Gửi phản hồi
                    </Button>
                </Box>
            </Modal>

            {/* Modal xem chi tiết */}
            <Modal open={detailModalOpen} onClose={() => setDetailModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>
                        Chi tiết đánh giá
                    </Typography>
                    {selectedReviewDetail && (
                        <>
                            <Typography>
                                <strong>Nội dung:</strong> {selectedReviewDetail.reviewContent}
                            </Typography>
                            <Typography>
                                <strong>Số sao:</strong> {selectedReviewDetail.rating}
                            </Typography>
                            <Typography>
                                <strong>Ngày tạo:</strong>{' '}
                                {new Date(selectedReviewDetail.createdAt).toLocaleString()}
                            </Typography>
                            <Box mt={2}>
                                <Typography fontWeight="bold">Hình ảnh:</Typography>
                                <Grid container spacing={1}>
                                    {selectedReviewDetail.mediaUrlReview?.map((url, idx) => (
                                        <Grid item xs={4} key={idx}>
                                            <img
                                                src={url}
                                                alt={`review-img-${idx}`}
                                                width="100%"
                                                style={{ borderRadius: 4 }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default ReviewsPage;
