export interface RouteParams {
  id?: string;
  action?: 'view' | 'edit';
}

export interface NavigationState {
  from?: string;
  message?: string;
}

export interface BreadcrumbItem {
  label: string;
  path: string;
}