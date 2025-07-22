export interface FileTreeResourceProps {
  knowledgeBaseId: string;
  orgId: string;
  connectionId: string;
}

export interface KnowledgeBaseDataProps {
  knowledge_base_id: string;
  connection_id: string;
  created_at: string;
  updated_at: string;
  connection_source_ids: string[];
  website_sources: any[];
  connection_provider_type: string;
  is_empty: boolean;
  total_size: number;
  name: string;
  description: string;
  indexing_params: {
    ocr: boolean;
    unstructured: boolean;
    embedding_params: {
      api: string | null;
      base_url: string | null;
      embedding_model: string;
      batch_size: number;
      track_usage: boolean;
      timeout: number;
    };
    chunker_params: {
      chunk_size: number;
      chunk_overlap: number;
      chunker_type: string;
    };
  };
  cron_job_id: string | null;
  org_id: string;
  org_level_role: string | null;
  user_metadata_schema: any;
  dataloader_metadata_schema: {
    properties: {
      path: {
        type: string;
        description: string;
        order: number;
        subtype: string;
      };
      web_url: {
        type: string;
        description: string;
        order: number;
        subtype: string;
      };
      created_at: {
        type: string;
        description: string;
        order: number;
      };
      created_by: {
        type: string;
        description: string;
        order: number;
        subtype: string;
      };
      last_modified_at: {
        type: string;
        description: string;
        order: number;
      };
      last_modified_by: {
        type: string;
        description: string;
        order: number;
        subtype: string;
      };
    };
  };
}

// Normalized interface with only the required fields
export interface KnowledgeBaseProps {
  id: string;
  name: string;
  connectionId: string;
  orgId: string;
  indexedItems: string[];
  totalSize: number;
  description: string;
  provider: string;
  totalFiles: number;
  lastUpdate: string;
}

export interface FileTreeProps {
  viewOnly?: boolean;
  resource: FileTreeResourceProps;
  knowledgeBase?: KnowledgeBaseProps;
  type: ResourceType;
}

export interface FileTreeItemProps {
  entry: FileTreeEntryProps;
  viewOnly: boolean;
  isOpen: boolean;
  toggleFolder: () => void;
  level: number;
}

export type FileTreeEntryStatusProps =
  | "indexed"
  | "not_indexed"
  | "indexing"
  | "pending"
  | "error";

export interface FileTreeEntryProps {
  id: string;
  name: string;
  path: string;
  type: "file" | "directory";
  status: FileTreeEntryStatusProps;
  size?: number;
  expanded?: boolean;
  loading?: boolean;
}

export interface FileItemProps {
  name: string;
  type: "file" | "directory";
  status?: FileTreeEntryStatusProps;
  size?: number;
}

export interface FileTreeRowProps {
  entry: FileTreeEntryProps;
  isRoot?: boolean;
  viewOnly: boolean;
  expanded?: boolean;
  level?: number;
  resource: FileTreeResourceProps;
  type: ResourceType;
}

export interface FilePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelectFiles: (fileIds: string[]) => void;
}

export interface ConnectionResource {
  created_at: string;
  inode_id?: string;
  resource_id?: string;
  inode_type: "file" | "directory";
  inode_path: { path: string };
  size?: number;
  status?: FileTreeEntryStatusProps;
}

export interface ConnectionResourceListResponse {
  data: ConnectionResource[];
}

export interface KnowledgeBaseResponse {
  rawData: KnowledgeBaseDataProps;
  normalized: KnowledgeBaseProps;
}

export type ResourceType = "connection-resource" | "knowledge-base";
