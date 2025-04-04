import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Divider,
    Paper,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import GroupsIcon from '@mui/icons-material/Groups';

const AboutPage = () => {
    // const teamMembers = [
    //     {
    //         name: 'Nguyễn Văn A',
    //         position: 'Nhà sáng lập & CEO',
    //         avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    //         bio: 'Với hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ và ẩm thực, anh A đã xây dựng WebSReview với mong muốn tạo ra một cộng đồng đánh giá chân thực.',
    //     },
    //     {
    //         name: 'Trần Thị B',
    //         position: 'Giám đốc Marketing',
    //         avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    //         bio: 'Chị B có bề dày kinh nghiệm trong lĩnh vực marketing số và xây dựng thương hiệu cho nhiều doanh nghiệp lớn tại Việt Nam.',
    //     },
    //     {
    //         name: 'Lê Văn C',
    //         position: 'Giám đốc Công nghệ',
    //         avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    //         bio: 'Với nền tảng kỹ thuật vững chắc từ Silicon Valley, anh C đã phát triển nền tảng WebSReview với công nghệ tiên tiến nhất.',
    //     },
    //     {
    //         name: 'Phạm Thị D',
    //         position: 'Quản lý Cộng đồng',
    //         avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    //         bio: 'Chị D là người kết nối cộng đồng người dùng WebSReview, đảm bảo mọi đánh giá đều chân thực và hữu ích.',
    //     },
    // ];

    // const milestones = [
    //     {
    //         year: '2018',
    //         title: 'Thành lập WebSReview',
    //         description:
    //             'WebSReview được thành lập với tầm nhìn trở thành nền tảng đánh giá hàng đầu Việt Nam.',
    //     },
    //     {
    //         year: '2019',
    //         title: 'Đạt 100,000 người dùng',
    //         description:
    //             'Cột mốc quan trọng khi cộng đồng người dùng vượt 100,000 thành viên tích cực.',
    //     },
    //     {
    //         year: '2020',
    //         title: 'Ra mắt ứng dụng di động',
    //         description:
    //             'Phát hành ứng dụng di động trên iOS và Android, mở rộng khả năng tiếp cận người dùng.',
    //     },
    //     {
    //         year: '2021',
    //         title: 'Mở rộng sang các tỉnh thành',
    //         description:
    //             'Từ TP.HCM, WebSReview đã mở rộng phủ sóng tới Hà Nội, Đà Nẵng và nhiều tỉnh thành khác.',
    //     },
    //     {
    //         year: '2022',
    //         title: 'Hợp tác với các đối tác lớn',
    //         description: 'Bắt đầu hợp tác với các thương hiệu lớn và chuỗi nhà hàng toàn quốc.',
    //     },
    //     {
    //         year: '2023',
    //         title: 'Đạt 1 triệu người dùng',
    //         description:
    //             'Cột mốc quan trọng khi cộng đồng người dùng vượt 1 triệu thành viên tích cực.',
    //     },
    // ];

    return (
        <Box sx={{ py: 6 }}>
            <Container maxWidth="lg">
                {/* Hero Section */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{ fontWeight: 'bold' }}
                    >
                        Về WebSReview
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto', mb: 4 }}
                    >
                        Nền tảng đánh giá hàng đầu Việt Nam, kết nối người dùng với những trải
                        nghiệm tuyệt vời
                    </Typography>
                    <Divider sx={{ maxWidth: 100, mx: 'auto', mb: 4 }} />
                </Box>

                {/* Mission & Vision */}
                <Grid container spacing={4} sx={{ mb: 8 }}>
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{ p: 4, height: '100%', bgcolor: '#f8f9fa', borderRadius: 2 }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <StarIcon sx={{ color: '#dc2626', mr: 1, fontSize: 28 }} />
                                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                                    Sứ mệnh
                                </Typography>
                            </Box>
                            <Typography variant="body1">
                                Sứ mệnh của WebSReview là cung cấp một nền tảng đánh giá minh bạch,
                                chân thực, giúp người dùng đưa ra quyết định sáng suốt khi lựa chọn
                                địa điểm ăn uống, du lịch và giải trí. Chúng tôi cam kết xây dựng
                                một cộng đồng người dùng tích cực, nơi mọi ý kiến đều được tôn trọng
                                và lắng nghe.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{ p: 4, height: '100%', bgcolor: '#f8f9fa', borderRadius: 2 }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocationOnIcon sx={{ color: '#dc2626', mr: 1, fontSize: 28 }} />
                                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                                    Tầm nhìn
                                </Typography>
                            </Box>
                            <Typography variant="body1">
                                WebSReview hướng tới việc trở thành nền tảng đánh giá số 1 tại Việt
                                Nam và Đông Nam Á, nơi mọi người có thể dễ dàng tìm kiếm, đánh giá
                                và chia sẻ những trải nghiệm thực tế về các địa điểm, dịch vụ. Chúng
                                tôi không ngừng đổi mới công nghệ để mang đến trải nghiệm tốt nhất
                                cho người dùng.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Core Values */}
                <Box sx={{ mb: 8 }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}
                    >
                        Giá trị cốt lõi
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                sx={{
                                    height: '100%',
                                    boxShadow: 'none',
                                    border: '1px solid #eaeaea',
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <StarIcon sx={{ fontSize: 48, color: '#dc2626', mb: 2 }} />
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        sx={{ fontWeight: 'bold', mb: 1 }}
                                    >
                                        Chân thực
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Chúng tôi đề cao tính chân thực trong mọi đánh giá, đảm bảo
                                        thông tin chí   nh xác và đáng tin cậy.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                sx={{
                                    height: '100%',
                                    boxShadow: 'none',
                                    border: '1px solid #eaeaea',
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <GroupsIcon sx={{ fontSize: 48, color: '#dc2626', mb: 2 }} />
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        sx={{ fontWeight: 'bold', mb: 1 }}
                                    >
                                        Cộng đồng
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Xây dựng cộng đồng người dùng tích cực, nơi mọi người có thể
                                        chia sẻ và học hỏi từ nhau.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                sx={{
                                    height: '100%',
                                    boxShadow: 'none',
                                    border: '1px solid #eaeaea',
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <AccessTimeIcon
                                        sx={{ fontSize: 48, color: '#dc2626', mb: 2 }}
                                    />
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        sx={{ fontWeight: 'bold', mb: 1 }}
                                    >
                                        Đổi mới
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Không ngừng đổi mới công nghệ và trải nghiệm người dùng để
                                        mang đến dịch vụ tốt nhất.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                sx={{
                                    height: '100%',
                                    boxShadow: 'none',
                                    border: '1px solid #eaeaea',
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <LocationOnIcon
                                        sx={{ fontSize: 48, color: '#dc2626', mb: 2 }}
                                    />
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        sx={{ fontWeight: 'bold', mb: 1 }}
                                    >
                                        Địa phương
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tôn trọng và quảng bá văn hóa địa phương, hỗ trợ các doanh
                                        nghiệp nhỏ phát triển.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Team Section
                <Box sx={{ mb: 8 }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}
                    >
                        Đội ngũ của chúng tôi
                    </Typography>
                    <Grid container spacing={4}>
                        {teamMembers.map((member, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        boxShadow: 'none',
                                        border: '1px solid #eaeaea',
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Avatar
                                            src={member.avatar}
                                            alt={member.name}
                                            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                                        />
                                        <Typography
                                            variant="h6"
                                            component="h3"
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            {member.name}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            color="primary"
                                            sx={{ mb: 2 }}
                                        >
                                            {member.position}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {member.bio}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box> */}

                {/* Milestones */}
                {/* <Box sx={{ mb: 8 }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}
                    >
                        Hành trình phát triển
                    </Typography>
                    <Box sx={{ position: 'relative' }}>
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                top: 0,
                                bottom: 0,
                                width: 4,
                                bgcolor: '#f0f0f0',
                                transform: 'translateX(-50%)',
                                display: { xs: 'none', md: 'block' },
                            }}
                        />
                        {milestones.map((milestone, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: {
                                        xs: 'column',
                                        md: index % 2 === 0 ? 'row' : 'row-reverse',
                                    },
                                    mb: 4,
                                    position: 'relative',
                                }}
                            >
                                <Box
                                    sx={{
                                        flex: 1,
                                        textAlign: {
                                            xs: 'left',
                                            md: index % 2 === 0 ? 'right' : 'left',
                                        },
                                        pr: { md: index % 2 === 0 ? 4 : 0 },
                                        pl: { md: index % 2 === 0 ? 0 : 4 },
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        component="h3"
                                        sx={{ color: '#dc2626', fontWeight: 'bold' }}
                                    >
                                        {milestone.year}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {milestone.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {milestone.description}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: { xs: 'none', md: 'flex' },
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        zIndex: 1,
                                        width: 60,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            bgcolor: '#dc2626',
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{ flex: 1, display: { xs: 'block', md: 'none' }, mb: 3 }}
                                />
                            </Box>
                        ))}
                    </Box> */}
                {/* </Box> */}
            </Container>
        </Box>
    );
};

export default AboutPage;
