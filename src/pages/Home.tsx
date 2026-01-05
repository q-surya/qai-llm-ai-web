import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth={false}>
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: { xs: 3, md: 4 },
                    px: { xs: 2, sm: 4 },
                }}
            >
                <Typography
                    variant="h2"
                    component="h1"
                    fontWeight="bold"
                    sx={{
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        background: 'linear-gradient(135deg, #6D5CFF 0%, #B44BFF 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Quantara AI
                </Typography>
                <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}
                >
                    Your Intelligent Data Assistant
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<ChatBubbleOutlineIcon />}
                    onClick={() => navigate('/chat')}
                    sx={{
                        px: { xs: 4, md: 6 },
                        py: { xs: 1.25, md: 1.5 },
                        fontSize: { xs: '1rem', md: '1.2rem' },
                        borderRadius: 3,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #6D5CFF 0%, #B44BFF 100%)',
                        boxShadow: '0 4px 14px rgba(109, 92, 255, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5844E0 0%, #9F33E6 100%)',
                            boxShadow: '0 6px 20px rgba(109, 92, 255, 0.4)',
                            transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease',
                    }}
                >
                    Open Chat
                </Button>
            </Box>
        </Container>
    );
};

export default Home;
