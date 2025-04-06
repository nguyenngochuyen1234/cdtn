import Footer from '@/components/Footer';
import { HeaderComponent } from '@/components/Header';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Main = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header */}
            <HeaderComponent />

            {/* Nội dung chính của các route con */}
            <Box sx={{ flex: 1 }}>
                <Outlet />
            </Box>

            {/* Footer */}
            <Footer />
        </Box>
    );
};

export default Main;
