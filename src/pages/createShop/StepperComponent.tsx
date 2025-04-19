import React from 'react';
import { Stepper, Step, StepLabel, Box, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';

const steps = ['Đăng ký cửa hàng', 'Chọn danh mục', 'Tải ảnh cửa hàng', 'Hoàn thành'];

const CreationStepper: React.FC = () => {
    const theme = useTheme();
    const location = useLocation();

    const getActiveStep = () => {
        switch (location.pathname) {
            case '/biz/register-shop':
                return 0;
            case '/biz/create-tag':
                return 1;
            case '/biz/upload-image':
                return 2;
            case '/biz/create-shop':
                return 3;
            default:
                return 4;
        }
    };

    return (
        <Box sx={{ width: '100%', mb: 4 }}>
            <Stepper activeStep={getActiveStep()} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel
                            sx={{
                                '& .MuiStepLabel-label': {
                                    fontWeight: 'medium',
                                    color:
                                        getActiveStep() >= steps.indexOf(label)
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
