import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  Download,
  Delete,
  Visibility,
  PictureAsPdf,
  VideoLibrary,
  Image as ImageIcon,
  Close,
} from "@mui/icons-material";
import CourseService from "../../services/CourseService";

const ViewContent = ({ courseId, onDelete }) => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewDialog, setPreviewDialog] = useState({ open: false, content: null });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (courseId) {
      fetchContents();
    }
  }, [courseId]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await CourseService.getCourseById(courseId);
      
      // Extract contents from the course response
      setContents(response.contents || []);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError(err.message || "Failed to fetch content");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (content) => {
    const url = CourseService.getDownloadUrl(content.fileUrl);
    window.open(url, '_blank');
  };

  const handlePreview = (content) => {
    setPreviewDialog({ open: true, content });
  };

  const handleDelete = async (content) => {
    if (window.confirm(`Are you sure you want to delete "${content.fileName}"?`)) {
      try {
        await CourseService.deleteCourseContent(content.id);
        setContents(contents.filter((c) => c.id !== content.id));
        if (onDelete) onDelete(content.id);
      } catch (err) {
        console.error("Delete error:", err);
        alert(err.message || "Failed to delete content");
      }
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') {
      return { icon: PictureAsPdf, color: "#d32f2f" };
    } else if (fileType === 'video/mp4') {
      return { icon: VideoLibrary, color: "#1976d2" };
    } else if (fileType.startsWith('image/')) {
      return { icon: ImageIcon, color: "#388e3c" };
    }
    return { icon: PictureAsPdf, color: "#757575" };
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filterContentsByType = (type) => {
    if (type === "all") return contents;
    
    if (type === "pdf") {
      return contents.filter((c) => c.fileType === 'application/pdf');
    } else if (type === "video") {
      return contents.filter((c) => c.fileType === 'video/mp4');
    } else if (type === "image") {
      return contents.filter((c) => c.fileType?.startsWith('image/'));
    }
    
    return contents;
  };

  const getFilteredContents = () => {
    const tabs = ["all", "pdf", "video", "image"];
    return filterContentsByType(tabs[activeTab]);
  };

  const getContentCounts = () => {
    return {
      all: contents.length,
      pdf: contents.filter((c) => c.fileType === 'application/pdf').length,
      video: contents.filter((c) => c.fileType === 'video/mp4').length,
      image: contents.filter((c) => c.fileType?.startsWith('image/')).length,
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  const counts = getContentCounts();
  const filteredContents = getFilteredContents();

  return (
    <Box>
      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Course Materials
        </Typography>
        
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label={`All (${counts.all})`} />
          <Tab label={`PDFs (${counts.pdf})`} />
          <Tab label={`Videos (${counts.video})`} />
          <Tab label={`Images (${counts.image})`} />
        </Tabs>
      </Paper>

      {filteredContents.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            No {activeTab === 0 ? "" : ["all", "PDF", "video", "image"][activeTab]} content available
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredContents.map((content) => {
            const { icon: Icon, color } = getFileIcon(content.fileType);
            return (
              <Grid item xs={12} sm={6} md={4} key={content.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: 4,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                      <Icon sx={{ fontSize: 40, color, mr: 2 }} />
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={content.fileName}
                        >
                          {content.fileName}
                        </Typography>
                        <Chip
                          label={CourseService.getFileTypeCategory(content.fileType).toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: color,
                            color: "white",
                            fontSize: "0.7rem",
                            height: 20,
                            mt: 0.5,
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary" display="block">
                      Size: {formatFileSize(content.fileSize)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Uploaded: {formatDate(content.uploadDate)}
                    </Typography>
                    {content.uploadedByUserName && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        By: {content.uploadedByUserName}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                    <Box>
                      {(content.fileType.startsWith('image/') || content.fileType === 'application/pdf') && (
                        <IconButton
                          size="small"
                          onClick={() => handlePreview(content)}
                          sx={{ color: "primary.main" }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(content)}
                        sx={{ color: "info.main" }}
                      >
                        <Download fontSize="small" />
                      </IconButton>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(content)}
                      sx={{ color: "error.main" }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={() => setPreviewDialog({ open: false, content: null })}
        maxWidth="md"
        fullWidth
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6">
            {previewDialog.content?.fileName}
          </Typography>
          <IconButton
            onClick={() => setPreviewDialog({ open: false, content: null })}
          >
            <Close />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 0 }}>
          {previewDialog.content?.fileType?.startsWith('image/') && (
            <Box
              component="img"
              src={CourseService.getPreviewUrl(previewDialog.content.fileUrl)}
              alt={previewDialog.content.fileName}
              sx={{ width: "100%", height: "auto" }}
            />
          )}
          {previewDialog.content?.fileType === 'application/pdf' && (
            <Box sx={{ height: "70vh" }}>
              <iframe
                src={CourseService.getPreviewUrl(previewDialog.content.fileUrl)}
                style={{ width: "100%", height: "100%", border: "none" }}
                title={previewDialog.content.fileName}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ViewContent;
