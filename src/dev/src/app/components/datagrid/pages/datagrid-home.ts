import * as jsBeautify from 'js-beautify';

import { Component } from '@angular/core';

@Component({
  selector: 'datagrid-demo-home',
  template: `
    <div class="container-fluid">
      <div class="row" style="max-width: 1200px">
        <div class="col-12">
          <h2 id="datagrid-overview">Overview</h2>

          <p>
            In this article, we will walk you through the necessary steps to add FerUI datagrid to an existing Angular project,
            and configure some of the essential features of it. We will show you some of the fundamentals of the grid (passing
            properties, using the API, etc).
          </p>

          <h3>Add a Datagrid to Your Project</h3>

          <p>
            Since the datagrid component is part of <code>@ferui-components</code> you just need to add FerUI to your project main
            module then you'll be able to use the component as a regular Angular component.
          </p>

          <pre><code [languages]="['typescript']" [highlight]="datagridCode"></code></pre>

          <p>Now that you have added FerUI to your project, you can start using the datagrid component.</p>

          <p>To create all the columns, and let the magic happens, you need to create an object of columns definitions</p>

          <pre><code [languages]="['typescript']" [highlight]="columnDefinitionInterface"></code></pre>

          <p>Example:</p>

          <pre><code [languages]="['typescript']" [highlight]="datagridColumnsCode"></code></pre>

          <p>
            The code above presents two essential configuration properties of the grid - the column definitions
            (<code>columnDefs</code>) and the data (<code>rowData</code>). In our case, the column definitions contain 18 columns;
            each column entry specifies at least the header label and the data field to be displayed in the body of the table.
          </p>

          <p>Finally, let's add the component definition to our template :</p>

          <pre><code [languages]="['html']" [highlight]="datagridTemplateCode"></code></pre>

          <p>
            This is the datagrid component definition, with two property bindings - <code>rowData</code> and
            <code>columnDefs</code>. The component also accepts the standard DOM style and class.
          </p>

          <p>If everything works as expected, you should see a simple grid like the one on the screenshot:</p>

          <img src="./assets/datagrid/datagrid-default.png" width="1024" height="448" />

          <h2 id="datagrid-sorting-filtering" class="mt-4">Enable Sorting And Filtering</h2>

          <p>
            So far, so good. But maybe you've noticed some curious parameters within the columnDefs below.<br />
            As you can expect, you can control which columns are sortable and which aren't, but that's not it: Yous can also
            activate multiple sorting an even use your own custom sorting framework. <br />
            The <code>sort</code> property control the initial sorting (it should be a
            <code>FuiDatagridSortDirections</code> instance value). <br />
            The <code>sortable</code> property (which is a boolean) control whether the column can be sorted or not. <br />
            The <code>sortType</code> property (which is an instance of <code>FuiFieldTypes</code>) control the data type for this
            columns. It can be either STRING, DATE or NUMBER. <br />
            The <code>sortComparator</code> property allow the devs to use their own sortingComparator to override the default
            ones. The comparator should implement the <code>FuiDatagridComparator</code> interface to work. <br />
            The <code>sortOrder</code> property control which column sorting priority upon another.
            <span class="font-weight-bold">Lower is the value, higher is the priority.</span>
          </p>

          <pre><code [languages]="['typescript']" [highlight]="datagridSortCode"></code></pre>

          <p>
            After adding the property, you should be able to sort the grid by clicking on the column headers. Clicking on a header
            toggles through ascending, descending and no-sort. You can also do multi-sorting by pressing the
            <kbd>shift</kbd> key and clicking on another column header.
          </p>

          <p>As with sorting, enabling filtering is as easy as setting the filter property:</p>

          <pre><code [languages]="['typescript']" [highlight]="datagridFilterCode"></code></pre>

          <p>
            With this property set, the grid will display the Global Search + Filters combo. Pressing it will display a popup with
            filtering UI which lets you choose the kind of filter and the text that you want to filter by.
          </p>

          <img src="./assets/datagrid/datagrid-filters-ui.png" width="1024" height="520" />

          <p>
            <span class="font-weight-bold">Note:</span> By default, FerUI datagrid has 6 filter types:
            <b>Text, Number, Date, Boolean, Custom</b> and <b>Global search filter</b> types. If it's not specified, the filter
            type used by default is the <b>Text</b> filter.
          </p>

          <p>If you want to use a specific custom filter you've made, you can just specify it in the step before :</p>

          <pre><code [languages]="['typescript']" [highlight]="datagridCustomFilterCode"></code></pre>

          <p>
            The <code>filterFramework</code> represent how the filter will looks within the filters popup. You can create your own
            template and you just need to create a new Angular component that extend
            <code>FuiDatagridBaseFilter&lt;IBrowserFilterParams&gt;</code>.
          </p>

          <pre><code [languages]="['typescript']" [highlight]="datagridCustomFilterFrameworkCode"></code></pre>

          <h2 id="datagrid-default-col-def" class="mt-4">Default column definition</h2>

          <p>
            In some cases, you may want to have a default column definition object that all your datagrids can use as default.
            It's pretty simple, you just need to create a column definition object that implement the FuiColumnDefinitions
            interface.
          </p>

          <pre><code [languages]="['typescript']" [highlight]="datagridDefaultColumnDefCode"></code></pre>

          <p>Please note that the default column definition will be applied to EVERY columns in your grid.</p>

          <p>Then, on your template, you'll need to add this default column def to the datagrid:</p>

          <pre><code [languages]="['html']" [highlight]="datagridDefaultColumnDefTpltCode"></code></pre>

          <h2 id="datagrid-action-menu" class="mt-4">Datagrid Action-Menu</h2>

          <p>
            You might need to add an action-menu for each rows of your datagrid. This is possible, thanks to
            <code>FuiDatagridActionMenu</code>. It is fairly easy to use, you just need to create the action menu template :
          </p>

          <pre><code [languages]="['html']" [highlight]="datagridActionMenuCode"></code></pre>

          <p>Then pass it to the datagrid :</p>

          <pre><code [languages]="['html']" [highlight]="datagridActionMenuTagCode"></code></pre>

          <p>
            <u>NOTE:</u> The template for action-menu can be anything you want, from a simple link to a complex dropdown (it works
            perfectly with <a href="/#/components/dropdown/overview"><code>FuiDropdownComponent</code></a
            >). It is up-to you to decide. But keep in mind that the template will always use the
            <code>FuiDatagridBodyRowContext</code> context which contain the data of the hovered row to allow you to do whatever
            you want.
          </p>

          <pre><code [languages]="['typescript']" [highlight]="datagridActionMenuContextCode"></code></pre>

          <h2 id="datagrid-row-selection" class="mt-4">Row selection</h2>

          <p>Select a row by clicking on it. Selecting a row will remove any previous selection.</p>

          <p>Configure row selection with the following properties:</p>

          <ul>
            <li>
              <code>rowSelection</code>: Type of row selection, set to either <code>'single'</code> or <code>'multiple'</code> to
              enable selection. <code>'single'</code> will use single row selection, such that when you select a row, any
              previously selected row gets unselected. <code>'multiple'</code> allows multiple rows to be selected at the same
              time.
            </li>
            <li>
              <code>rowMultiSelectWithClick</code>: Set to <code>true</code> to allow multiple rows to be selected with clicks.
              For example, if you click to select one row and then click to select another row, the first row will stay selected
              as well. Clicking a selected row in this mode will deselect the row. This is useful for touch devices.
            </li>
            <li>
              <code>suppressRowClickSelection</code>: If <code>true</code>, rows won't be selected when clicked. Use, for example,
              when you want checkbox selection, and don't want to also select the row when the row is clicked.
            </li>
          </ul>

          <p>Here is the rowSelectionEnum interface:</p>
          <pre><code [languages]="['typescript']" [highlight]="datagridrowSelectionEnumCode"></code></pre>

          <p>
            When you pass data to the grid, it wraps each data item in a node object. This is explained in the section Client-Side
            Row Model. When you query for the selected rows, there are two method types: ones that return nodes, and ones that
            return data items. To get the selected nodes / rows from the grid, use the following API methods:
          </p>

          <ul>
            <li><code>datagrid.getSelectedNodes()</code>: Returns an array of the selected nodes.</li>
            <li><code>datagrid.getSelectedRows()</code>: Returns an array of data from the selected rows.</li>
          </ul>

          <h4 class="mt-4">Checkbox selection</h4>

          <p>
            To include checkbox selection, just set the attribute <code>'checkboxSelection'</code> to <code>true</code>
            on datagrid definition. It will automatically add a new column on the left of the grid.
          </p>

          <p>
            It is possible to have a checkbox in the header for selection. To configure the column to have a checkbox, set
            <code>headerSelect</code> to <code>true</code> on datagrid definition.
          </p>

          <p>
            The header select will also contains a dropdown containing all possible actions. By default for
            <code>ClientSideRowModel</code> we can select or deselect everything but for <code>ServerSideRowModel</code> and
            <code>InfiniteRowModel</code> we can only select the loaded rows or deselect everything.
          </p>

          <h4 class="mt-4">Specify Selectable Rows</h4>

          <p>
            It is possible to specify which rows can be selected via the <code>isRowSelectable(rowNode)</code>
            callback function. This function will be called internally and the RowNode will be passed as attribute.
          </p>

          <p>
            For instance if we only wanted to allow rows where the 'year' property is less than 2007, we could implement the
            following:
          </p>
          <p>In your component you can create the function</p>
          <pre><code [languages]="['typescript']" [highlight]="datagridSpecifyRowsCode"></code></pre>
          <p>Then pass it to the datagrid</p>
          <pre><code [languages]="['html']" [highlight]="datagridSpecifyRowsHtmlCode"></code></pre>

          <h4 class="mt-4">Providing Node IDs</h4>

          <p>
            Providing node IDs is optional. If you provide your own node IDs (using the <code>getRowNodeId()</code> callback) then
            you must make sure that the rows have unique IDs across your entire data set. This means all nodes must have unique
            IDs. This is because the grid uses node IDs internally and requires them to be unique.
          </p>

          <h2 id="datagrid-api" class="mt-4">Datagrid API</h2>

          <p>There is the list of all <code>fui-datagrid</code> attributes and what they do.</p>

          <table class="fui-table">
            <thead>
              <tr>
                <th width="200">Property</th>
                <th width="295">Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>[withHeader]</code></td>
                <td>boolean</td>
                <td>Whether or not you want to display the whole datagrid header.</td>
              </tr>
              <tr>
                <td><code>[withFooter]</code></td>
                <td>boolean</td>
                <td>Whether or not you want to display the whole datagrid footer.</td>
              </tr>
              <tr>
                <td><code>[withFooterItemPerPage]</code></td>
                <td>boolean</td>
                <td>Whether or not you want to display the item per page selector in the footer.</td>
              </tr>
              <tr>
                <td><code>[withFooterPager]</code></td>
                <td>boolean</td>
                <td>Whether or not you want to display the pager in the footer.</td>
              </tr>
              <tr>
                <td><code>[fixedHeight]</code></td>
                <td>boolean</td>
                <td>
                  Whether or not you want to use a fixed height for the datagrid. The height will always be fixed by the item per
                  page selector.<br />
                  i.e : If you want to display 10 items per page, the grid will always be big enough to accept 10 items even if
                  you only get 2 items.
                </td>
              </tr>
              <tr>
                <td><code>[actionMenuTemplate]</code></td>
                <td>TemplateRef&lt;FuiDatagridBodyRowContext&gt;</td>
                <td>Allow you to use a custom template to display the action menu.</td>
              </tr>
              <tr>
                <td><code>[columnDefs]</code></td>
                <td>FuiColumnDefinitions[]</td>
                <td>The column definitions of your datagrid.</td>
              </tr>
              <tr>
                <td><code>[defaultColDefs]</code></td>
                <td>FuiColumnDefinitions</td>
                <td>The default column definition used for each columns as default value.</td>
              </tr>
              <tr>
                <td><code>[headerHeight]</code></td>
                <td>number</td>
                <td>The height of each header cells</td>
              </tr>
              <tr>
                <td><code>[rowHeight]</code></td>
                <td>number</td>
                <td>The height of each row cells</td>
              </tr>
              <tr>
                <td><code>[datasource]</code></td>
                <td>IServerSideDatasource</td>
                <td>
                  Used only for <code>server-side</code> or <code>infinte</code> row models. Refer to the
                  <a [routerLink]="['/components/datagrid/server-side']">respective docs</a> to understand how it works.
                </td>
              </tr>
              <tr>
                <td><code>[trackByFn]</code></td>
                <td>TrackByFunction&lt;any&gt;</td>
                <td>
                  By default, all columns and row are controled by an <code>*ngFor</code> loop, and by default we are trying to
                  track the entities by either <code>id</code>, <code>uuid</code> or by object identity.
                </td>
              </tr>
              <tr>
                <td><code>[vsBufferAmount]</code></td>
                <td>number</td>
                <td>
                  How many extra row should we store in the DOM. Because of virtual scroller, we can load only the needed number
                  of row that would be visible on screen or we can also load an extra amount for visual performance.
                </td>
              </tr>
              <tr>
                <td><code>[rowDataModel]</code></td>
                <td>FuiRowModel</td>
                <td>
                  Represents the row model used to render and load the datagrid. <br />
                  It can be : <code>CLIENT_SIDE</code> | <code>SERVER_SIDE</code> | <code>INFINITE</code>.
                </td>
              </tr>
              <tr>
                <td><code>[maxDisplayedRows]</code></td>
                <td>number</td>
                <td>
                  The number of rows to display within the grid. It will be possible to also change this value through the item
                  per page selector directly.
                </td>
              </tr>
              <tr>
                <td><code>[id]</code></td>
                <td>string</td>
                <td>
                  If you want to set an ID for you datagrid. THis is optional because by default the component will automatically
                  generate an ID.
                </td>
              </tr>
              <tr>
                <td><code>[gridHeight]</code></td>
                <td>number</td>
                <td>
                  The initial grid Height. This will be override by the <code>fixedHeight</code> and
                  <code>maxDisplayedRows</code> properties.
                </td>
              </tr>
              <tr>
                <td><code>[gridWidth]</code></td>
                <td>number</td>
                <td>The grid width.</td>
              </tr>
              <tr>
                <td><code>[rowData]</code></td>
                <td>Array&lt;Object&gt;</td>
                <td>
                  Only usable when you're using the default Row model (<code>CLIENT_SIDE</code>). It will contains the data to
                  display within the grid.
                </td>
              </tr>
              <tr>
                <td><code>[rowSelection]</code></td>
                <td>FuiRowSelectionEnum</td>
                <td>
                  If you want to enable the row selection feature, set to either <code>'single'</code> or
                  <code>'multiple'</code> to enable selection. <code>'single'</code> will use single row selection, such that when
                  you select a row, any previously selected row gets unselected. <code>'multiple'</code> allows multiple rows to
                  be selected at the same time.
                </td>
              </tr>

              <tr>
                <td><code>[rowMultiSelectWithClick]</code></td>
                <td>boolean</td>
                <td>
                  Set to <code>true</code> to allow multiple rows to be selected with clicks. For example, if you click to select
                  one row and then click to select another row, the first row will stay selected as well. Clicking a selected row
                  in this mode will deselect the row. This is useful for touch devices.
                </td>
              </tr>
              <tr>
                <td><code>[suppressRowClickSelection]</code></td>
                <td>boolean</td>
                <td>
                  If <code>true</code>, rows won't be selected when clicked. Use, for example, when you want checkbox selection,
                  and don't want to also select the row when the row is clicked.
                </td>
              </tr>
              <tr>
                <td><code>[checkboxSelection]</code></td>
                <td>boolean</td>
                <td>If <code>true</code>, each rows will have their own checkox for selection.</td>
              </tr>
              <tr>
                <td><code>[headerSelect]</code></td>
                <td>boolean</td>
                <td>If <code>true</code>, the 'select all' checkbox will appear in the selection column.</td>
              </tr>
              <tr>
                <td><code>[isRowSelectable]</code></td>
                <td>function</td>
                <td>
                  Whether we want to enable row selection for the specified row or not. This function will be called internally
                  and the RowNode will be passed as attribute.
                </td>
              </tr>
              <tr>
                <td><code>[getRowNodeId]</code></td>
                <td>function</td>
                <td>
                  Providing node IDs is optional. If you provide your own node IDs (using the
                  <code>getRowNodeId()</code> callback) then you must make sure that the rows have unique IDs across your entire
                  data set. This means all nodes must have unique IDs. This is because the grid uses node IDs internally and
                  requires them to be unique.
                </td>
              </tr>
            </tbody>
          </table>

          <h2 id="datagrid-api" class="mt-4">Datagrid Outputs</h2>

          <p>There is the list of all <code>fui-datagrid</code> attributes and what they do.</p>

          <table class="fui-table">
            <thead>
              <tr>
                <th width="200">Property</th>
                <th width="295">Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>(onDatagridResized)</code></td>
                <td><code>EventEmitter&lt;DatagridOnResizeEvent&gt;</code></td>
                <td>
                  Each time the datagrid size (width and/or height) is updated, we're triggering this event.<br />
                  NOTE: Be careful when using this event when resizing the window, it will be triggered multiple times.<br />
                  <pre><code [languages]="['typescript']"  [highlight]="datagridOnResizeEventCode"></code></pre>
                </td>
              </tr>
              <tr>
                <td><code>(onColumnWidthChange)</code></td>
                <td><code>EventEmitter&lt;ColumnEvent&gt;</code></td>
                <td>
                  Each time one or multiple columns width are updated, we're triggering this event.<br />
                  <pre><code [languages]="['typescript']"  [highlight]="columnEventCode"></code></pre>
                </td>
              </tr>
              <tr>
                <td><code>(onColumnResized)</code></td>
                <td><code>EventEmitter&lt;ColumnResizedEvent&gt;</code></td>
                <td>
                  Similar to <code>(onColumnWidthChange)</code> but it is called only if the user is manually resizing one
                  column.<br />
                  <pre><code [languages]="['typescript']"  [highlight]="columnResizedEventCode"></code></pre>
                </td>
              </tr>
              <tr>
                <td><code>(onColumnVisibilityChanged)</code></td>
                <td><code>EventEmitter&lt;ColumnVisibleEvent&gt;</code></td>
                <td>
                  Each time the user is updating the column visibility (display or hide a column) we're triggering this event.
                  <pre><code [languages]="['typescript']"  [highlight]="columnVisibleEventCode"></code></pre>
                </td>
              </tr>
              <tr>
                <td><code>(onRowClicked)</code></td>
                <td><code>EventEmitter&lt;RowClickedEvent&gt;</code></td>
                <td>
                  Each time the user click on a row we're triggering this event.
                  <pre><code [languages]="['typescript']" [highlight]="rowClickedEventCode"></code></pre>
                </td>
              </tr>
              <tr>
                <td><code>(onRowDoubleClicked)</code></td>
                <td><code>EventEmitter&lt;RowDoubleClickedEvent&gt;</code></td>
                <td>
                  Same as <code>(onRowClicked)</code> except that is is triggered only if the user double click on the row.
                  <pre><code [languages]="['typescript']"  [highlight]="rowDoubleClickedEventCode"></code></pre>
                </td>
              </tr>
              <tr>
                <td><code>(onCellClicked)</code></td>
                <td><code>EventEmitter&lt;CellClickedEvent&gt;</code></td>
                <td>
                  Each time the user click on a cell we're triggering this event.<br />
                  NOTE: The <code>(onRowClicked)</code> event will also be triggered when clicking on a cell.
                  <pre><code [languages]="['typescript']"  [highlight]="cellClickedEventCode"></code></pre>
                </td>
              </tr>
              <tr>
                <td><code>(onCellDoubleClicked)</code></td>
                <td><code>EventEmitter&lt;CellDoubleClickedEvent&gt;</code></td>
                <td>
                  Same as <code>(onCellClicked)</code> except that is triggered only is the user double click on the cell.<br />
                  NOTE: The <code>(onRowDoubleClicked)</code> event will also be triggered when double clicking on a cell.
                  <pre><code [languages]="['typescript']"  [highlight]="cellDoubleClickedEventCode"></code></pre>
                </td>
              </tr>
              <tr>
                <td><code>(onCellContextmenu)</code></td>
                <td><code>EventEmitter&lt;CellContextMenuEvent&gt;</code></td>
                <td>
                  Each time a user right click on a cell, this event is triggered. It is up to the developper to override the
                  context menu completely by preventing the <code>event</code> to be called. The dev would be able to customize
                  and bind whatever external context menu plugin. All information about the current cell and the row will be
                  shared through this event.<br />
                  <pre><code [languages]="['typescript']"  [highlight]="cellContextMenuEventCode"></code></pre>
                </td>
              </tr>
              <tr>
                <td><code>(onRowSelected)</code></td>
                <td><code>EventEmitter&lt;RowSelectedEvent&gt;</code></td>
                <td>
                  Each time a user select a row, the event is triggered.<br />
                  <pre><code [languages]="['typescript']"  [highlight]="rowSelectedEventCode"></code></pre>
                </td>
              </tr>
              <tr>
                <td><code>(onSelectionChanged)</code></td>
                <td><code>EventEmitter&lt;SelectionChangedEvent&gt;</code></td>
                <td>
                  Each time a user select a row or select all rows from the header select option, the event is triggered.<br />
                  <pre><code [languages]="['typescript']"  [highlight]="selectionChangedEventCode"></code></pre>
                </td>
              </tr>
              <tr>
                <td><code>(onItemPerPageChanged)</code></td>
                <td><code>EventEmitter&lt;number&gt;</code></td>
                <td>
                  Each time a user update the item per page, this event is triggered with the new selected amount of items
                  displayed in the Datagrid.
                </td>
              </tr>
            </tbody>
          </table>
          <br />
        </div>
      </div>
    </div>
  `
})
export class DatagridHomeComponent {
  columnDefinitionInterface: string = `  import { TemplateRef } from '@angular/core';
  import { FuiDatagridSortDirections } from './sort-directions.enum';
  import { FuiDatagridComparator } from './comparator';
  import { FuiFieldTypes } from './field-types.enum';
  import { FilterType } from '../components/filters/interfaces/filter.enum';
  import { FuiDatagridBaseFilter } from '../components/filters/filter/base-filter';
  import { IFilterParams } from '../components/filters/interfaces/filter';

  export interface FuiColumnDefinitions {
    //The unique ID to give the column. This is optional.
    // If missing, the ID will default to the field.
    // If both field and colId are missing, a unique ID will be generated.
    // This ID is used to identify the column in the API for sorting, filtering etc.
    colId?: string;

    // The name to render in the column header. If not specified and field is specified, the field name would be used as the header name.
    headerName?: string;

    // The field of the row to get the cells data from
    field?: string;

    // Class to use for the header cell. Can be string, array of strings, or function.
    headerClass?: Array<string> | string;

    // A comma separated string or array of strings containing ColumnType keys which can be used as a template for a column.
    // This helps to reduce duplication of properties when you have a lot of common column properties.
    type?: Array<string> | string;

    // Set to true for this column to be hidden.
    // Naturally you might think, it would make more sense to call this field 'visible' and mark it false to hide,
    // however we want all default values to be false and we want columns to be visible by default.
    hide?: boolean;

    // Set to true to allow sorting on this column.
    sortable?: boolean;

    // If sorting by default, set it here. Set to 'asc',  'desc' or 'none'
    sort?: FuiDatagridSortDirections;

    // If the default comparator is not enough, you can use your own comparator.
    sortComparator?: FuiDatagridComparator;

    // The type of data for the field. It can be a string, number or Date.
    sortType?: FuiFieldTypes;

    sortOrder?: number;

    // Set to true to allow column to be resized.
    resizable?: boolean;

    // Boolean or Function. Set to true (or return true from function) to render a selection checkbox in the column.
    checkboxSelection?: boolean;

    // Class to use for the cell. Can be string, array of strings, or function.
    cellClass?: Array<string> | string;

    // Boolean or Function. Set to true (or return true from function) to render a row drag area in the column.
    rowDrag?: boolean;

    // cellRenderer to use for this column.
    cellRenderer?: TemplateRef<any>;

    // Tooltip for the column header
    headerTooltip?: any;

    // The field of the tooltip to apply to the cell.
    tooltipField?: string;

    suppressSizeToFit?: boolean;

    // A callback that takes (value, valueFormatted, data, node , colDef, rowIndex and api) It must return the string used as a tooltip. tooltipField takes precedence.
    tooltip?: (
      value: any,
      valueFormatted: string,
      data: any,
      colDef: FuiColumnDefinitions,
      rowIndex: number,
      api: any
    ) => string;

    // Initial width, min width and max width for the cell. Always stated in pixels (never percentage values).
    width?: number;
    minWidth?: number;
    maxWidth?: number;

    // Set to true to make sure this column is always first. Other columns, if movable, cannot move before this column.
    lockPosition?: boolean;

    // Set to true to block the user showing / hiding the column, the column can only be shown / hidden via definitions or API
    lockVisible?: boolean;

    // one of the built in filter names: [date, number, text], or a boolean
    filter?: FilterType | boolean;

    filterFramework?: TemplateRef<FuiDatagridBaseFilter<IFilterParams>>;

    /** The filter params are specific to each filter! */
    filterParams?: IFilterParams;
  }
  `;

  datagridCode: string = `  // app.module.ts
  import { AppComponent } from './app.component';
  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { FeruiModule } from '@ferui/components';

  @NgModule({
    imports: [
      CommonModule,
      FormsModule,
      FeruiModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
  })
  export class AppModule {}`;
  datagridColumnsCode: string = ` ...
  ngOnInit(): void {
    this.columnDefs = [
      { headerName: 'Username', field: 'username', minWidth: 150, sortOrder: 1, sort: FuiDatagridSortDirections.ASC },
      { headerName: 'Creation date',
        field: 'creation_date',
        minWidth: 150,
        sortOrder: 0,
        sortType: FuiFieldTypes.DATE,
        sort: FuiDatagridSortDirections.DESC,
        filter: FilterType.DATE,
        filterParams: dateFilterParams,
      },
      { headerName: 'Gender', field: 'gender' },
      { headerName: 'First name', field: 'first_name' },
      { headerName: 'Last name', field: 'last_name' },
      { headerName: 'Age', field: 'age', filter: FilterType.NUMBER },
      { headerName: 'Eye color', field: 'eye_color' },
      { headerName: 'Company', field: 'company' },
      { headerName: 'Address', field: 'address', minWidth: 200 },
      { headerName: 'Country', field: 'country' },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Phone', field: 'phone', minWidth: 200 },
      { headerName: 'Ip-address', field: 'ip_address', minWidth: 200 },
      { headerName: 'Active ?', field: 'is_active', filter: FilterType.BOOLEAN },
      { headerName: 'Registered ?', field: 'is_registered', filter: FilterType.BOOLEAN },
      { headerName: 'Favourite animal', field: 'favourite_animal', minWidth: 150 },
      { headerName: 'Favorite movie', field: 'favorite_movie', minWidth: 200 },
      {
        headerName: 'Browser',
        field: 'browser',
        cellRenderer: this.userAgentRenderer,
        sortable: false,
        filter: FilterType.CUSTOM,
        filterFramework: this.browserFilter,
      },
    ];
    ...
    this.http.get('/datagrid-10k-data.min.json').subscribe((results: Array<any>) => {
      this.rowData = results;
    });
  }
  ...`;
  datagridTemplateCode: string = `  ...
  <fui-datagrid #datagrid
    [columnDefs]="columnDefs"
    [rowData]="rowData">
  </fui-datagrid>
  ...`;
  datagridSortCode: string = `  ...
  columnDefs = [
    { headerName: 'Username', field: 'username', sortable: true, sortOrder: 1, sort: FuiDatagridSortDirections.ASC },
    { headerName: 'Creation date', field: 'creation_date', sortable: true, sortOrder: 0, sort: FuiDatagridSortDirections.DESC, sortType: FuiFieldTypes.DATE, },
    { headerName: 'Phone', field: 'phone', sortable: false },
  ];
  `;
  datagridFilterCode: string = `  ...
  columnDefs = [
    { headerName: 'Username', field: 'username', sortable: true, sortOrder: 1, sort: FuiDatagridSortDirections.ASC },
    {
      headerName: 'Creation date',
      field: 'creation_date',
      sortable: true,
      sortOrder: 0,
      sort: FuiDatagridSortDirections.DESC,
      sortType: FuiFieldTypes.DATE,
      filter: FilterType.DATE,
      filterParams: dateFilterParams
    },
    { headerName: 'Phone', field: 'phone', sortable: false },
    { headerName: 'Active ?', field: 'is_active', filter: FilterType.BOOLEAN },
  ];`;
  datagridCustomFilterCode: string = `  // app.component.ts
  ...
  @ViewChild('browserFilter') browserFilter: TemplateRef<any>;
  ...
  columnDefs = [
    {
      headerName: 'Browser',
      field: 'browser',
      cellRenderer: this.userAgentRenderer,
      sortable: false,
      filter: FilterType.CUSTOM,
      filterFramework: this.browserFilter,
    },
  ];
  `;
  datagridCustomFilterFrameworkCode: string = `
  import { Component, Input, OnInit } from '@angular/core';
  import {
    FuiDatagridBaseFilter,
    Column,
    IDoesFilterPassParams,
    IComparableFilterParams,
  } from '@ferui/components';
  import { DatagridService } from './datagrid.service';

  export interface IBrowserFilterParams extends IComparableFilterParams {}

  @Component({
    selector: 'fui-datagrid-browser-filter',
    template: \`
      <div class="container-fluid">
        <div class="row">
          <div class="col-3 fui-dg-filters-column-name" unselectable="on">
            {{ getColumnName() }}
          </div>
          <div class="col-9">
            <div class="container-fluid">
              <div class="row">
                <div class="col-4" *ngFor="let browser of possibleValues">
                  <fui-checkbox-wrapper>
                    <input
                      type="checkbox"
                      fuiCheckbox
                      (ngModelChange)="onChange($event, browser)"
                      [(ngModel)]="modelValues[browser]"
                    />
                    <label [title]="browser" [innerHTML]="datagridService.getIconFor(browser) | fuiSafeHtml"></label>
                  </fui-checkbox-wrapper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    \`,
    host: {
      class: 'fui-datagrid-browser-filter',
    },
    styles: [
      \`
        .fui-checkbox-wrapper {
          height: auto;
        }
      \`,
    ],
  })
  export class CustomBrowserFilterComponent extends FuiDatagridBaseFilter<IBrowserFilterParams> implements OnInit {
    @Input() filterParams: IBrowserFilterParams;
    @Input() column: Column;

    possibleValues: string[] = [];
    modelValues = {};

    constructor(public datagridService: DatagridService) {
      super();
    }

    doesFilterPass(params: IDoesFilterPassParams): boolean {
      if (!params.data) {
        return false;
      }
      return this.modelValues[params.data.toLowerCase()] === true;
    }

    getFilterOption(): string {
      return null;
    }

    getFilterValue(): any {
      return this.modelValues;
    }

    ngOnInit(): void {
      super.ngOnInit();
      this.possibleValues = this.datagridService.getAvailableBrowsers();
      this.possibleValues.forEach(value => {
        const filter = this.getFilterService()
          ? this.getFilterService().activeFilters.find(aFilter => {
              return aFilter.index === this.column.getColId();
            })
          : null;
        this.modelValues[value] = filter ? (filter.filter as CustomBrowserFilterComponent).modelValues[value] : null;
      });
    }

    onChange(value, browser) {
      let hasFilterModels: boolean = false;
      if (this.modelValues[browser] !== value) {
        this.modelValues[browser] = value;
      }
      for (const mValueIndex in this.modelValues) {
        if (this.modelValues.hasOwnProperty(mValueIndex)) {
          const modelValue = this.modelValues[mValueIndex];
          if (modelValue === true) {
            hasFilterModels = true;
          }
        }
      }
      this.addOrRemoveFilter(hasFilterModels, this);
    }
  }
  `;
  datagridDefaultColumnDefCode: string = `  ...
    const defaultColumnDefs: FuiColumnDefinitions = {
      sortable: true,
      filter: true,
    };
  `;
  datagridDefaultColumnDefTpltCode: string = `  ...
  <fui-datagrid
    #datagrid
    [defaultColDefs]="defaultColumnDefs"
    [columnDefs]="columnDefs"
    [rowData]="rowData">
  </fui-datagrid>
  `;

  datagridOnResizeEventCode: string = jsBeautify.js(`
  interface DatagridOnResizeEvent {
  width: number; // Value in px of the current datagrid width
  height: number; // Value in px of the current datagrid height
}`);

  columnEventCode: string = jsBeautify.js(`
  interface ColumnEvent {
  type: string;
  api: FuiDatagridApiService;
  columnApi: FuiDatagridColumnApiService;
  column: Column | null;
  columns: Column[] | null;
}`);

  columnResizedEventCode: string = jsBeautify.js(`
  interface ColumnResizedEvent extends ColumnEvent {
  finished: boolean;
}`);

  columnVisibleEventCode: string = jsBeautify.js(`
  interface ColumnVisibleEvent extends ColumnEvent {
  visible: boolean | undefined;
}`);

  rowClickedEventCode: string = jsBeautify.js(`
  interface RowClickedEvent {
  type: string;
  api: FuiDatagridApiService;
  columnApi: FuiDatagridColumnApiService;
  rowNode: FuiBodyRow;
  rowData: any;
  rowIndex: number;
  event?: Event | null;
  }`);

  rowDoubleClickedEventCode: string = jsBeautify.js(`
  interface RowDoubleClickedEvent {
  type: string;
  api: FuiDatagridApiService;
  columnApi: FuiDatagridColumnApiService;
  rowNode: FuiBodyRow;
  rowData: any;
  rowIndex: number;
  event?: Event | null;
  }`);

  cellClickedEventCode: string = jsBeautify.js(`
  interface CellClickedEvent {
  type: string;
  api: FuiDatagridApiService;
  columnApi: FuiDatagridColumnApiService;
  cellNode: FuiBodyCell;
  column: Column;
  value: any;
  rowIndex: number;
  rowData: any;
  event?: Event | null;
  }`);

  cellDoubleClickedEventCode: string = jsBeautify.js(`
  interface CellDoubleClickedEvent {
  type: string;
  api: FuiDatagridApiService;
  columnApi: FuiDatagridColumnApiService;
  cellNode: FuiBodyCell;
  column: Column;
  value: any;
  rowIndex: number;
  rowData: any;
  event?: Event | null;
  }`);

  cellContextMenuEventCode: string = jsBeautify.js(`
  interface CellContextMenuEvent {
  type: string;
  api: FuiDatagridApiService;
  columnApi: FuiDatagridColumnApiService;
  cellNode: FuiBodyCell;
  column: Column;
  value: any;
  rowIndex: number;
  rowData: any;
  event?: Event | null;
  }`);

  datagridActionMenuCode: string = jsBeautify.html(`
  <ng-template
    #actionMenu
    let-rowIndex="rowIndex"
    let-rowData="rowData"
    let-onDropdownOpen="onDropdownOpen"
    let-forceClose="forceClose"
    let-appendTo="appendTo"
  >
    <fui-dropdown (dropdownOpenChange)="onDropdownOpen($event)" [forceClose]="forceClose">
      <button class="fui-datagrid-demo-action-btn btn" fuiDropdownTrigger>
        <clr-icon class="fui-dots-icon" shape="fui-dots"></clr-icon>
      </button>
      <fui-dropdown-menu [appendTo]="appendTo" *fuiIfOpen>
        <div fuiDropdownItem>action 1 for row {{ rowIndex }} (ID: {{rowData.id}})</div>
        <div fuiDropdownItem>action 2 for row {{ rowIndex }} (ID: {{rowData.id}})</div>
        <div fuiDropdownItem>action 3 for row {{ rowIndex }} (ID: {{rowData.id}})</div>
        <div fuiDropdownItem>action 4 for row {{ rowIndex }} (ID: {{rowData.id}})</div>
        <div fuiDropdownItem>action 5 for row {{ rowIndex }} (ID: {{rowData.id}})</div>
      </fui-dropdown-menu>
    </fui-dropdown>
  </ng-template>`);

  datagridActionMenuTagCode: string = jsBeautify.html(`
  <fui-datagrid
    #datagrid
    ...
    [actionMenuTemplate]="actionMenu"
  ></fui-datagrid>`);

  datagridActionMenuContextCode: string = jsBeautify.js(`
  export interface FuiDatagridBodyRowContext {
  rowNode: RowNode;
  // If for any reason you need to know the top value of the specific row.
  // Can be useful if you're using custom action-menu dropdown.
  rowTopValue: number;
  // If you want to append the action-menu to a different container, like the body or whatever else.
  // By default, the action-menu will automatically assign this property to body.
  appendTo: string;
  // Callback for when the dropdown menu is opening. Useful for adding extra design to the row (i.e: hovering state).
  onDropdownOpen?: (isOpen: boolean) => void;
  // This will force the action menu to close its dropdown (if any).
  forceClose?: boolean;
}`);

  datagridSpecifyRowsCode: string = `isRowSelectable = (rowNode) => {
  return rowNode.data ? rowNode.data.year < 2007 : false;
};`;

  datagridSpecifyRowsHtmlCode: string = `<fui-datagrid
  (...)
  [isRowSelectable]="isRowSelectable">
</fui-datagrid>`;

  datagridrowSelectionEnumCode: string = `enum FuiRowSelectionEnum {
  SINGLE = 'single',
  MULTIPLE = 'multiple'
}`;

  rowSelectedEventCode: string = `interface RowSelectedEvent {
  rowNode: RowNode;
  api: FuiDatagridApiService;
  columnApi: FuiDatagridColumnApiService;
  type: string;
}`;

  selectionChangedEventCode: string = `interface SelectionChangedEvent {
  selectedItems: { [key: string]: RowNode };
  api: FuiDatagridApiService;
  columnApi: FuiDatagridColumnApiService;
  type: string;
}`;
}
