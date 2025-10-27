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
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  PictureAsPdf,
  VideoLibrary,
  Image as ImageIcon,
  InsertDriveFile,
} from "@mui/icons-material";

const FileUpload = ({ onUpload, courseId, disabled = false }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  // File validation
  const FILE_TYPES = {
    pdf: {
      extensions: [".pdf"],
      maxSize: 10 * 1024 * 1024, // 10MB
      icon: PictureAsPdf,
      color: "#d32f2f",
    },
    video: {
      extensions: [".mp4", ".avi", ".mov", ".mkv", ".webm"],
      maxSize: 100 * 1024 * 1024, // 100MB
      icon: VideoLibrary,
      color: "#1976d2",
    },
    image: {
      extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
      maxSize: 5 * 1024 * 1024, // 5MB
      icon: ImageIcon,
      color: "#388e3c",
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
        error: `Unsupported file type. Allowed: PDF, Video (MP4, AVI, MOV, MKV, WebM), Image (JPG, PNG, GIF, WebP)`,
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

    setSelectedFiles([...selectedFiles, ...validatedFiles]);
    event.target.value = ""; // Reset input
  };

  const handleRemoveFile = (fileId) => {
    setSelectedFiles(selectedFiles.filter((f) => f.id !== fileId));
    setError(null);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select files to upload");
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
          accept=".pdf,.mp4,.avi,.mov,.mkv,.webm,.jpg,.jpeg,.png,.gif,.webp"
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
              PDFs (up to 10MB), Videos (up to 100MB), Images (up to 5MB)
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
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveFile(fileObj.id)}
                      disabled={uploading}
                      size="small"
                      sx={{ color: "error.main" }}
                    >
                      <Delete />
                    </IconButton>
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

          {/* Upload Button */}
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
        </Paper>
      )}
    </Box>
  );
};

export default FileUpload;
