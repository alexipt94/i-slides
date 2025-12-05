export type ItemType = 'presentation' | 'folder';

export interface BaseItem {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  author?: string;
}

export interface PresentationItem extends BaseItem {
  type: 'presentation';
  thumbnail?: string;
  slideCount: number;
  lastOpened?: string;
  // size?: number; // УБРАНО
}

export interface FolderItem extends BaseItem {
  type: 'folder';
  isExpanded: boolean;
  childrenCount: number;
  children?: GalleryItem[];
}

export type GalleryItem = PresentationItem | FolderItem;

export interface BreadcrumbItem {
  id: string | null;
  name: string;
}

export interface ContextMenuState {
  x: number;
  y: number;
  itemId: string;
  itemType: ItemType;
}

export interface BulkAction {
  type: 'delete' | 'move' | 'copy' | 'rename';
  label: string;
  icon: string;
  color?: 'danger' | 'warning' | 'success' | 'info';
}