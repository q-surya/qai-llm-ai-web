'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Box, Button, Typography, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useChat from '../../../hooks/useChat';
import InfoCard from '../../../components/details/InfoCard';

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
    <Box
        component="pre"
        sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.default',
            overflowX: 'auto',
            my: 0,
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            border: 1,
            borderColor: 'divider',
        }}
    >
        {code}
    </Box>
);

export default function ResponseDetails() {
    const params = useParams();
    const router = useRouter();
    const { messages } = useChat();
    const messageId = params.messageId as string;
    const message = messages.find((m) => m.id === messageId);

    if (!message || !message.apiResponse) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h6">Response not found.</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/chat')}>
                    Back to Chat
                </Button>
            </Container>
        );
    }

    const { apiResponse } = message;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/chat')}>
                    Back
                </Button>
                <Typography variant="h5" fontWeight="bold">
                    Response Details
                </Typography>
            </Box>

            <InfoCard title="Extracted Keywords">
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {apiResponse.keywords.map((k, i) => (
                        <Chip key={i} label={k} size="small" variant="outlined" />
                    ))}
                </Box>
            </InfoCard>

            <InfoCard title="Matched Tables">
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {apiResponse.matched_tables.map((t, i) => (
                        <Chip key={i} label={t} color="secondary" size="small" />
                    ))}
                </Box>
            </InfoCard>

            <InfoCard title="Matched Columns">
                {Object.entries(apiResponse.matched_columns).map(([table, cols]) => (
                    <Box key={table} sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight="bold" color="text.secondary">
                            {table}:
                        </Typography>
                        <Typography variant="body2">{cols.join(', ')}</Typography>
                    </Box>
                ))}
            </InfoCard>

            <InfoCard title="SQL Prompt">
                <CodeBlock code={apiResponse.sql_prompt} />
            </InfoCard>

            <InfoCard title="Generated SQL Query">
                <CodeBlock code={apiResponse.sql_query} />
            </InfoCard>

            <InfoCard title="Final Answer">
                <Typography variant="body1">{apiResponse.answer}</Typography>
            </InfoCard>

        </Container>
    );
}
