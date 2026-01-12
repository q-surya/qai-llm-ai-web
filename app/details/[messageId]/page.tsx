'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Box, Button, Typography, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
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
            <Box
                sx={{
                    height: '100vh',
                    width: '100%',
                    bgcolor: 'background.default',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#2B1348 #12081F',
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
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h6">Response not found.</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/chat')}>
                    Back to Chat
                </Button>
            </Container>
            </Box>
        );
    }

    const { apiResponse } = message;

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100%',
                bgcolor: 'background.default',
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'thin',
                scrollbarColor: '#2B1348 #12081F',
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
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/chat')}>
                    Back
                </Button>
                <Typography variant="h5" fontWeight="bold">
                    Response Details
                </Typography>
            </Box>

            {/* Timing Summary - Show at top if available */}
            {(apiResponse.total_time_in_sec !== undefined || (apiResponse.node_timings && apiResponse.node_timings.length > 0)) && (
                <InfoCard title="Performance Summary">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {apiResponse.total_time_in_sec !== undefined && (
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 1,
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    textAlign: 'center',
                                }}
                            >
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Total Execution Time
                                </Typography>
                                <Typography variant="h4" fontWeight="bold">
                                    {apiResponse.total_time_in_sec.toFixed(3)}s
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                                    {((apiResponse.total_time_in_sec / 60).toFixed(2))} minutes
                                </Typography>
                            </Box>
                        )}
                        {apiResponse.node_timings && apiResponse.node_timings.length > 0 && (
                            <Box>
                                <Typography variant="body2" fontWeight="bold" color="text.secondary" gutterBottom>
                                    Node Breakdown:
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                                    {apiResponse.node_timings.map((node, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 1,
                                                borderRadius: 1,
                                                bgcolor: 'action.hover',
                                            }}
                                        >
                                            <Typography variant="body2">{node.name}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" fontWeight="bold" color="primary">
                                                    {node.time_sec !== undefined ? `${node.time_sec.toFixed(2)}s` : 'N/A'}
                                                </Typography>
                                                {apiResponse.total_time_in_sec && node.time_sec !== undefined && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        ({((node.time_sec / apiResponse.total_time_in_sec) * 100).toFixed(1)}%)
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </InfoCard>
            )}

            <InfoCard title="SQL Prompt">
                <CodeBlock code={apiResponse.sql_prompt} />
            </InfoCard>

            <InfoCard title="Generated SQL Query">
                <CodeBlock code={apiResponse.sql_query} />
            </InfoCard>

            <InfoCard title="Final Answer">
                <Box
                    sx={{
                        '& p': {
                            margin: '0 0 0.75rem 0',
                            '&:last-child': {
                                marginBottom: 0,
                            },
                        },
                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                            margin: '0.5rem 0 0.75rem 0',
                            fontWeight: 600,
                            '&:first-of-type': {
                                marginTop: 0,
                            },
                        },
                        '& ul, & ol': {
                            margin: '0.5rem 0',
                            paddingLeft: '1.5rem',
                        },
                        '& li': {
                            margin: '0.25rem 0',
                        },
                        '& code': {
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            padding: '0.2rem 0.4rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.9em',
                            fontFamily: 'monospace',
                        },
                        '& pre': {
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            overflow: 'auto',
                            margin: '0.75rem 0',
                            '& code': {
                                backgroundColor: 'transparent',
                                padding: 0,
                            },
                        },
                        '& table': {
                            borderCollapse: 'collapse',
                            width: '100%',
                            margin: '0.75rem 0',
                        },
                        '& th, & td': {
                            border: '1px solid rgba(0, 0, 0, 0.2)',
                            padding: '0.5rem',
                        },
                        '& th': {
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        },
                    }}
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {apiResponse.answer}
                    </ReactMarkdown>
                </Box>
            </InfoCard>

            {apiResponse.summarized_intent && (
                <InfoCard title="Summarized Intent">
                    <Typography variant="body2">{apiResponse.summarized_intent}</Typography>
                </InfoCard>
            )}

            {apiResponse.technical_intent && (
                <InfoCard title="Technical Intent">
                    <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                        {apiResponse.technical_intent}
                    </Typography>
                </InfoCard>
            )}

            {apiResponse.node_timings && apiResponse.node_timings.length > 0 && (
                <InfoCard title="Node Timings">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {apiResponse.node_timings.map((node, index) => (
                            <Box
                                key={index}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 1,
                                    bgcolor: node.success ? 'action.hover' : 'error.light',
                                    border: 1,
                                    borderColor: node.success ? 'success.main' : 'error.main',
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Typography variant="body2" fontWeight="bold">
                                        {node.name}
                                    </Typography>
                                    <Chip
                                        label={node.success ? 'Success' : 'Failed'}
                                        color={node.success ? 'success' : 'error'}
                                        size="small"
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Time: {node.time_sec !== undefined 
                                        ? `${node.time_sec.toFixed(2)}s (${(node.time_sec * 1000).toFixed(2)}ms)`
                                        : 'N/A'}
                                </Typography>
                            </Box>
                        ))}
                        {apiResponse.total_time_in_sec !== undefined && (
                            <Box
                                sx={{
                                    mt: 2,
                                    pt: 2,
                                    borderTop: 1,
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography variant="body2" fontWeight="bold" color="primary">
                                    Total Time: {apiResponse.total_time_in_sec.toFixed(3)}s
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </InfoCard>
            )}

            {apiResponse.workflow_tokens && apiResponse.workflow_tokens.length > 0 && (
                <InfoCard title="Token Usage">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {apiResponse.workflow_tokens.map((token, index) => (
                            <Box
                                key={index}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 1,
                                    bgcolor: 'action.hover',
                                    border: 1,
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography variant="body2" fontWeight="bold" gutterBottom>
                                    {token.name}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Input: {token.input_tokens.toLocaleString()} tokens
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Output: {token.output_tokens.toLocaleString()} tokens
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total: {(token.input_tokens + token.output_tokens).toLocaleString()} tokens
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                        {(apiResponse.total_input_tokens !== undefined || apiResponse.total_output_tokens !== undefined) && (
                            <Box
                                sx={{
                                    mt: 2,
                                    pt: 2,
                                    borderTop: 1,
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography variant="body2" fontWeight="bold" color="primary" gutterBottom>
                                    Total Tokens:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    {apiResponse.total_input_tokens !== undefined && (
                                        <Typography variant="body2" color="text.secondary">
                                            Input: {apiResponse.total_input_tokens.toLocaleString()} tokens
                                        </Typography>
                                    )}
                                    {apiResponse.total_output_tokens !== undefined && (
                                        <Typography variant="body2" color="text.secondary">
                                            Output: {apiResponse.total_output_tokens.toLocaleString()} tokens
                                        </Typography>
                                    )}
                                    {apiResponse.total_input_tokens !== undefined && apiResponse.total_output_tokens !== undefined && (
                                        <Typography variant="body2" color="text.secondary">
                                            Grand Total: {(apiResponse.total_input_tokens + apiResponse.total_output_tokens).toLocaleString()} tokens
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </InfoCard>
            )}

        </Container>
        </Box>
    );
}
