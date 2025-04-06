// 'use client';

// import { useState } from 'react';
// import { TextField, Button, Box, Typography, InputAdornment, Stack, Paper } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { Link } from 'react-router-dom';
// import GoogleLocation from '../location/GoogleLocation';
// import SearchBarComponent from '../search/SearchBarComponent';

// // Create a custom theme with red primary color for the buttons
// const theme = createTheme({
//     palette: {
//         primary: {
//             main: '#dc2626',
//         },
//     },
//     components: {
//         MuiButton: {
//             styleOverrides: {
//                 root: {
//                     textTransform: 'none',
//                     borderRadius: '4px',
//                 },
//             },
//         },
//         MuiOutlinedInput: {
//             styleOverrides: {
//                 root: {
//                     borderRadius: '4px',
//                 },
//             },
//         },
//     },
// });

// const SearchComponent = () => {
//     const [searchQuery, setSearchQuery] = useState('');

//     return (
//         // <ThemeProvider theme={theme}>
//         //     <Paper
//         //         elevation={2}
//         //         sx={{
//         //             width: '100%',
//         //             minWidth: { xs: '300px', sm: '500px', md: '700px' },
//         //             border: '1px solid rgb(249, 246, 246)', // Thêm viền màu xám nhạt
//         //             overflow: 'hidden',
//         //         }}
//         //     >
//         //         <Box sx={{ p: 1 }}>
//         //             <Typography
//         //                 variant="h5"
//         //                 sx={{
//         //                     fontWeight: 600, // Làm đậm hơn một chút để dễ nhìn
//         //                     mb: 2,
//         //                     color: '#333', // Màu tối hơn để nổi bật
//         //                     textAlign: 'start', // Căn giữa nếu muốn
//         //                     textTransform: 'capitalize', // Viết hoa chữ cái đầu
//         //                     letterSpacing: '0.5px', // Giúp chữ trông thanh thoát hơn
//         //                 }}
//         //             >
//         //                 Bạn đang tìm kiếm thứ gì?
//         //             </Typography>

//         //             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
//         //                 <TextField
//         //                     placeholder="Tìm kiếm cửa hàng..."
//         //                     variant="outlined"
//         //                     fullWidth
//         //                     value={searchQuery}
//         //                     onChange={(e) => setSearchQuery(e.target.value)}
//         //                     sx={{ flex: 1 }}
//         //                 />
//         //                 <Stack direction="row" spacing={1}>
//         //                     <GoogleLocation></GoogleLocation>
//         //                     <Link to="/search">
//         //                         <Button
//         //                             variant="contained"
//         //                             color="primary"
//         //                             sx={{
//         //                                 minWidth: '56px',
//         //                                 height: '56px',
//         //                                 px: 2,
//         //                             }}
//         //                         >
//         //                             <SearchIcon />
//         //                         </Button>
//         //                     </Link>
//         //                 </Stack>
//         //             </Stack>

//         //             {/* <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//         //     <Link to={"/search"}>
//         //     <Button variant="contained" color="primary" sx={{ px: 3, py: 1 }}>
//         //       Xem thêm cửa hàng
//         //     </Button>
//         //     </Link>
//         //   </Box> */}
//         //         </Box>
//         //     </Paper>
//         // </ThemeProvider>
//         <div
//             style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F4E0E0 100%)' }}
//             className="h-[172px] w-[100%] flex justify-center items-center"
//         >
//             <SearchBarComponent />
//         </div>
//     );
// };

// export default SearchComponent;
