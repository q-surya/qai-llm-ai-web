import React, { useState, type KeyboardEvent } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send'; // Or ArrowUpward if matching screenshot exactly

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSend(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                pt: 2,
                pb: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box sx={{ position: 'relative', width: '100%' }}>
                <TextField
                    fullWidth
                    placeholder="Message Quantara..."
                    multiline
                    maxRows={1} // Keep it sleek like a search bar
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: '#1E0C34', // Dark bubble background
                            borderRadius: '30px', // Pill shape
                            color: '#F2ECF8',
                            pl: 3,
                            pr: 7,
                            height: '56px', // Fixed height for consistency
                            alignItems: 'center', // Vertically center content
                            '& fieldset': {
                                borderColor: '#2B1348',
                            },
                            '&:hover fieldset': {
                                borderColor: '#6D5CFF',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#6D5CFF',
                                borderWidth: '1px',
                            },
                        },
                    }}
                    inputProps={{
                        style: { padding: 0 },
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                    }}
                >
                    <IconButton
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        sx={{
                            // Gradient button: #6D5CFF → #B44BFF
                            background: input.trim() ? 'linear-gradient(135deg, #6D5CFF 0%, #B44BFF 100%)' : '#2B1348',
                            color: '#F2ECF8',
                            width: '36px',
                            height: '36px',
                            opacity: input.trim() ? 1 : 0.5,
                            '&:hover': {
                                background: input.trim() ? 'linear-gradient(135deg, #5844E0 0%, #9F33E6 100%)' : '#2B1348',
                            },
                            transition: 'all 0.2s',
                        }}
                    >
                        <SendIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{ mt: 1.5, textAlign: 'center', px: 2 }}>
                <Box
                    component="span"
                    sx={{
                        fontSize: '0.75rem',
                        color: '#A090B0', // Subtitle color
                        display: 'block',
                    }}
                >
                    Quantara can make mistakes. Consider checking important information.
                </Box>
            </Box>
        </Box>
    );
};

export default ChatInput;
