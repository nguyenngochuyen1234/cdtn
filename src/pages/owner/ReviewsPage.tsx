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
    Rating,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ownerApi from '@/api/ownApi';
import userApi from '@/api/userApi';
import { Review } from '@/models';
import { ReplyIcon } from 'lucide-react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import commentApi from '@/api/comment';

const modalStyle = (isMobile: boolean) => ({
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '90%' : 600,
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: isMobile ? 2 : 4,
    borderRadius: 2,
});

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
    const [userDetail, setUserDetail] = useState<any>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalRows, setTotalRows] = useState(0);

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchDataShop = async (pageNum: number, pageSizeNum: number) => {
        try {
            setLoading(true);
            const resReviews = await ownerApi.getReview({ limit: pageSizeNum, page: pageNum });
            setRecentReviews(resReviews.data.data || []);
            setTotalRows(resReviews.data.meta?.total || 0); // Giả định API trả về tổng số bản ghi
        } catch (error) {
            console.error('Error fetching shop data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCommentsByReviewId = async (reviewId: string) => {
        try {
            const resComment = await commentApi.getCommentsByReviewId(reviewId);
            const commentData = resComment.data.data;
            setComment(commentData ? { id: commentData.id, content: commentData.content } : null);
            return commentData;
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComment(null);
            return null;
        }
    };

    const fetchUserById = async (idUser: string) => {
        try {
            const resUser = await userApi.getUserById(idUser);
            setUserDetail(resUser.data.data || null);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUserDetail(null);
        }
    };

    useEffect(() => {
        fetchDataShop(page, pageSize);
    }, [page, pageSize]);

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
                setComment({ ...comment, content: replyContent });
            } else {
                const res = await commentApi.createComment(selectedReviewId, {
                    content: replyContent,
                });
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
            setDeleteConfirmOpen(true);
        }
    };

    const handleDeleteComment = async () => {
        if (!comment?.id) return;

        try {
            await commentApi.deleteComment(comment.id);
            setComment(null);
            setReplyContent('');
            setReplyModalOpen(false);
        } catch (error) {
            console.error('Error deleting comment:', error);
        } finally {
            setDeleteConfirmOpen(false);
        }
    };

    const handleRowClick = async (params: any) => {
        await fetchCommentsByReviewId(params.row.id);
        setSelectedReviewDetail(params.row);
        await fetchUserById(params.row.idUser);
        setDetailModalOpen(true);
    };

    const columns: GridColDef[] = [
        {
            field: 'reviewContent',
            headerName: 'Nội dung đánh giá',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <Typography sx={{ py: 1, wordBreak: 'break-word' }}>{params.value}</Typography>
            ),
        },
        {
            field: 'rating',
            headerName: 'Điểm đánh giá',
            width: 150,
            minWidth: 120,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#fff3e0',
                        borderRadius: 2,
                        px: 1,
                        py: 0.5,
                    }}
                >
                    <Rating
                        value={params.value}
                        readOnly
                        precision={0.5}
                        sx={{
                            color: '#ffca28',
                            '& .MuiRating-iconEmpty': {
                                color: '#e0e0e0',
                            },
                        }}
                    />
                    <Typography sx={{ ml: 1, fontWeight: 'bold', color: '#ff9800' }}>
                        {params.value}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'createdAt',
            headerName: 'Ngày đánh giá',
            width: 150,
            minWidth: 120,
            valueFormatter: (params) => new Date(params).toLocaleString(),
            hide: isMobile, // Ẩn trên mobile
        },
        {
            field: 'actions',
            headerName: 'Hành động',
            width: 150,
            minWidth: 120,
            renderCell: (params) => (
                <Box display="flex" gap={1}>
                    {params.row.edit ? (
                        <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleOpenDeleteConfirm}
                        >
                            Xóa
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={comment ? <EditIcon /> : <ReplyIcon />}
                            onClick={() => handleOpenReplyModal(params.row.id)}
                        >
                            {comment && params.row.id === selectedReviewId
                                ? 'Chỉnh sửa'
                                : 'Trả lời'}
                        </Button>
                    )}
                    <IconButton aria-label="view details" onClick={() => handleRowClick(params)}>
                        <VisibilityIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box p={{ xs: 1, sm: 2, md: 3 }}>
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
                    pagination
                    page={page}
                    pageSize={pageSize}
                    rowCount={totalRows}
                    onPageChange={(newPage) => setPage(newPage)}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    pageSizeOptions={[5, 10, 20]}
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f5f5f5',
                            fontWeight: 'bold',
                            color: '#424242',
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: '#e0f7fa',
                        },
                        '& .MuiDataGrid-cell': {
                            display: 'flex',
                            alignItems: 'center',
                        },
                        '& .MuiDataGrid-footerContainer': {
                            justifyContent: 'center',
                        },
                    }}
                />
            )}

            {/* Modal trả lời */}
            <Modal open={replyModalOpen} onClose={() => setReplyModalOpen(false)}>
                <Box sx={modalStyle(isMobile)}>
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
                    <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mt={2}>
                        <Button variant="contained" onClick={handleSendOrUpdateReply} fullWidth>
                            {comment ? 'Cập nhật' : 'Gửi phản hồi'}
                        </Button>
                        {comment && (
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleOpenDeleteConfirm}
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
                <Box sx={modalStyle(isMobile)}>
                    <Typography variant="h6" gutterBottom>
                        Chi tiết đánh giá
                    </Typography>
                    {selectedReviewDetail && (
                        <>
                            <Typography>
                                <strong>Nội dung:</strong> {selectedReviewDetail.reviewContent}
                            </Typography>
                            <Box display="flex" alignItems="center" mt={1}>
                                <Typography>
                                    <strong>Số sao:</strong>{' '}
                                </Typography>
                                <Rating
                                    value={selectedReviewDetail.rating}
                                    readOnly
                                    precision={0.5}
                                    sx={{
                                        color: '#ffca28',
                                        '& .MuiRating-iconEmpty': {
                                            color: '#e0e0e0',
                                        },
                                    }}
                                />
                                <Typography sx={{ ml: 1, fontWeight: 'bold', color: '#ff9800' }}>
                                    {selectedReviewDetail.rating}
                                </Typography>
                            </Box>
                            <Typography>
                                <strong>Ngày tạo:</strong>{' '}
                                {new Date(selectedReviewDetail.createdAt).toLocaleString()}
                            </Typography>
                            <Box
                                display="flex"
                                flexDirection={{ xs: 'column', sm: 'row' }}
                                gap={2}
                                mt={1}
                            >
                                <Typography>
                                    <strong>Lượt thích:</strong> {selectedReviewDetail.like}
                                </Typography>
                                <Typography>
                                    <strong>Không thích:</strong>{' '}
                                    {selectedReviewDetail.notLike || 0}
                                </Typography>
                                <Typography>
                                    <strong>Hữu ích:</strong> {selectedReviewDetail.helpful}
                                </Typography>
                            </Box>
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
                            <Box
                                mt={2}
                                display="flex"
                                flexDirection={{ xs: 'column', sm: 'row' }}
                                gap={2}
                            >
                                {selectedReviewDetail.edit ? (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={handleOpenDeleteConfirm}
                                        fullWidth
                                    >
                                        Xóa phản hồi
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        startIcon={comment ? <EditIcon /> : <ReplyIcon />}
                                        onClick={() =>
                                            handleOpenReplyModal(selectedReviewDetail.id)
                                        }
                                        fullWidth
                                    >
                                        {comment ? 'Chỉnh sửa phản hồi' : 'Trả lời đánh giá'}
                                    </Button>
                                )}
                                {comment && !selectedReviewDetail.edit && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={handleOpenDeleteConfirm}
                                        fullWidth
                                    >
                                        Xóa phản hồi
                                    </Button>
                                )}
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default ReviewsPage;
