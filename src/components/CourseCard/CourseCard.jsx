import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  CardActions,
} from "@mui/material";
import {
  Edit,
  Visibility,
  Delete,
  PictureAsPdf,
  VideoLibrary,
  Image as ImageIcon,
} from "@mui/icons-material";

const CourseCard = ({ course, onEdit, onView, onDelete }) => {
  const getContentSummary = () => {
    if (!course.contentCount) return null;
    
    const { pdfs = 0, videos = 0, images = 0 } = course.contentCount;
    const items = [];
    
    if (pdfs > 0) items.push({ icon: PictureAsPdf, count: pdfs, color: "#d32f2f" });
    if (videos > 0) items.push({ icon: VideoLibrary, count: videos, color: "#1976d2" });
    if (images > 0) items.push({ icon: ImageIcon, count: images, color: "#388e3c" });
    
    return items;
  };

  const contentSummary = getContentSummary();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
        },
        position: "relative",
        overflow: "hidden",
        background: "white",
      }}
    >
      {/* Gradient Overlay on Image */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="180"
          image={
            course.thumbnail ||
            `https://source.unsplash.com/random/400x300?course,education,${course.id}`
          }
          alt={course.title}
          sx={{
            objectFit: "cover",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)",
          }}
        />
        {course.status && (
          <Chip
            label={course.status}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: course.status === "Published" ? "#4caf50" : "#ff9800",
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.4,
            minHeight: "2.8em",
          }}
        >
          {course.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            minHeight: "3.6em",
          }}
        >
          {course.description}
        </Typography>

        {/* Content Summary */}
        {contentSummary && contentSummary.length > 0 && (
          <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
            {contentSummary.map((item, index) => {
              const Icon = item.icon;
              return (
                <Chip
                  key={index}
                  icon={<Icon sx={{ color: item.color }} />}
                  label={item.count}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: item.color,
                    color: item.color,
                    fontWeight: 600,
                  }}
                />
              );
            })}
          </Box>
        )}

        {/* Instructor */}
        {course.instructor && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
            <strong>Instructor:</strong> {course.instructor}
          </Typography>
        )}

        {/* Duration */}
        {course.duration && (
          <Typography variant="caption" color="text.secondary">
            <strong>Duration:</strong> {course.duration}
          </Typography>
        )}
      </CardContent>

      <CardActions
        sx={{
          justifyContent: "space-between",
          px: 2,
          pb: 2,
          pt: 0,
        }}
      >
        <Box>
          <IconButton
            size="small"
            onClick={() => onView(course)}
            sx={{
              color: "primary.main",
              "&:hover": { bgcolor: "primary.lighter" },
            }}
          >
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onEdit(course)}
            sx={{
              color: "info.main",
              "&:hover": { bgcolor: "info.lighter" },
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Box>
        <IconButton
          size="small"
          onClick={() => onDelete(course)}
          sx={{
            color: "error.main",
            "&:hover": { bgcolor: "error.lighter" },
          }}
        >
          <Delete fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default CourseCard;
