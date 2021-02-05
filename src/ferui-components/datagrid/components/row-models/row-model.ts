import { Subscription } from 'rxjs';

import { EventEmitter, Injectable } from '@angular/core';

import { FuiRowModel } from '../../types/row-model.enum';
import { IServerSideDatasource, ServerSideRowModelInterface } from '../../types/server-side-row-model';
import { FuiDatagridRowNode } from '../entities/fui-datagrid-row-node';

import { FuiDatagridClientSideRowModel } from './client-side-row-model';
import { FuiDatagridInfinteRowModel } from './infinite/infinite-row-model';
import { FuiDatagridServerSideRowModel } from './server-side-row-model';

@Injectable()
export class RowModel {
  isReady: EventEmitter<boolean> = new EventEmitter<boolean>();

  // By default the row model is set to Client side.
  private _rowModel: FuiRowModel = FuiRowModel.CLIENT_SIDE;
  private subscriptions: Subscription[] = [];

  constructor(
    private clientSideRowModel: FuiDatagridClientSideRowModel,
    private serverSideRowModel: FuiDatagridServerSideRowModel,
    private infiniteRowModel: FuiDatagridInfinteRowModel
  ) {
    this.setupSubscribers();
  }

  set rowModel(rowModel: FuiRowModel) {
    this._rowModel = rowModel;
    this.setupSubscribers();
  }

  get rowModel(): FuiRowModel {
    return this._rowModel;
  }

  /**
   * Get the currently used RowModel.L
   */
  getRowModel(): FuiDatagridClientSideRowModel | FuiDatagridServerSideRowModel | FuiDatagridInfinteRowModel {
    switch (this.rowModel) {
      case FuiRowModel.CLIENT_SIDE:
        return this.clientSideRowModel;
      case FuiRowModel.INFINITE:
        return this.infiniteRowModel;
      case FuiRowModel.SERVER_SIDE:
        return this.serverSideRowModel;
      default:
        throw new Error(`There is no such ${this.rowModel} row model. Please use a valid row model.`);
    }
  }

  /**
   * Get all displayed rows.
   */
  getDisplayedRows(): FuiDatagridRowNode[] {
    switch (this.rowModel) {
      case FuiRowModel.CLIENT_SIDE:
        return this.clientSideRowModel.getRowNodesToDisplay();
      case FuiRowModel.INFINITE:
        return this.infiniteRowModel.getCurrentlyLoadedRows();
      case FuiRowModel.SERVER_SIDE:
        return this.serverSideRowModel.currentlyLoadedRows;
      default:
        throw new Error(`There is no such ${this.rowModel} row model. Please use a valid row model.`);
    }
  }

  /**
   * Check whether or not we have filters.
   */
  hasFilters(): boolean {
    return this.getRowModel().hasFilters();
  }

  /**
   * Get the server-side row model from RowModel service.
   */
  getServerSideRowModel(): FuiDatagridServerSideRowModel | null {
    return this.isServerSideRowModel() ? (this.getRowModel() as FuiDatagridServerSideRowModel) : null;
  }

  /**
   * Get the infinite-server-side row model from RowModel service.
   */
  getInfiniteServerSideRowModel(): FuiDatagridInfinteRowModel | null {
    return this.isInfiniteServerSideRowModel() ? (this.getRowModel() as FuiDatagridInfinteRowModel) : null;
  }

  /**
   * Get the client-side row model from RowModel service.
   */
  getClientSideRowModel(): FuiDatagridClientSideRowModel | null {
    return this.isClientSideRowModel() ? (this.getRowModel() as FuiDatagridClientSideRowModel) : null;
  }

  /**
   * Whether or not we ar using a client-side row model.
   */
  isClientSideRowModel() {
    return this.rowModel === FuiRowModel.CLIENT_SIDE;
  }

  /**
   * Whether or not we ar using a server-side row model.
   */
  isServerSideRowModel() {
    // At initialisation, if the developer doesn't set any row model, by default it will be ClientSide.
    // But if he set a datasource, the default row model will be server side.
    return this.rowModel === FuiRowModel.SERVER_SIDE;
  }

  /**
   * Whether or not we ar using a infinite-server-side row model.
   */
  isInfiniteServerSideRowModel() {
    return this.rowModel === FuiRowModel.INFINITE;
  }

  /**
   * Refresh the row model for infinite and server side row models only.
   * @param limit
   * @param datasource
   */
  refresh(limit?: number, datasource?: IServerSideDatasource) {
    if (this.rowModel !== FuiRowModel.CLIENT_SIDE) {
      (this.getRowModel() as ServerSideRowModelInterface).refresh(limit, datasource);
    }
  }

  /**
   * Get the datasource for either server-side row model or infinite-row-model.
   */
  getDatasource(): IServerSideDatasource | null {
    if (this.isInfiniteServerSideRowModel() || this.isServerSideRowModel()) {
      const rowModel: ServerSideRowModelInterface = this.getRowModel() as ServerSideRowModelInterface;
      return rowModel && rowModel.datasource ? rowModel.datasource : null;
    }
    return null;
  }

  /**
   * Remove all listeners and reset the row model.
   */
  destroy() {
    this.resetSubscribers();
    if (this.serverSideRowModel) {
      this.serverSideRowModel.reset();
    }
    if (this.infiniteRowModel) {
      this.infiniteRowModel.destroy();
    }
  }

  /**
   * Reset all subscribers
   * @private
   */
  private resetSubscribers() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = [];
    }
  }

  /**
   * Setup subscribers.
   * @private
   */
  private setupSubscribers() {
    this.resetSubscribers();
    if (this.isServerSideRowModel()) {
      this.subscriptions.push(
        this.serverSideRowModel.isReady.subscribe(value => {
          this.isReady.emit(value);
        })
      );
    } else if (this.isInfiniteServerSideRowModel()) {
      this.subscriptions.push(
        this.infiniteRowModel.isReady.subscribe(value => {
          this.isReady.emit(value);
        })
      );
    }
  }
}
