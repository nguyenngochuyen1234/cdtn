import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Modal,
    TextField,
    Typography,
    CircularProgress,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ownerApi from '@/api/ownApi';
import { Review } from '@/models';
import { ReplyIcon } from 'lucide-react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import commentApi from '@/api/comment';

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
    const [comment, setComment] = useState<{ id: string; content: string } | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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

    const fetchCommentsByReviewId = async (reviewId: string) => {
        try {
            const resComment = await commentApi.getCommentsByReviewId(reviewId);
            console.log('Fetched comment:', resComment.data.data);
            const commentData = resComment.data.data;
            setComment(commentData ? { id: commentData.id, content: commentData.content } : null);
            return commentData;
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComment(null);
            return null;
        }
    };

    useEffect(() => {
        fetchDataShop();
    }, []);

    const handleOpenReplyModal = async (reviewId: string) => {
        setSelectedReviewId(reviewId);
        const existingComment = await fetchCommentsByReviewId(reviewId);
        if (existingComment) {
            setReplyContent(existingComment.content);
        } else {
            setReplyContent('');
        }
        setReplyModalOpen(true);
    };

    const handleSendOrUpdateReply = async () => {
        if (!selectedReviewId || !replyContent.trim()) return;

        try {
            if (comment) {
                await commentApi.updateComment(comment.id, { content: replyContent });
                console.log('Comment updated:', replyContent);
                setComment({ ...comment, content: replyContent });
            } else {
                const res = await commentApi.createComment(selectedReviewId, {
                    content: replyContent,
                });
                console.log('Reply sent for:', selectedReviewId, replyContent);
                setComment({ id: res.data.data.id, content: replyContent });
            }
            setReplyModalOpen(false);
            setReplyContent('');
        } catch (error) {
            console.error('Error sending/updating reply:', error);
        }
    };

    const handleOpenDeleteConfirm = () => {
        if (comment?.id) {
            setDeleteConfirmOpen(true); // Open confirmation dialog
        }
    };

    const handleDeleteComment = async () => {
        if (!comment?.id) return;

        try {
            await commentApi.deleteComment(comment.id);
            console.log('Comment deleted:', comment.id);
            setComment(null);
            setReplyContent('');
            setReplyModalOpen(false); // Close reply modal after deletion
        } catch (error) {
            console.error('Error deleting comment:', error);
        } finally {
            setDeleteConfirmOpen(false); // Close confirmation dialog
        }
    };

    const handleRowClick = async (params: any) => {
        await fetchCommentsByReviewId(params.row.id);
        setSelectedReviewDetail(params.row);
        setDetailModalOpen(true);
    };

    const columns: GridColDef[] = [
        {
            field: 'reviewContent',
            headerName: 'Nội dung',
            width: 500,
            flex: 1,
        },
        {
            field: 'rating',
            headerName: 'Điểm đánh giá',
            width: 200,
        },
        {
            field: 'createdAt',
            headerName: 'Ngày tạo',
            width: 200,
            valueFormatter: (params) => new Date(params).toLocaleString(),
        },
        {
            field: 'actions',
            headerName: 'Hành động',
            width: 150,
            renderCell: (params) => (
                <div>
                    <IconButton
                        aria-label="reply"
                        onClick={() => handleOpenReplyModal(params.row.id)}
                    >
                        <ReplyIcon />
                    </IconButton>
                    <IconButton aria-label="view details" onClick={() => handleRowClick(params)}>
                        <VisibilityIcon />
                    </IconButton>
                </div>
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
                />
            )}

            {/* Modal trả lời */}
            <Modal open={replyModalOpen} onClose={() => setReplyModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>
                        {comment ? 'Chỉnh sửa phản hồi' : 'Trả lời đánh giá'}
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
                    <Box display="flex" gap={2}>
                        <Button variant="contained" onClick={handleSendOrUpdateReply} fullWidth>
                            {comment ? 'Cập nhật' : 'Gửi phản hồi'}
                        </Button>
                        {comment && (
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleOpenDeleteConfirm} // Open confirmation dialog
                                startIcon={<DeleteIcon />}
                                fullWidth
                            >
                                Xóa
                            </Button>
                        )}
                    </Box>
                </Box>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Xác nhận xóa phản hồi</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa phản hồi này không?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleDeleteComment} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

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
                            <Box mt={2}>
                                <Typography fontWeight="bold">Phản hồi:</Typography>
                                <Typography>
                                    {comment ? comment.content : 'Chưa có phản hồi nào.'}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default ReviewsPage;
