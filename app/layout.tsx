'use client';

import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ChatProvider } from '../context/ChatContext';
import { chatGPTTheme } from '../theme';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" style={{ overflow: 'hidden', height: '100%' }}>
            <body style={{ overflow: 'hidden', height: '100%', margin: 0 }}>
                <ThemeProvider theme={chatGPTTheme}>
                    <CssBaseline />
                    <ChatProvider>{children}</ChatProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
