import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  IconButton,
  Chip,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  PictureAsPdf,
  VideoLibrary,
  Image as ImageIcon,
  InsertDriveFile,
  Visibility,
  Close,
} from "@mui/icons-material";

const FileUpload = ({ onUpload, onFileSelect, courseId, disabled = false, initialFiles = [] }) => {
  const [selectedFiles, setSelectedFiles] = useState(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [previewDialog, setPreviewDialog] = useState({ open: false, file: null, url: null });

  // File validation - API accepts: PDF, MP4, JPG, JPEG, PNG with 10MB max size
  const FILE_TYPES = {
    pdf: {
      extensions: [".pdf"],
      maxSize: 10 * 1024 * 1024, // 10MB
      icon: PictureAsPdf,
      color: "#d06363ff",
    },
    video: {
      extensions: [".mp4"],
      maxSize: 10 * 1024 * 1024, // 10MB
      icon: VideoLibrary,
      color: "#5a99d8ff",
    },
    image: {
      extensions: [".jpg", ".jpeg", ".png"],
      maxSize: 10 * 1024 * 1024, // 10MB
      icon: ImageIcon,
      color: "#53cc57ff",
    },
  };

  const getFileType = (fileName) => {
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
    for (const [type, config] of Object.entries(FILE_TYPES)) {
      if (config.extensions.includes(extension)) {
        return type;
      }
    }
    return null;
  };

  const validateFile = (file) => {
    const fileType = getFileType(file.name);
    
    if (!fileType) {
      return {
        valid: false,
        error: `Unsupported file type. Allowed: PDF, MP4, JPG, JPEG, PNG`,
      };
    }

    const config = FILE_TYPES[fileType];
    if (file.size > config.maxSize) {
      const maxSizeMB = (config.maxSize / (1024 * 1024)).toFixed(0);
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB limit for ${fileType} files`,
      };
    }

    return { valid: true, fileType };
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validatedFiles = [];
    let errors = [];

    files.forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        validatedFiles.push({
          file,
          type: validation.fileType,
          id: Date.now() + Math.random(),
        });
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      setError(errors.join("\n"));
    } else {
      setError(null);
    }

    const newFiles = [...selectedFiles, ...validatedFiles];
    setSelectedFiles(newFiles);
    
    // If onFileSelect callback is provided (for create mode), call it
    if (onFileSelect) {
      onFileSelect(newFiles);
    }
    
    event.target.value = ""; // Reset input
  };

  const handleRemoveFile = (fileId) => {
    const newFiles = selectedFiles.filter((f) => f.id !== fileId);
    setSelectedFiles(newFiles);
    
    // If onFileSelect callback is provided (for create mode), call it
    if (onFileSelect) {
      onFileSelect(newFiles);
    }
    
    setError(null);
  };

  const handlePreview = (fileObj) => {
    const file = fileObj.file;
    const url = URL.createObjectURL(file);
    setPreviewDialog({ open: true, file: fileObj, url });
  };

  const handleClosePreview = () => {
    if (previewDialog.url) {
      URL.revokeObjectURL(previewDialog.url);
    }
    setPreviewDialog({ open: false, file: null, url: null });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select files to upload");
      return;
    }

    // If only onFileSelect is provided (create mode without courseId), don't upload
    if (!onUpload) {
      setError("Upload handler not provided");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      await onUpload(selectedFiles, (progress) => {
        setUploadProgress(progress);
      });

      // Clear files after successful upload
      setSelectedFiles([]);
      setUploadProgress(0);
      
      // Clear the parent's selected files too
      if (onFileSelect) {
        onFileSelect([]);
      }
    } catch (err) {
      setError(err.message || "Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (type) => {
    const config = FILE_TYPES[type];
    if (!config) return InsertDriveFile;
    return config.icon;
  };

  const getFileColor = (type) => {
    const config = FILE_TYPES[type];
    if (!config) return "#757575";
    return config.color;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Box>
      {/* Upload Button */}
      <Paper
        sx={{
          p: 3,
          mb: 2,
          border: "2px dashed",
          borderColor: error ? "error.main" : "primary.main",
          borderRadius: 2,
          bgcolor: error ? "error.lighter" : "primary.lighter",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.3s",
          "&:hover": {
            borderColor: error ? "error.dark" : "primary.dark",
            bgcolor: error ? "error.light" : "primary.light",
          },
        }}
      >
        <input
          accept=".pdf,.mp4,.jpg,.jpeg,.png"
          style={{ display: "none" }}
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileSelect}
          disabled={disabled || uploading}
        />
        <label htmlFor="file-upload">
          <Box sx={{ cursor: "pointer" }}>
            <CloudUpload sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Select Files to Upload
            </Typography>
            <Typography variant="body2" color="text.secondary">
              PDF, MP4, JPG, JPEG, PNG (up to 10MB each)
            </Typography>
          </Box>
        </label>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error.split("\n").map((err, index) => (
            <div key={index}>{err}</div>
          ))}
        </Alert>
      )}

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <Paper sx={{ mb: 2, p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Selected Files ({selectedFiles.length})
          </Typography>
          <List dense>
            {selectedFiles.map((fileObj) => {
              const Icon = getFileIcon(fileObj.type);
              return (
                <ListItem
                  key={fileObj.id}
                  sx={{
                    bgcolor: "background.default",
                    borderRadius: 1,
                    mb: 1,
                    boxShadow: 5,
                    py: 1.5,
                  }}
                >
                  <Icon
                    sx={{
                      mr: 2,
                      color: getFileColor(fileObj.type),
                      fontSize: 32,
                    }}
                  />
                  <ListItemText
                    primary={fileObj.file.name}
                    secondary={
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <Chip
                          label={fileObj.type.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: getFileColor(fileObj.type),
                            color: "white",
                            fontSize: "0.7rem",
                            height: 20,
                          }}
                        />
                        <Typography variant="caption">
                          {formatFileSize(fileObj.file.size)}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      {(fileObj.type === 'image' || fileObj.type === 'pdf') && (
                        <IconButton
                          edge="end"
                          onClick={() => handlePreview(fileObj)}
                          disabled={uploading}
                          size="small"
                          sx={{ color: "primary.main" }}
                        >
                          <Visibility />
                        </IconButton>
                      )}
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveFile(fileObj.id)}
                        disabled={uploading}
                        size="small"
                        sx={{ color: "error.main" }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>

          {/* Upload Progress */}
          {uploading && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Uploading...</Typography>
                <Typography variant="body2">{uploadProgress}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          )}

          {/* Upload Button - Only show in edit mode when onUpload is provided */}
          {onUpload && (
            <Button
              fullWidth
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={handleUpload}
              disabled={disabled || uploading || selectedFiles.length === 0}
              sx={{
                mt: 2,
                py: 1.5,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                },
              }}
            >
              {uploading ? "Uploading..." : "Upload Files"}
            </Button>
          )}
        </Paper>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" noWrap sx={{ maxWidth: "90%" }}>
            {previewDialog.file?.file.name}
          </Typography>
          <IconButton onClick={handleClosePreview} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, bgcolor: "background.default" }}>
          {previewDialog.file?.type === 'image' && previewDialog.url && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
                p: 2,
              }}
            >
              <Box
                component="img"
                src={previewDialog.url}
                alt={previewDialog.file.file.name}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
          {previewDialog.file?.type === 'pdf' && previewDialog.url && (
            <Box sx={{ height: "70vh" }}>
              <iframe
                src={previewDialog.url}
                style={{ width: "100%", height: "100%", border: "none" }}
                title={previewDialog.file.file.name}
              />
            </Box>
          )}
          {previewDialog.file?.type === 'video' && previewDialog.url && (
            <Box sx={{ bgcolor: "black", display: "flex", justifyContent: "center" }}>
              <video
                controls
                style={{ width: "100%", maxHeight: "70vh" }}
                src={previewDialog.url}
              >
                Your browser does not support the video tag.
              </video>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FileUpload;
