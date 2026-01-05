import React, { useEffect, useRef } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import useChat from '../hooks/useChat';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';

const Chat: React.FC = () => {
    const { messages, isLoading, sendMessage } = useChat();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100%',
                bgcolor: 'background.default',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    py: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center',
                    bgcolor: 'background.default',
                    zIndex: 10,
                }}
            >
                <Typography variant="h6" fontWeight={600} color="text.primary">
                    Quantara AI
                </Typography>
            </Box>

            {/* Main Content Area - Centered Column */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                {/* 
                   We use a Container here again to "maintain both side space" 
                   and centers the content like the provided screenshot.
                */}
                <Container
                    maxWidth={false}
                    sx={{
                        maxWidth: { xs: '100%', md: '800px', lg: '900px' },
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        px: { xs: 2, md: 0 },
                    }}
                >
                    {/* Scrollable Message List */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            width: '100%',
                            pt: { xs: 2, md: 4 },
                            pb: 2,
                            scrollbarWidth: 'thin',
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'divider',
                                borderRadius: '3px',
                            },
                        }}
                    >
                        {messages.length === 0 ? (
                            <Box sx={{ mt: { xs: 6, md: 10 }, textAlign: 'center', opacity: 0.7, px: 2 }}>
                                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                                    How can I help you today?
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                                    Ask me anything about your data
                                </Typography>
                            </Box>
                        ) : (
                            messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)
                        )}

                        {isLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                                <Box
                                    sx={{
                                        bgcolor: 'background.paper',
                                        p: 2,
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: '#2B1348',
                                    }}
                                >
                                    <CircularProgress size={20} sx={{ color: 'primary.main' }} />
                                </Box>
                            </Box>
                        )}
                        <div ref={bottomRef} />
                    </Box>

                    {/* Input Component */}
                    <ChatInput onSend={sendMessage} isLoading={isLoading} />
                </Container>
            </Box>
        </Box>
    );
};

export default Chat;
