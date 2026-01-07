import { createTheme } from '@mui/material';

export const chatGPTTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6D5CFF', // User Message Bubble
            contrastText: '#F2ECF8',
        },
        secondary: {
            main: '#B44BFF', // For gradients
        },
        background: {
            default: '#12081F', // Main Background
            paper: '#1E0C34',   // AI Message Bubble
        },
        text: {
            primary: '#F2ECF8', // Main Text
            secondary: '#A090B0', // Subtitle Text (made slightly lighter than bg for contrast)
        },
        divider: '#2B1348',
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        body1: {
            lineHeight: 1.7,
            fontSize: '1rem',
            color: '#F2ECF8',
        },
        h4: {
            color: '#F2ECF8',
        },
        h6: {
            color: '#F2ECF8',
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#12081F',
                    color: '#F2ECF8',
                    overflow: 'hidden',
                    height: '100%',
                    },
                html: {
                    overflow: 'hidden',
                    height: '100%',
                },
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
        },
    },
});
