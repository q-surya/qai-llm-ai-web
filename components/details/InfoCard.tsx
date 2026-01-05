import React, { type ReactNode } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface InfoCardProps {
    title: string;
    children: ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => {
    return (
        <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent>
                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {title}
                </Typography>
                <Box sx={{ mt: 1 }}>
                    {children}
                </Box>
            </CardContent>
        </Card>
    );
};

export default InfoCard;
