import {
  FileAudio,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  FolderOpen,
  File,
  Image,
} from "lucide-react";

/**
 * Get the appropriate icon for a file type
 */
function getFileIcon(name: string, type: string, isExpanded?: boolean) {
  if (type === "directory") {
    return isExpanded ? FolderOpen : Folder;
  }

  const extension = name.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return FileText;
    case "doc":
    case "docx":
    case "txt":
    case "md":
      return FileText;
    case "xls":
    case "xlsx":
    case "csv":
      return FileSpreadsheet;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
      return Image;
    case "mp4":
    case "avi":
    case "mov":
      return FileVideo;
    case "mp3":
    case "wav":
    case "flac":
      return FileAudio;
    default:
      return File;
  }
}

export { getFileIcon };
