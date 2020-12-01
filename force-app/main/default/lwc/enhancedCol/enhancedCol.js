import { LightningElement, api } from 'lwc';

export default class EnhancedCol extends LightningElement {
    @api filter;
    @api footer;
    @api readOnly;
    @api val;
    @api type;
    @api fieldName;
    @api options;
    @api recordId;
    @api objectApiName;
    @api formatStyle;
    @api currencyCode;
    @api maximumFractionDigits;
    @api maximumSignificantDigits;
    @api minimumFractionDigits;
    @api minimumSignificantDigits;
    @api minimumIntegerDigits;
    @api currencyDisplayAs;
    @api day;
    @api era;
    @api hour;
    @api hour12;
    @api minute;
    @api month;
    @api second;
    @api timeZone;
    @api timeZoneName;
    @api weekday;
    @api year;

    handleLookupChange(event) {
        let e = { detail: { value: event.detail.value[0] } };
        this.handleFilterChange(e, 'eq');
    }

    handleLookupValueChange(event) {
        let e = { detail: { value: event.detail.value[0] } };
        this.handleValueChange(e);
    }

    handleSelectChange(event) {
        this.handleFilterChange(event, 'eq');
    }

    handleFromChange(event) {
        this.handleFilterChange(event, 'gte');
    }

    handleToChange(event) {
        this.handleFilterChange(event, 'lte');
    }

    handleTextChange(event) {
        this.handleFilterChange(event, 'includes');
    }

    handleFilterChange(event, op) {
        const evt = CustomEvent('filterchange', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                fieldName: this.fieldName,
                value: event.detail.value,
                op: op,
                type: this.type
            }
        });
        this.dispatchEvent(evt);
    }

    handleValueChange(event) {
        const evt = CustomEvent('valuechange', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                recordId: this.recordId,
                fieldName: this.fieldName,
                value: event.detail.value
            }
        });
        this.dispatchEvent(evt);
    }

    get isSelect() {
        return 'select' === this.type;
    }

    get isLookup() {
        return 'lookup' === this.type;
    }

    get isText() {
        return (
            !this.isSelect &&
            !this.isLookup &&
            !this.isDate &&
            !this.isNumeric &&
            !this.isPhone
        );
    }

    get isDateRange() {
        return 'daterange' === this.type;
    }

    get isDate() {
        return 'date' === this.type || this.isDateRange;
    }

    get isNumeric() {
        return 'number' === this.type || this.isNumericRange;
    }

    get isNumericRange() {
        return 'numericrange' === this.type;
    }

    get isFilterOrFooter() {
        return this.filter || this.footer;
    }

    get isPhone() {
        return 'phone' === this.type;
    }
}
