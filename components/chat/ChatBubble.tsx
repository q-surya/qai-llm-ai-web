'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import type { Message } from '../../types';

interface ChatBubbleProps {
    message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
    const router = useRouter();
    const isUser = message.role === 'user';
    const isAI = message.role === 'ai';

    const handleClick = () => {
        if (isAI && message.apiResponse) {
            router.push(`/details/${message.id}`);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent={isUser ? 'flex-end' : 'flex-start'}
            mb={3}
            sx={{ width: '100%' }}
        >
            <Box
                onClick={handleClick}
                sx={{
                    maxWidth: { xs: '85%', sm: '80%' },
                    px: { xs: 2.5, md: 3 },
                    py: { xs: 1.5, md: 2 },
                    borderRadius: '1.5rem', // More rounded like screenshot
                    // Specific colors requested
                    bgcolor: isUser ? '#6D5CFF' : '#1E0C34',
                    color: '#F2ECF8',
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    lineHeight: 1.6,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    border: isAI ? '1px solid' : 'none',
                    borderColor: isAI ? '#2B1348' : 'transparent',
                    cursor: isAI ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    '&:hover': isAI ? {
                        bgcolor: '#2B1348',
                        transform: 'translateY(-1px)',
                    } : {},
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        color: '#F2ECF8'
                    }}
                >
                    {message.content}
                </Typography>
                {isAI && (
                    <Typography
                        variant="caption"
                        display="block"
                        sx={{
                            mt: 1.5,
                            color: '#A090B0',
                            fontSize: '0.75rem',
                            fontStyle: 'italic',
                        }}
                    >
                        💡 Click to view SQL details
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default ChatBubble;
