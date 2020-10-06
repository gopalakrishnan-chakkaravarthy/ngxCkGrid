import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'searchFilter'
})
export class FilterPipe implements PipeTransform {
  public transform(value: any[], searchText: string, filterColumn?: string): any[] {
    if (!searchText || searchText.length <= 3) {
      return value;
    }
    const allRowValues: any[] = [];
    this.processAllRows(value, allRowValues);
    const filteredResult = (value || []).filter(item => {
      const textValue = filterColumn ? item[filterColumn] : item;
      if (!textValue) {
        return false;
      }
      return textValue.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
    });
    return filteredResult && filteredResult.length > 0 ? filteredResult : [];
  }

  private processAllRows(value: any, allRowValues: any): void {
    for (let i = 0; i < value.length; i++) {
      const rowItem = value[i];
      const keys = Object.keys(rowItem);
      const rowArray: any[] = [];
      this.processChildRows(rowArray, [rowItem]);
      allRowValues.push(rowArray);
    }
  }

  private processChildRows(rowArray: any[], rowItem: any) {
    for (let k = 0; k < rowItem.length; k++) {
      const row = rowItem[k];
      const keys = Object.keys(row);
      for (let i = 0; i < keys.length; i++) {
        if (typeof row[keys[i]] === 'object') {
          this.processChildRows(rowArray, row[keys[i]]);
        } else {
          rowArray.push(row[keys[i]]);
        }
      }
    }
  }
}
