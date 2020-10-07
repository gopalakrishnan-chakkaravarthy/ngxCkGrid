# NGXCkGrid

A resposive grid with lazy load feature to draw hierarchical data/tree data structure.

The grid is developed to solve real world problem to bind tree data structure.Also the grid is purely angular based .

## Installation

Install with npm:

> npm install ngx-ck-grid

Import the ngx-ck-grid module to your application module:

```
import { NGXCkGridModule } from 'ngx-ck-grid';

@NgModule({

declarations: [...],

imports: [NGXCkGridModule,...],

bootstrap: [AppComponent]

})

export class AppModule { }

```

## Usage

```
  <ngx-ck-grid
    [tableOptions]="tableOptions"
    (gridRowSelection)="gridRowSelection($event)"
  ></ngx-ck-grid>

```

## Configuration

To bind data and columns to grid use **TableConfiguration** class to define properties ,columns and data.

### Properties

| Name                |      Datatype       |                                                        Description |
| ------------------- | :-----------------: | -----------------------------------------------------------------: |
| id                  |       string        |                                          sets unique id for a grid |
| data                |    Object Array     |                            An array of objects with key and values |
| columns             | ColumnConfiguration |  Use **ColumnConfiguration** interface to define column properties |
| rowSelection        |       string        |                                                 single or multiple |
| enableColumnChooser |       boolean       |                 Use **true** or **false** to enable column chooser |
| enableSort          |       boolean       |                        Use **true** or **false** to enable sorting |
| enableFixedHeader   |       boolean       |                      Use **true** or **false** to set fixed header |
| showSpinner         |       boolean       | Use **true** or **false** to enable sppinner on scroll/sort/filter |
| enableColumnFilters |       boolean       |                 Use **true** or **false** to enable column filters |
| isTreeStructure     |       boolean       |                 Use **true** or **false** to define tree structure |
| enableContextMenu   |       boolean       |              Use **true** or **false** to enable grid context menu |
| contextMenuItems    | ContextMenuItems[]  |        Use **ContextMenuItems[]** interfac to define context menus |
| icons               |      TableIcon      |            Use **TableIcon** interfac to define icons for the grid |

### Events

| Name                    |             Description              |
| ----------------------- | :----------------------------------: |
| gridRowClick            |         Fiered on row click          |
| gridCellClick           |         Fiered on cell click         |
| gridExpandCollapseClick | Fiered on Exapnd/Collapse icon click |
| gridContextMenuClick    |  Fiered on grid context menu click   |

# Demo

Demo available at below git hub repository.

This project was generated with [ngxCKGridDemo](https://github.com/gopalakrishnan-chakkaravarthy/ngxCkGridDemo.git).
