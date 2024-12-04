import { Header } from '@/components/admin/Header'
import { SidebarMenu } from '@/components/admin/SidebarMenu'
import { Box, CssBaseline } from '@mui/material'
import { Outlet } from 'react-router-dom'
const DRAWER_WIDTH = 280
export default function App() {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <SidebarMenu />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {/* <Header /> */}
                <Outlet />
            </Box>
        </Box>
    )
}

