import React from 'react';
import { Box, Typography } from '@mui/material';

export default function PublicFooter() {
    return (
        <Box
            sx={{
                py: 3,
                borderTop: '1px solid',
                borderColor: 'divider',
                textAlign: 'center',
                backgroundColor: '#433B5C',
                color: '#ffffff',
                width: '100%',
                mt: 'auto'
            }}
        >
            <Typography variant="body2" sx={{ fontFamily: 'Overpass, sans-serif' }}>
                © {new Date().getFullYear()} Niyara Weddings. All rights reserved.
            </Typography>
        </Box>
    );
}
