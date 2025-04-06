'use client';

import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SecurityIcon from '@mui/icons-material/Security';
import GavelIcon from '@mui/icons-material/Gavel';
import CookieIcon from '@mui/icons-material/Cookie';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`policy-tabpanel-${index}`}
            aria-labelledby={`policy-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `policy-tab-${index}`,
        'aria-controls': `policy-tabpanel-${index}`,
    };
}

const PoliciesPage = () => {
    const [value, setValue] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const privacyPolicySections = [
        {
            title: 'Thu thập thông tin',
            content: `WebSReview thu thập thông tin cá nhân của bạn khi bạn đăng ký tài khoản, đăng nhập, đăng bài đánh giá, hoặc tương tác với nền tảng của chúng tôi. Thông tin thu thập có thể bao gồm:
      
      • Thông tin cá nhân: Họ tên, địa chỉ email, số điện thoại
      • Thông tin đăng nhập: Tên người dùng, mật khẩu (được mã hóa)
      • Thông tin vị trí: Khi bạn cho phép ứng dụng truy cập vị trí
      • Nội dung do người dùng tạo: Đánh giá, bình luận, hình ảnh tải lên
      
      Chúng tôi cũng thu thập thông tin tự động thông qua cookies và công nghệ tương tự để cải thiện trải nghiệm của bạn.`,
        },
        {
            title: 'Sử dụng thông tin',
            content: `WebSReview sử dụng thông tin thu thập để:
      
      • Cung cấp, duy trì và cải thiện dịch vụ của chúng tôi
      • Xử lý giao dịch và gửi thông báo liên quan
      • Gửi thông tin cập nhật, thông báo và bản tin (nếu bạn đăng ký)
      • Cá nhân hóa trải nghiệm và nội dung
      • Phân tích xu hướng sử dụng và cải thiện nền tảng
      • Phát hiện, ngăn chặn và xử lý các hoạt động gian lận hoặc bất hợp pháp`,
        },
        {
            title: 'Chia sẻ thông tin',
            content: `WebSReview có thể chia sẻ thông tin của bạn trong các trường hợp sau:
      
      • Với các đối tác kinh doanh và nhà cung cấp dịch vụ để hỗ trợ hoạt động của chúng tôi
      • Với các chủ doanh nghiệp được đánh giá (chỉ thông tin đánh giá công khai)
      • Khi có yêu cầu pháp lý hoặc để bảo vệ quyền lợi, tài sản hoặc an toàn
      • Trong trường hợp sáp nhập, mua lại hoặc bán tài sản (với sự đảm bảo về bảo mật)
      
      Chúng tôi không bán thông tin cá nhân của bạn cho bên thứ ba.`,
        },
        {
            title: 'Bảo mật thông tin',
            content: `WebSReview cam kết bảo vệ thông tin cá nhân của bạn và áp dụng các biện pháp bảo mật hợp lý, bao gồm:
      
      • Mã hóa dữ liệu nhạy cảm như mật khẩu
      • Sử dụng kết nối HTTPS an toàn
      • Giới hạn quyền truy cập vào thông tin cá nhân cho nhân viên được ủy quyền
      • Thực hiện đánh giá bảo mật định kỳ
      
      Tuy nhiên, không có phương thức truyền dữ liệu nào qua internet hoặc lưu trữ điện tử nào là 100% an toàn. Chúng tôi không thể đảm bảo bảo mật tuyệt đối.`,
        },
        {
            title: 'Quyền của người dùng',
            content: `Bạn có các quyền sau đối với thông tin cá nhân của mình:
      
      • Quyền truy cập và xem thông tin cá nhân mà chúng tôi lưu trữ về bạn
      • Quyền yêu cầu cập nhật hoặc sửa đổi thông tin không chính xác
      • Quyền yêu cầu xóa thông tin cá nhân (trong một số trường hợp)
      • Quyền phản đối hoặc hạn chế việc xử lý thông tin cá nhân
      • Quyền rút lại sự đồng ý đã cung cấp trước đó
      
      Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua email: privacy@websreview.vn`,
        },
    ];

    const termsOfServiceSections = [
        {
            title: 'Điều khoản sử dụng',
            content: `Bằng cách truy cập hoặc sử dụng WebSReview, bạn đồng ý tuân thủ các điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
      
      WebSReview có quyền thay đổi các điều khoản này vào bất kỳ lúc nào. Chúng tôi sẽ thông báo về những thay đổi quan trọng qua email hoặc thông báo trên nền tảng. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi được đăng tải đồng nghĩa với việc bạn chấp nhận các điều khoản mới.`,
        },
        {
            title: 'Tài khoản người dùng',
            content: `Khi tạo tài khoản trên WebSReview, bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật. Bạn chịu trách nhiệm bảo mật tài khoản của mình, bao gồm mật khẩu, và phải thông báo ngay cho chúng tôi về bất kỳ vi phạm bảo mật nào.
      
      Bạn chịu trách nhiệm cho tất cả hoạt động diễn ra dưới tài khoản của mình. WebSReview có quyền đình chỉ hoặc chấm dứt tài khoản của bạn nếu phát hiện vi phạm điều khoản sử dụng hoặc hành vi không phù hợp.`,
        },
        {
            title: 'Nội dung người dùng',
            content: `Khi đăng tải nội dung (đánh giá, bình luận, hình ảnh) lên WebSReview, bạn vẫn giữ quyền sở hữu đối với nội dung đó, nhưng cấp cho chúng tôi giấy phép toàn cầu, không độc quyền, miễn phí bản quyền để sử dụng, sao chép, sửa đổi, phân phối và hiển thị nội dung đó.
      
      Bạn đảm bảo rằng nội dung bạn đăng tải:
      • Là của bạn hoặc bạn có quyền chia sẻ
      • Không vi phạm quyền của bất kỳ bên thứ ba nào
      • Không chứa thông tin sai lệch, gây hiểu nhầm hoặc gian lận
      • Không vi phạm pháp luật hoặc quy định hiện hành
      
      WebSReview có quyền xóa bất kỳ nội dung nào vi phạm các điều khoản này hoặc được cho là không phù hợp.`,
        },
        {
            title: 'Giới hạn trách nhiệm',
            content: `WebSReview cung cấp nền tảng "nguyên trạng" và "như có sẵn", không có bất kỳ bảo đảm nào, dù rõ ràng hay ngụ ý. Chúng tôi không đảm bảo rằng dịch vụ sẽ không bị gián đoạn, kịp thời, an toàn hoặc không có lỗi.
      
      Trong mọi trường hợp, WebSReview và các giám đốc, nhân viên, đối tác hoặc đại lý của chúng tôi sẽ không chịu trách nhiệm về bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, hậu quả hoặc trừng phạt nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.`,
        },
    ];

    const cookiePolicySections = [
        {
            title: 'Cookies là gì?',
            content: `Cookies là các tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn khi bạn truy cập trang web. Chúng giúp trang web ghi nhớ thông tin về bạn và lượt truy cập của bạn, giúp cải thiện trải nghiệm người dùng.`,
        },
        {
            title: 'Cách chúng tôi sử dụng cookies',
            content: `WebSReview sử dụng cookies cho các mục đích sau:
      
      • Cookies cần thiết: Để trang web hoạt động đúng cách
      • Cookies phân tích: Để hiểu cách người dùng tương tác với trang web
      • Cookies chức năng: Để ghi nhớ tùy chọn của bạn
      • Cookies quảng cáo: Để cung cấp quảng cáo phù hợp hơn
      
      Chúng tôi cũng có thể cho phép bên thứ ba sử dụng cookies trên trang web của chúng tôi cho mục đích phân tích và quảng cáo.`,
        },
        {
            title: 'Quản lý cookies',
            content: `Hầu hết các trình duyệt web cho phép bạn kiểm soát cookies thông qua cài đặt trình duyệt. Bạn có thể chọn chặn, xóa hoặc vô hiệu hóa cookies nếu muốn.
      
      Tuy nhiên, việc vô hiệu hóa cookies có thể ảnh hưởng đến trải nghiệm của bạn và một số tính năng của trang web có thể không hoạt động đúng cách.`,
        },
    ];

    const contentGuidelinesSections = [
        {
            title: 'Nguyên tắc chung',
            content: `WebSReview khuyến khích người dùng chia sẻ trải nghiệm thực tế, trung thực và hữu ích. Mọi đánh giá nên dựa trên trải nghiệm cá nhân thực tế và cung cấp thông tin chi tiết, cụ thể để giúp người dùng khác.`,
        },
        {
            title: 'Nội dung bị cấm',
            content: `Các loại nội dung sau đây không được phép trên WebSReview:
      
      • Nội dung phỉ báng, xúc phạm hoặc quấy rối
      • Ngôn từ thù địch, phân biệt đối xử hoặc kích động bạo lực
      • Thông tin cá nhân của người khác
      • Nội dung khiêu dâm, tục tĩu hoặc không phù hợp
      • Spam, quảng cáo trái phép hoặc liên kết không liên quan
      • Nội dung vi phạm bản quyền hoặc sở hữu trí tuệ
      • Đánh giá giả mạo hoặc không trung thực`,
        },
        {
            title: 'Hình ảnh và phương tiện',
            content: `Hình ảnh và video tải lên WebSReview phải:
      
      • Liên quan trực tiếp đến địa điểm được đánh giá
      • Không chứa thông tin nhận dạng cá nhân của người khác mà không có sự đồng ý
      • Không vi phạm bản quyền hoặc quyền sở hữu trí tuệ
      • Không chứa nội dung không phù hợp hoặc gây khó chịu`,
        },
        {
            title: 'Xử lý vi phạm',
            content: `WebSReview có quyền xóa bất kỳ nội dung nào vi phạm hướng dẫn này mà không cần thông báo trước. Vi phạm lặp đi lặp lại có thể dẫn đến việc đình chỉ hoặc chấm dứt tài khoản.
      
      Người dùng có thể báo cáo nội dung vi phạm bằng cách sử dụng tính năng "Báo cáo" hoặc liên hệ với chúng tôi qua email: support@websreview.vn`,
        },
    ];

    return (
        <Box sx={{ py: 6 }}>
            <Container maxWidth="lg">
                {/* Hero Section */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{ fontWeight: 'bold' }}
                    >
                        Chính sách & Điều khoản
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}
                    >
                        Cam kết minh bạch và bảo vệ quyền lợi người dùng
                    </Typography>
                    <Divider sx={{ maxWidth: 100, mx: 'auto', mt: 4 }} />
                </Box>

                {/* Tabs Section */}
                <Paper elevation={0} sx={{ mb: 6, borderRadius: 2, border: '1px solid #eaeaea' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="policy tabs"
                            variant={isMobile ? 'scrollable' : 'fullWidth'}
                            scrollButtons={isMobile ? 'auto' : false}
                            allowScrollButtonsMobile
                            sx={{
                                '& .MuiTab-root': {
                                    py: 2,
                                    display: 'flex',
                                    flexDirection: isMobile ? 'row' : 'column',
                                    alignItems: 'center',
                                    gap: 1,
                                },
                            }}
                        >
                            <Tab
                                icon={<SecurityIcon />}
                                label="Chính sách bảo mật"
                                {...a11yProps(0)}
                            />
                            <Tab
                                icon={<GavelIcon />}
                                label="Điều khoản dịch vụ"
                                {...a11yProps(1)}
                            />
                            <Tab
                                icon={<CookieIcon />}
                                label="Chính sách Cookie"
                                {...a11yProps(2)}
                            />
                            <Tab
                                icon={<VerifiedUserIcon />}
                                label="Quy định nội dung"
                                {...a11yProps(3)}
                            />
                        </Tabs>
                    </Box>

                    {/* Privacy Policy */}
                    <TabPanel value={value} index={0}>
                        <Box sx={{ p: { xs: 2, md: 4 } }}>
                            <Typography
                                variant="h4"
                                component="h2"
                                gutterBottom
                                sx={{ fontWeight: 'bold', mb: 3 }}
                            >
                                Chính sách bảo mật
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                                Cập nhật lần cuối: {new Date().toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                                WebSReview ("chúng tôi", "của chúng tôi") cam kết bảo vệ quyền riêng
                                tư của bạn. Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử
                                dụng và chia sẻ thông tin cá nhân khi bạn sử dụng nền tảng
                                WebSReview.
                            </Typography>

                            {isMobile ? (
                                <Box>
                                    {privacyPolicySections.map((section, index) => (
                                        <Accordion
                                            key={index}
                                            elevation={0}
                                            sx={{ mb: 2, border: '1px solid #eaeaea' }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`privacy-content-${index}`}
                                                id={`privacy-header-${index}`}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    {section.title}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography
                                                    variant="body1"
                                                    component="div"
                                                    sx={{
                                                        whiteSpace: 'pre-line',
                                                        color: 'text.secondary',
                                                    }}
                                                >
                                                    {section.content}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </Box>
                            ) : (
                                <List>
                                    {privacyPolicySections.map((section, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem
                                                alignItems="flex-start"
                                                sx={{ flexDirection: 'column', py: 3 }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            variant="h6"
                                                            sx={{ fontWeight: 'bold', mb: 2 }}
                                                        >
                                                            {section.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography
                                                            variant="body1"
                                                            component="div"
                                                            sx={{
                                                                whiteSpace: 'pre-line',
                                                                color: 'text.secondary',
                                                            }}
                                                        >
                                                            {section.content}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            {index < privacyPolicySections.length - 1 && (
                                                <Divider component="li" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}
                        </Box>
                    </TabPanel>

                    {/* Terms of Service */}
                    <TabPanel value={value} index={1}>
                        <Box sx={{ p: { xs: 2, md: 4 } }}>
                            <Typography
                                variant="h4"
                                component="h2"
                                gutterBottom
                                sx={{ fontWeight: 'bold', mb: 3 }}
                            >
                                Điều khoản dịch vụ
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                                Cập nhật lần cuối: {new Date().toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                                Vui lòng đọc kỹ các điều khoản dịch vụ này trước khi sử dụng nền
                                tảng WebSReview. Bằng cách truy cập hoặc sử dụng dịch vụ của chúng
                                tôi, bạn đồng ý bị ràng buộc bởi các điều khoản và điều kiện này.
                            </Typography>

                            {isMobile ? (
                                <Box>
                                    {termsOfServiceSections.map((section, index) => (
                                        <Accordion
                                            key={index}
                                            elevation={0}
                                            sx={{ mb: 2, border: '1px solid #eaeaea' }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`terms-content-${index}`}
                                                id={`terms-header-${index}`}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    {section.title}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography
                                                    variant="body1"
                                                    component="div"
                                                    sx={{
                                                        whiteSpace: 'pre-line',
                                                        color: 'text.secondary',
                                                    }}
                                                >
                                                    {section.content}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </Box>
                            ) : (
                                <List>
                                    {termsOfServiceSections.map((section, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem
                                                alignItems="flex-start"
                                                sx={{ flexDirection: 'column', py: 3 }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            variant="h6"
                                                            sx={{ fontWeight: 'bold', mb: 2 }}
                                                        >
                                                            {section.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography
                                                            variant="body1"
                                                            component="div"
                                                            sx={{
                                                                whiteSpace: 'pre-line',
                                                                color: 'text.secondary',
                                                            }}
                                                        >
                                                            {section.content}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            {index < termsOfServiceSections.length - 1 && (
                                                <Divider component="li" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}
                        </Box>
                    </TabPanel>

                    {/* Cookie Policy */}
                    <TabPanel value={value} index={2}>
                        <Box sx={{ p: { xs: 2, md: 4 } }}>
                            <Typography
                                variant="h4"
                                component="h2"
                                gutterBottom
                                sx={{ fontWeight: 'bold', mb: 3 }}
                            >
                                Chính sách Cookie
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                                Cập nhật lần cuối: {new Date().toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                                Chính sách cookie này giải thích cách WebSReview sử dụng cookies và
                                các công nghệ tương tự khi bạn truy cập hoặc tương tác với nền tảng
                                của chúng tôi.
                            </Typography>

                            {isMobile ? (
                                <Box>
                                    {cookiePolicySections.map((section, index) => (
                                        <Accordion
                                            key={index}
                                            elevation={0}
                                            sx={{ mb: 2, border: '1px solid #eaeaea' }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`cookie-content-${index}`}
                                                id={`cookie-header-${index}`}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    {section.title}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography
                                                    variant="body1"
                                                    component="div"
                                                    sx={{
                                                        whiteSpace: 'pre-line',
                                                        color: 'text.secondary',
                                                    }}
                                                >
                                                    {section.content}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </Box>
                            ) : (
                                <List>
                                    {cookiePolicySections.map((section, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem
                                                alignItems="flex-start"
                                                sx={{ flexDirection: 'column', py: 3 }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            variant="h6"
                                                            sx={{ fontWeight: 'bold', mb: 2 }}
                                                        >
                                                            {section.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography
                                                            variant="body1"
                                                            component="div"
                                                            sx={{
                                                                whiteSpace: 'pre-line',
                                                                color: 'text.secondary',
                                                            }}
                                                        >
                                                            {section.content}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            {index < cookiePolicySections.length - 1 && (
                                                <Divider component="li" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}
                        </Box>
                    </TabPanel>

                    {/* Content Guidelines */}
                    <TabPanel value={value} index={3}>
                        <Box sx={{ p: { xs: 2, md: 4 } }}>
                            <Typography
                                variant="h4"
                                component="h2"
                                gutterBottom
                                sx={{ fontWeight: 'bold', mb: 3 }}
                            >
                                Quy định nội dung
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                                Cập nhật lần cuối: {new Date().toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                                Quy định nội dung này đặt ra các tiêu chuẩn cho việc đăng tải nội
                                dung trên WebSReview. Tuân thủ các quy định này giúp duy trì một
                                cộng đồng tích cực và hữu ích cho tất cả người dùng.
                            </Typography>

                            {isMobile ? (
                                <Box>
                                    {contentGuidelinesSections.map((section, index) => (
                                        <Accordion
                                            key={index}
                                            elevation={0}
                                            sx={{ mb: 2, border: '1px solid #eaeaea' }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`guidelines-content-${index}`}
                                                id={`guidelines-header-${index}`}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    {section.title}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography
                                                    variant="body1"
                                                    component="div"
                                                    sx={{
                                                        whiteSpace: 'pre-line',
                                                        color: 'text.secondary',
                                                    }}
                                                >
                                                    {section.content}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </Box>
                            ) : (
                                <List>
                                    {contentGuidelinesSections.map((section, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem
                                                alignItems="flex-start"
                                                sx={{ flexDirection: 'column', py: 3 }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            variant="h6"
                                                            sx={{ fontWeight: 'bold', mb: 2 }}
                                                        >
                                                            {section.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography
                                                            variant="body1"
                                                            component="div"
                                                            sx={{
                                                                whiteSpace: 'pre-line',
                                                                color: 'text.secondary',
                                                            }}
                                                        >
                                                            {section.content}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            {index < contentGuidelinesSections.length - 1 && (
                                                <Divider component="li" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}
                        </Box>
                    </TabPanel>
                </Paper>

                {/* Contact Section
                <Box sx={{ textAlign: 'center', mt: 8, mb: 4 }}>
                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        sx={{ fontWeight: 'bold' }}
                    >
                        Có câu hỏi về chính sách của chúng tôi?
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
                        Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về các chính sách và điều khoản
                        của chúng tôi, vui lòng liên hệ với đội ngũ hỗ trợ.
                    </Typography> */}
                    {/* <Box
                        sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}
                    >
                        <Box
                            component="a"
                            href="mailto:support@websreview.vn"
                            sx={{
                                display: 'inline-block',
                                py: 1.5,
                                px: 3,
                                bgcolor: '#dc2626',
                                color: 'white',
                                borderRadius: 1,
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                '&:hover': {
                                    bgcolor: '#b91c1c',
                                },
                            }}
                        >
                            Liên hệ hỗ trợ
                        </Box>
                        <Box
                            component="a"
                            href="/faq"
                            sx={{
                                display: 'inline-block',
                                py: 1.5,
                                px: 3,
                                bgcolor: 'transparent',
                                color: '#dc2626',
                                border: '1px solid #dc2626',
                                borderRadius: 1,
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                '&:hover': {
                                    bgcolor: 'rgba(220, 38, 38, 0.1)',
                                },
                            }}
                        >
                            Xem FAQ
                        </Box>
                    </Box> */}
                {/* </Box> */}
            </Container>
        </Box>
    );
};

export default PoliciesPage;
