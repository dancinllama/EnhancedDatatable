import { LightningElement, track } from "lwc";
import { handleHeaderAction, getFilteredRecords } from "c/enhancedDatatable";
import DATA from './data.js';
import COLUMNS from './columns.js';

export default class Example extends LightningElement {
  @track displayRecords;
  @track filters = {};
  @track summary = 'sum';
  @track keyField = 'id';
  columns = COLUMNS;

  connectedCallback() {
      this.displayRecords = DATA;
      this.filters = [];
  }

  handleValueChangeParent(event) {
    let detail = event.detail;
    let record = this.records.find(record => record.id === detail.recordId);
    if (record && detail.fieldName) {
      record[detail.fieldName] = detail.value;
    }
  }

  handleFilterChangeParent(event) {
    let detail = event.detail;

    if (!this.records) {
      this.records = DATA;
    }
    let filterResult = getFilteredRecords(
        this.columns,
        this.records,
        this.filters,
        detail.fieldName,
        detail.op,
        detail.value,
        true,
        true,
        this.keyField,
        this.summary
    );
    this.displayRecords = filterResult.records;
    this.filters = filterResult.filters;
  }

  handleHeaderAction(event) {
    handleHeaderAction(event);
  }
}
