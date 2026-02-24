'use client';

import React, { useState, useRef } from 'react';
import {
    Box,
    Avatar,
    IconButton,
    CircularProgress,
    Typography,
    Tooltip,
    Chip,
    Alert,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { apiPatch, getMediaUrl } from '@/utils/api';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MIN_DIMENSION_PX = 300;
const RECOMMENDED_DIMENSION_PX = 500;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_TYPES_LABEL = 'JPG, PNG or WebP';

interface ProfileImageUploadProps {
    currentImage?: string;
    onUploadSuccess: (newImageUrl: string) => void;
    onError: (message: string) => void;
}

/** Returns image dimensions without adding it to the DOM. */
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new window.Image();
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
            URL.revokeObjectURL(url);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Could not read image file.'));
        };
        img.src = url;
    });
}

export default function ProfileImageUpload({
    currentImage,
    onUploadSuccess,
    onError,
}: ProfileImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const [inlineWarning, setInlineWarning] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setInlineWarning(null);

        // ── 1. Format check ────────────────────────────────────────────
        if (!ACCEPTED_TYPES.includes(file.type)) {
            onError(
                `Unsupported file type "${file.type || 'unknown'}". ` +
                `Please upload a ${ACCEPTED_TYPES_LABEL} file.`
            );
            return;
        }

        // ── 2. Size check ──────────────────────────────────────────────
        if (file.size > MAX_FILE_SIZE_BYTES) {
            const sizeMB = (file.size / 1024 / 1024).toFixed(1);
            onError(
                `Your file is ${sizeMB} MB — the maximum allowed is ${MAX_FILE_SIZE_MB} MB. ` +
                `Try compressing it at squoosh.app or tinypng.com first.`
            );
            return;
        }

        // ── 3. Dimension check (non-blocking — warn only) ──────────────
        try {
            const { width, height } = await getImageDimensions(file);
            const shorter = Math.min(width, height);

            if (shorter < MIN_DIMENSION_PX) {
                onError(
                    `Image is too small (${width}×${height} px). ` +
                    `Minimum is ${MIN_DIMENSION_PX}×${MIN_DIMENSION_PX} px — it will look blurry in the circular frame. ` +
                    `Please use a higher-resolution photo.`
                );
                return;
            }

            if (shorter < RECOMMENDED_DIMENSION_PX) {
                // Warn but still allow upload
                setInlineWarning(
                    `Image is ${width}×${height} px — it will work, but for the best quality ` +
                    `we recommend at least ${RECOMMENDED_DIMENSION_PX}×${RECOMMENDED_DIMENSION_PX} px.`
                );
            }
        } catch {
            // If we can't read dimensions, skip the check and let the server handle it
        }

        // ── 4. Upload ──────────────────────────────────────────────────
        const formData = new FormData();
        formData.append('profile_image', file);

        try {
            setLoading(true);
            const result = await apiPatch('/api/v1/profiles/me/update/', formData);

            if (result.success && result.data?.profile_image) {
                onUploadSuccess(result.data.profile_image);
                setInlineWarning(null);
            } else {
                onError(result.message || 'Upload failed — please try again.');
            }
        } catch (err: unknown) {
            onError(
                err instanceof Error
                    ? err.message
                    : 'An unexpected error occurred during upload.'
            );
        } finally {
            setLoading(false);
            // Reset so re-selecting the same file triggers onChange
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            {/* Avatar + camera button */}
            <Box sx={{ position: 'relative', width: 160, height: 160, mb: 0.5 }}>
                <Avatar
                    src={getMediaUrl(currentImage)}
                    sx={{
                        width: 160,
                        height: 160,
                        border: '4px solid',
                        borderColor: 'primary.main',
                        bgcolor: 'grey.200',
                        boxShadow: '0 4px 20px rgba(186,60,80,0.2)',
                    }}
                />

                {loading && (
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(255,255,255,0.6)',
                        borderRadius: '50%',
                    }}>
                        <CircularProgress size={44} />
                    </Box>
                )}

                <input
                    type="file"
                    hidden
                    accept={ACCEPTED_TYPES.join(',')}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />

                <Tooltip title="Change couple photo">
                    <IconButton
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        size="small"
                        sx={{
                            position: 'absolute',
                            bottom: 4,
                            right: 4,
                            bgcolor: 'primary.main',
                            color: 'white',
                            width: 36,
                            height: 36,
                            '&:hover': { bgcolor: 'primary.dark' },
                            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                        }}
                    >
                        <PhotoCameraIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Inline soft warning (below minimum recommended, but still allowed) */}
            {inlineWarning && (
                <Alert
                    severity="warning"
                    icon={<InfoOutlinedIcon fontSize="small" />}
                    sx={{ width: '100%', fontSize: '0.78rem', py: 0.5 }}
                >
                    {inlineWarning}
                </Alert>
            )}

            {/* Guidance chips — always visible so couples know before they try */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', mt: 0.5 }}>
                <Chip
                    icon={<InfoOutlinedIcon />}
                    label={`Max ${MAX_FILE_SIZE_MB} MB`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.72rem' }}
                />
                <Chip
                    icon={<InfoOutlinedIcon />}
                    label={`${ACCEPTED_TYPES_LABEL}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.72rem' }}
                />
                <Chip
                    icon={<InfoOutlinedIcon />}
                    label={`Best: square ≥ ${RECOMMENDED_DIMENSION_PX}×${RECOMMENDED_DIMENSION_PX} px`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.72rem' }}
                />
            </Box>

            <Typography
                variant="caption"
                color="text.secondary"
                align="center"
                sx={{ maxWidth: 240, lineHeight: 1.4 }}
            >
                A square close-up photo of both of you works best in the circular frame.
            </Typography>
        </Box>
    );
}

