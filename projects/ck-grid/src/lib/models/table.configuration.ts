import { ColumnConfiguration, ContextMenuItems } from '../../public-api';

export class TableConfiguration {
  id?: string; // table id
  data?: any[];
  columns?: ColumnConfiguration[];
  enableColumnChooser?: boolean; // true ||  false
  enableSort?: boolean; // true ||  false
  enableColumnFilters?: boolean; // true ||  false
  enableRowSelection?: boolean; // true ||  false
  isTreeStructure?: boolean; // true ||  false
  icons?: TableIcon;
  rowSelection?: string; // single  || multiple
  enableFixedHeader?: boolean;
  showSpinner?: boolean;
  enableContextMenu?: boolean; // true || false
  contextMenuItems?: ContextMenuItems[] = [];
}
export class TableIcon {
  sortIcon: string;
  expandIcon: string;
  collapseIcon: string;
}
