import { ColumnConfiguration, ContextMenuItems } from '../../public-api';

export class TableConfiguration {
  id?: string; // table id
  data?: any[];
  columns?: ColumnConfiguration[];
  enableColumnChooser?: boolean; // true ||  false
  enableSort?: boolean; // true ||  false
  enableSearch?: boolean; // true ||  false
  enableColumnFilters?: boolean; // true ||  false
  rowHoverClass?: string;
  enablePaging?: boolean; // true ||  false
  enableScroll?: boolean; // true ||  false
  isTreeStructure?: boolean; // true ||  false
  icons?: TableIcon;
  rowSelection?: string; // single  || multiple
  enableRowSelection?: boolean; // true ||  false
  enableFixedHeader?: boolean;
  enableLazyLoad?: boolean;
  showSpinner?: boolean;
  enableContextMenu?: boolean; // true || false
  contextMenuItems?: ContextMenuItems[] = [];
}
export class TableIcon {
  sortIcon: string;
  expandIcon: string;
  collapseIcon: string;
}
