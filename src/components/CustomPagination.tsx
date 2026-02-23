'use client';

import React from 'react';
import { Pagination as MuiPagination, Stack, Box } from '@mui/material';

interface CustomPaginationProps {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function CustomPagination({
    totalItems,
    pageSize,
    currentPage,
    onPageChange
}: CustomPaginationProps) {
    const totalPages = Math.ceil(totalItems / pageSize);

    if (totalPages <= 1) return null;

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        onPageChange(value);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
            <Stack spacing={2}>
                <MuiPagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handleChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    sx={{
                        '& .MuiPaginationItem-root': {
                            borderRadius: '30px', // Pill-shaped as per guidelines
                            fontWeight: 'bold',
                            '&.Mui-selected': {
                                backgroundColor: '#BA3C50',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#9a2e40',
                                }
                            }
                        }
                    }}
                />
            </Stack>
        </Box>
    );
}
