import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FilterPipe } from './filters/filter.pipe';
import { ModalService } from './ck-grid-modal/modal.service';
import { ColumnConfiguration, TableConfiguration } from '../public-api';

@Component({
  selector: 'ngx-ck-grid',
  templateUrl: './ck-grid.component.html',
  styleUrls: ['./ck-grid.component.scss'],
})
export class NGXCkGridComponent implements OnInit {
  searchText = '';
  searchToggleColumns = '';
  colFilterText = '';
  newSortItems = [];
  lzPreviousSliceIndex: number;
  gridProps = { hasColumns: true, hasData: true };
  enableSort = true;
  rowSelectClass = 'ck-grid-row-selected';
  modalTop = 0;
  modalLeft = 0;
  gridHeaderTop = -20;
  selectedRows: any = [];
  @Output('gridRowClick')
  gridRowClick = new EventEmitter<any>();
  @Output('gridCellClick')
  gridCellClick = new EventEmitter<any>();
  @Output('gridExpandCollapseClick')
  gridExpandCollapseClick = new EventEmitter<any>();
  @Output('gridContextMenuClick')
  gridContextMenuClick = new EventEmitter<any>();
  columnFilters: any[] = [];
  hiddenColumns: any[] = [];
  isExpanndCollapse = false;
  tableIcons = {
    sort: 'ck-grid-tree-grid ck-grid-tree-grid-sort',
    expand: 'ck-grid-tree-grid ck-grid-tree-grid-triangle-bottom',
    collapse: 'ck-grid-tree-grid ck-grid-tree-grid-triangle-right',
  };
  @Input()
  tableOptions: TableConfiguration;
  // table configuration
  allRows: any = [];
  visibleColumns: any = [];
  sortableData: any = [];
  fullTreeData: any = [];
  fTreeObjectFull: any = {};
  newObj: any = [];
  level = 0;
  classDetails: any = '';
  htmlElement: HTMLBaseElement;
  contextmenu = false;
  contextmenuX = 0;
  contextmenuY = 0;
  private displaySpinner = false;
  private lastScrollTop = 0;
  private selectedRowOnContextMenuClick;
  constructor(
    private modalService: ModalService,
    private filterPipe: FilterPipe
  ) {}

  ngOnInit() {
    // validate grid config options
    this.validateGridConfig();
    // Set Lazy Load Data
    this.setPartialData();
    // Set table header object
    this.setHeaderConfig();
    // initilizeGrid
    this.initGrid();
  }
  getIconClass(item) {
    if (!this.tableOptions.isTreeStructure) {
      return '';
    }
    if (!item.leaf && item.expand) {
      return this.tableIcons.expand;
    }
    if (!item.leaf && !item.expand) {
      return this.tableIcons.collapse;
    }
  }
  openModal($event, id: string) {
    this.modalLeft = 30; // $event.x - 100;
    this.modalTop = $event.y - 100;
    this.modalService.open(id);
  }

  closeModal(id: any) {
    this.modalService.close(id);
  }
  toggleColumns($event, column) {
    if ($event.currentTarget.checked) {
      this.hiddenColumns.push(column.name);
    } else {
      this.hiddenColumns = this.hiddenColumns.filter((x) => x !== column.name);
    }
    if (this.hiddenColumns.length <= 0) {
      this.fTreeObjectFull.header = this.visibleColumns;
      return;
    }
    const filterItems = this.visibleColumns.filter(
      (col) => !(this.hiddenColumns.indexOf(col.name) > -1)
    );
    this.fTreeObjectFull.header = filterItems;
  }
  // activates the menu with the coordinates
  onContextMenuRightClick(event, rowItem) {
    this.contextmenuX = event.clientX;
    this.contextmenuY = event.clientY;
    this.contextmenu = true;
    this.selectedRowOnContextMenuClick = rowItem;
  }
  // disables the menu
  disableContextMenu() {
    this.contextmenu = false;
  }
  contextMenuClick($event) {
    this.contextmenu = false;
    this.gridContextMenuClick.emit({
      $event: $event,
      data: this.selectedRowOnContextMenuClick,
    });
  }
  columnFilterchanges(columnKey, columnValue) {
    if (columnValue === undefined || columnValue.length <= 2) {
      if (
        !this.fTreeObjectFull.data ||
        this.fTreeObjectFull.data.length === 0
      ) {
        this.initGrid();
      }
      return;
    }
    const filterResult = this.filterPipe.transform(
      this.fTreeObjectFull.data,
      columnValue,
      columnKey
    );
    this.fTreeObjectFull.data = filterResult;
  }
  getDetails(level: any): string {
    return level * 2 + 'rem';
  }
  sortItemsByColumn(sortColumn: ColumnConfiguration): any {
    this.displaySpinner = true;
    let sortBy = 0;
    let sortBy1 = 0;
    if (!sortColumn.order || sortColumn.order === 'asc') {
      sortColumn.order = 'desc';
      sortBy = -1;
      sortBy1 = 1;
    } else {
      sortColumn.order = 'asc';
      sortBy = 1;
      sortBy1 = -1;
    }
    const newItems = this.sortableData.sort((a, b) =>
      a[sortColumn.id] > b[sortColumn.id] ? sortBy : sortBy1
    );
    newItems.forEach((dat) => {
      this.preOrderTraverse(dat, sortColumn);
    });
    this.setSortable(newItems);
    setTimeout(() => {
      this.displaySpinner = false;
    }, 600);
  }
  get displaySpinnerIcon() {
    return this.displaySpinner;
  }
  setSortable(newItems) {
    this.lzPreviousSliceIndex = 0;
    this.allRows = this.newObj = [];
    this.allRows = this.constructTreeObject(newItems);
    this.setLazyLoadData(this.allRows);
    this.initGrid();
  }

  rowSelection($event, id: number, item: any): void {
    if (!this.enableRowSelection) {
      return;
    }
    if (this.isSingleSelection) {
      this.selectedRows = [];
    }
    if (this.isExpanndCollapse) {
      this.isExpanndCollapse = false;
      return;
    }
    this.applyRowSelection($event);
    const checkCount: any = { count: 0 };
    item.selected = !item.selected;
    if (item.selected) {
      checkCount.count++;
    } else {
      checkCount.count--;
    }

    if (item.children !== undefined) {
      this.checkRowItem($event, item, checkCount);
    }
    this.gridRowClick.emit(this.selectedRows);
  }

  itemClick($event, id: any, item: any) {
    if (item.expand) {
      item.expand = false;
    } else {
      item.expand = true;
    }
    this.checkExpand(item, item.expand);
    const itemInfo = { expand: item.expand, item: item };
    this.gridExpandCollapseClick.emit(itemInfo);
  }
  private validateGridConfig() {
    if (this.tableOptions.columns) {
      this.gridProps.hasColumns = this.tableOptions.columns.length > 0;
    }
    if (this.tableOptions.data) {
      this.gridProps.hasData = this.tableOptions.data.length > 0;
    }
    if (this.tableOptions.icons) {
      this.tableIcons.sort =
        this.tableOptions.icons.sortIcon || this.tableIcons.sort;
      this.tableIcons.expand =
        this.tableOptions.icons.expandIcon || this.tableIcons.expand;
      this.tableIcons.collapse =
        this.tableOptions.icons.collapseIcon || this.tableIcons.collapse;
    }
    if (this.tableOptions.enableSort !== undefined) {
      this.enableSort = this.tableOptions.enableSort;
    }
    this.displaySpinner = this.tableOptions.showSpinner;
  }
  private preOrderTraverse(node, sortColumn: ColumnConfiguration) {
    if (node.children) {
      let sortBy = 0;
      let sortBy1 = 0;
      if (!sortColumn.order || sortColumn.order === 'asc') {
        sortColumn.order = 'desc';
        sortBy = -1;
        sortBy1 = 1;
      } else {
        sortColumn.order = 'asc';
        sortBy = 1;
        sortBy1 = -1;
      }
      node.children = node.children.sort((a, b) =>
        a[sortColumn.id] > b[sortColumn.id] ? sortBy : sortBy1
      );
      for (let nodeIndex = 0; nodeIndex < node.children.length; nodeIndex++) {
        this.preOrderTraverse(node.children[nodeIndex], sortColumn);
      }
    }
  }

  private initGrid() {
    // Set the tree object into table data object
    this.fTreeObjectFull.data = this.fullTreeData;
    // Set parent child hierarchy
    this.setParentDetails(this.fTreeObjectFull.data);
  }
  private setHeaderConfig() {
    const rootVisibleColumns = this.tableOptions.columns.filter(
      (x) => x.visible
    );
    this.visibleColumns = JSON.parse(JSON.stringify(rootVisibleColumns));
    this.fTreeObjectFull.header = rootVisibleColumns;
  }
  private setPartialData() {
    this.sortableData = this.tableOptions.data;
    if (this.tableOptions.isTreeStructure) {
      this.allRows = this.constructTreeObject(this.tableOptions.data);
    } else {
      this.allRows = this.tableOptions.data;
    }
    this.setLazyLoadData(this.allRows);
  }
  private setLazyLoadData(lazyData: any[]) {
    if (lazyData.length > 109) {
      this.lzPreviousSliceIndex = 100;
      const data = lazyData.slice(0, this.lzPreviousSliceIndex);
      this.fullTreeData = data;
    } else {
      this.fullTreeData = lazyData;
    }
  }

  private applyRowSelection($event) {
    if ($event.currentTarget.classList.length > 0) {
      const hasClass =
        $event.currentTarget.classList.value.indexOf(this.rowSelectClass) > -1;
      if (hasClass) {
        $event.currentTarget.classList.remove(this.rowSelectClass);
        return;
      }
    }

    $event.currentTarget.classList.add(this.rowSelectClass);
  }
  private childrenSelected($element, selected) {
    if (!$element.class) {
      return;
    }
    if ($element.class) {
      if (!selected) {
        const classData = this.replaceAll(
          $element.class.toString(),
          this.rowSelectClass,
          ''
        );
        $element.class = classData;
        this.selectedRows.splice(this.selectedRows.indexOf($element), 1);
        return;
      }
    }
    this.selectedRows.push($element);
    $element.class += ' ' + this.rowSelectClass;
  }

  private constructTreeObject(tree: Array<any>): Array<any> {
    for (let i = 0; i < tree.length; i++) {
      this.classDetails = '';
      this.setLevelDetails(tree[i], this.newObj, this.level, this.classDetails);
    }

    return this.newObj;
  }

  private checkExpand(item: any, isExpand: boolean): void {
    this.isExpanndCollapse = true;
    for (let i = 0; i < item.children.length; i++) {
      const o = item.children[i];
      if (!isExpand) {
        o.class = o.class + ' hide';
      } else {
        o.class = o.class.replace(/hide/g, ' ');
      }

      if ((o.children && !isExpand) || (o.children && o.expand)) {
        this.checkExpand(o, isExpand);
      }
    }
  }

  private constructChildTreeObject(
    obj: Array<any>,
    newObj: Array<any>,
    level: number
  ): void {
    for (let i = 0; i < obj.length; i++) {
      this.classDetails = 'hide';
      this.setLevelDetails(obj[i], newObj, level, this.classDetails);
    }
  }
  private setLevelDetails(
    item: any,
    newObj: Array<any>,
    level: number,
    classDetails: string
  ): void {
    if (item.isLast === undefined) {
      item.isLast = false;
    }
    item.$$treeLevel = level;
    if (item.selected === undefined) {
      item.selected = false;
    }
    if (item.children && item.children.length !== 0) {
      item.leaf = false;
      item.class = classDetails;
      newObj.push(item);
      this.constructChildTreeObject(
        item.children,
        newObj,
        item.$$treeLevel + 1
      );
    } else {
      item.leaf = true;
      item.class = classDetails;
      newObj.push(item);
    }
  }
  setParentDetails(newObj: Array<any>): void {
    for (let i = 0; i < newObj.length; i++) {
      if (newObj[i].children === undefined || newObj[i].children.length === 0) {
        continue;
      }
      for (let j = 0; j < newObj[i].children.length; j++) {
        newObj[i].children[j].parent = i;
      }
    }
  }

  private checkRowItem($event, item: any, checkCount: any): void {
    if (item.children === undefined) {
      return;
    }

    for (let i = 0; i < item.children.length; i++) {
      this.childrenSelected(item.children[i], item.selected);
      item.children[i].selected = item.selected;
      checkCount.count++;
      if (
        item.children[i].children !== undefined &&
        item.children[i].children.length > 0
      ) {
        this.checkRowItem($event, item.children[i], checkCount);
      }
    }
  }
  checkItem(item: any, checkCount: any): void {
    if (item.children === undefined) {
      return;
    }

    for (let i = 0; i < item.children.length; i++) {
      item.children[i].selected = item.selected;
      checkCount.count++;

      if (
        item.children[i].children !== undefined &&
        item.children[i].children.length > 0
      ) {
        this.checkItem(item.children[i], checkCount);
      }
    }
  }
  cellClick($event) {
    this.gridCellClick.emit($event);
  }
  onScroll($event) {
    const scrollDirection = $event.target.scrollTop;
    let scrollUp = false;
    if (scrollDirection < this.lastScrollTop) {
      scrollUp = true;
    } else {
      scrollUp = false;
    }
    this.lastScrollTop = scrollDirection;
    if (scrollUp) {
      return;
    }
    const allDataLoaded =
      this.fTreeObjectFull.data.length >= this.allRows.length;
    if (
      $event.target.offsetHeight + $event.target.scrollTop >=
        $event.target.scrollHeight ||
      !allDataLoaded
    ) {
      this.scrollLoadData();
    }
  }
  scrollLoadData() {
    let lazyLoadData = [];
    if (this.fTreeObjectFull.data.length >= this.allRows.length) {
      return;
    }
    this.lzPreviousSliceIndex = this.fTreeObjectFull.data.length;
    let sliceIndex = this.allRows.length > 100 ? 100 : this.allRows.length;
    sliceIndex = this.lzPreviousSliceIndex + sliceIndex;
    lazyLoadData = this.allRows.slice(this.lzPreviousSliceIndex, sliceIndex);
    this.fTreeObjectFull.data = this.mergeArrayOfObjects(
      this.fTreeObjectFull.data,
      lazyLoadData
    );
  }
  private mergeArrayOfObjects = (original, newdata) => {
    newdata.forEach((dat) => {
      original.push(dat);
    });

    return original;
  };
  private escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  private replaceAll(str, term, replacement) {
    return str.replace(new RegExp(this.escapeRegExp(term), 'g'), replacement);
  }
  private get enableRowSelection() {
    return this.tableOptions.enableRowSelection
      ? this.tableOptions.enableRowSelection
      : false;
  }
  private get isSingleSelection() {
    return this.tableOptions.rowSelection
      ? this.tableOptions.rowSelection.toLowerCase() === 'single'
      : false;
  }
}
