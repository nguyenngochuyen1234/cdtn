import React from 'react';
import { Stepper, Step, StepLabel, Box, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';

const steps = ['Đăng ký cửa hàng', 'Chọn danh mục', 'Tải ảnh cửa hàng', 'Hoàn thành'];

const CreationStepper: React.FC = () => {
    const theme = useTheme();
    const location = useLocation();

    // Tính activeStep một lần duy nhất
    const activeStep = (() => {
        switch (location.pathname) {
            case '/biz/register-shop':
                return 0;
            case '/biz/create-tag':
                return 1;
            case '/biz/upload-image':
                return 2;
            case '/finish-create-shop':
                return 3;
            default:
                return Math.min(3, steps.length - 1);
        }
    })();

    return (
        <Box sx={{ width: '100%', mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel
                            sx={{
                                '& .MuiStepLabel-label': {
                                    fontWeight: 'medium',
                                    color:
                                        activeStep >= index
                                            ? theme.palette.primary.main
                                            : theme.palette.text.secondary,
                                },
                            }}
                        >
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
};

export default CreationStepper;
