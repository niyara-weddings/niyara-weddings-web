'use client';

import React, { useState, useRef } from 'react';
import {
    Box,
    Avatar,
    IconButton,
    CircularProgress,
    Typography,
    Tooltip
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { apiPatch, getMediaUrl } from '@/utils/api';

interface ProfileImageUploadProps {
    currentImage?: string;
    onUploadSuccess: (newImageUrl: string) => void;
    onError: (message: string) => void;
}

export default function ProfileImageUpload({
    currentImage,
    onUploadSuccess,
    onError
}: ProfileImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            onError('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            onError('Image size must be less than 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('profile_image', file);

        try {
            setLoading(true);
            // We use PATCH to /api/v1/profiles/me/update/ as defined in the backend views
            const result = await apiPatch('/api/v1/profiles/me/update/', formData);

            if (result.success && result.data?.profile_image) {
                onUploadSuccess(result.data.profile_image);
            } else {
                onError(result.message || 'Failed to upload image');
            }
        } catch (err: any) {
            onError(err.message || 'An unexpected error occurred during upload');
        } finally {
            setLoading(false);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Box sx={{ position: 'relative', width: 120, height: 120, mb: 2 }}>
            <Avatar
                src={getMediaUrl(currentImage)}
                sx={{
                    width: 120,
                    height: 120,
                    border: '4px solid',
                    borderColor: 'primary.main',
                    bgcolor: 'grey.200'
                }}
            />

            {loading && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '50%'
                }}>
                    <CircularProgress size={40} />
                </Box>
            )}

            <input
                type="file"
                hidden
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            <Tooltip title="Upload Profile Image">
                <IconButton
                    onClick={handleButtonClick}
                    disabled={loading}
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'primary.dark',
                        },
                        boxShadow: 2
                    }}
                >
                    <PhotoCameraIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
}
