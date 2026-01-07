'use client';

import React, { useEffect, useRef } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import useChat from '../../hooks/useChat';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';

export default function Chat() {
    const { messages, isLoading, sendMessage } = useChat();
    const bottomRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, isLoading]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            // Prevent scrolling beyond the content
            const maxScroll = container.scrollHeight - container.clientHeight;
            if (container.scrollTop > maxScroll) {
                container.scrollTop = maxScroll;
            }
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100%',
                bgcolor: 'background.default',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* Header - Fixed at top */}
            <Box
                sx={{
                    py: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center',
                    bgcolor: 'background.default',
                    zIndex: 10,
                    flexShrink: 0,
                }}
            >
                <Typography variant="h6" fontWeight={600} color="text.primary">
                    Quantara AI
                </Typography>
            </Box>

            {/* Scrollable Message Area */}
            <Box
                ref={scrollContainerRef}
                sx={{
                    flexGrow: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#2B1348 #12081F',
                    overscrollBehavior: 'contain',
                    position: 'relative',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#12081F',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#2B1348',
                        borderRadius: '3px',
                        '&:hover': {
                            backgroundColor: '#6D5CFF',
                        },
                    },
                }}
            >
                <Container
                    maxWidth={false}
                    sx={{
                        maxWidth: { xs: '100%', md: '800px', lg: '900px' },
                        width: '100%',
                        px: { xs: 2, md: 0 },
                        py: { xs: 2, md: 4 },
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
                        messages.map((msg) => <ChatBubble key={msg.id} message={msg} isLoading={isLoading && msg.id === messages[messages.length - 1]?.id} />)
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
                    <div ref={bottomRef} style={{ height: '1px', flexShrink: 0 }} />
                </Container>
                    </Box>

            {/* Input Component - Fixed at bottom */}
            <Box
                sx={{
                    flexShrink: 0,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.default',
                    py: 2,
                    position: 'relative',
                    zIndex: 10,
                }}
            >
                <Container
                    maxWidth={false}
                    sx={{
                        maxWidth: { xs: '100%', md: '800px', lg: '900px' },
                        width: '100%',
                        px: { xs: 2, md: 0 },
                    }}
                >
                    <ChatInput onSend={sendMessage} isLoading={isLoading} />
                </Container>
            </Box>
        </Box>
    );
}
