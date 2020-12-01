import { api } from "lwc";
import LightningDatatable from "lightning/datatable";
import enhancedColumn from "./enhancedColumn.html";

/**
 * Custom component that extends LightningDatatable
 * and adds a new column type
 */
export default class enhancedDatatable extends LightningDatatable {
  @api filter;
  @api footer;
  @api summary = "sum";

  connectedCallback() {
    let result = getEnhancedRecords(
      this.columns,
      this.data,
      this.keyField,
      this.filter,
      this.footer,
      this.sortedBy,
      this.sortedDirection,
      this.summary
    );
    this.data = result.data;
    this.columns = result.columns;
  }

  static customTypes = {
    // custom type definition
    enhanced: {
      template: enhancedColumn,
      standardCellLayout: true,
      typeAttributes: [
        "filter",
        "footer",
        "type",
        "value",
        "options",
        "fieldName",
        "recordId",
        "objectApiName",
        "formatStyle",
        "currencyCode",
        "maximumFractionDigits",
        "maximumSignificantDigits",
        "minimumFractionDigits",
        "minimumSignificantDigits",
        "minimumIntegerDigits",
        "currencyDisplayAs",
        "day",
        "era",
        "hour",
        "hour12",
        "minute",
        "month",
        "second",
        "time-zone",
        "time-zone-name",
        "weekday",
        "year"
      ]
    }
  };
}

const getEnhancedRecords = (
  columns,
  data,
  keyField,
  filter,
  footer,
  sortedBy,
  sortedDirection,
  summary
) => {
  if (!data) {
    data = [];
  } else {
    data = [...data];
  }

  if (!sortedBy) {
    sortedBy = columns[0].fieldName;
  }

  if (!sortedDirection) {
    sortedDirection = "asc";
  }

  if (footer) {
    var result = addFooterRow(columns, data, keyField, summary);
    data = result.data;
    columns = result.columns;
  }

  if (filter) {
    var result = addFilterRow(columns, data, keyField);
    data = result.data;
    columns = result.columns;
  }

  columns = columns.map(column => {
    let col = { ...column };
    if (!col.actions) {
      col.actions = [];
    }
    if (col.sortable) {
      let checked = col.fieldName === sortedBy;
      addAction(col, "sortasc", "Sort (Ascending)", checked);
      addAction(col, "sortdesc", "Sort (Descending)", checked);
      col.sortable = false;
    }
    return col;
  });

  if (columns && columns.length) {
    let col = columns[0];
    addAction(col, "sum", "Summarize (SUM)", true);
    addAction(col, "max", "Summarize (MAX)", false);
    addAction(col, "min", "Summarize (MIN)", false);
    addAction(col, "avg", "Summarize (AVG)", false);
  }

  return { data: data, columns: columns };
};

const addFooterRow = (columns, data, keyField, summary) => {
  let result = addSpecialRow(columns, "footer", keyField);
  columns = result.columns;
  let footerRow = result.row;

  if (!summary) {
    summary = "sum";
  }

  let firstCol = columns[0];
  if (!isNumericColumn(firstCol)) {
    footerRow[firstCol.fieldName] = summary.toUpperCase();
  }

  updateSummaries(columns, data, footerRow, summary);

  data.push(footerRow);
  return { data : data, columns : columns};
};

const addFilterRow = (columns, data, keyField) => {
  let result = addSpecialRow(columns, "filter", keyField);
  columns = result.columns;
  let filterRow = result.row;
  data.unshift(filterRow);
  return { data : data, columns : columns};
};

const addAction = (col, name, label, checked) => {
  let existing = col.actions.find(action => action.name === name);
  if (!existing) {
    col.actions.push({
      name: name,
      label: label,
      checked: checked
    });
  }
};

const isNumericColumn = col => {
  let x =
    (!!col.type && "number" === col.type) ||
    "numericrange" === col.type ||
    "currency" === col.type;

  let y =
    !!col.typeAttributes &&
    !!col.typeAttributes.type &&
    ("numericrange" === col.typeAttributes.type ||
      "number" === col.typeAttributes.type ||
      "currency" === col.typeAttributes.type);

  return x || y;
};

const isDateColumn = col => {
  let x = (!!col.type && "date" === col.type) || "daterange" === col.type;

  let y =
    !!col.typeAttributes &&
    !!col.typeAttributes.type &&
    ("daterange" === col.typeAttributes.type ||
      "date" === col.typeAttributes.type);

  return x || y;
};

const addSpecialRow = (columns, typeAttribute, keyField) => {
  let row = {};
  row[typeAttribute] = true;
  row[keyField] = typeAttribute;
  columns = columns.map(column => {
    let col = { ...column };
    if (!col.typeAttributes) {
      col.typeAttributes = {};
    } else {
      col.typeAttributes = { ...column.typeAttributes };
    }
    col.typeAttributes[typeAttribute] = { fieldName: typeAttribute };
    return col;
  });
  return { row: row, columns: columns };
};

const calculateAverage = (data, fieldName, undefined) => {
  return (
    data.reduce(
      (result, current) =>
        result + (isNaN(current[fieldName]) ? 0 : current[fieldName])
    ) / data.length
  );
};

const calculateMax = (data, fieldName) => {
  return data.reduce((result, current, undefined) =>
    isNaN(result)
      ? current[fieldName]
      : isNan(current[fieldName])
      ? result
      : result > current[fieldName]
      ? result
      : current[fieldName]
  );
};

const calculateMin = (data, fieldName) => {
  return data.reduce((result, current, undefined) =>
    isNaN(result)
      ? current[fieldName]
      : isNan(current[fieldName])
      ? result
      : result < current[fieldName]
      ? result
      : current[fieldName]
  );
};

const calculateSum = (data, fieldName) => {
  return data.reduce((result, current) =>
    isNaN(result)
      ? current[fieldName]
      : isNaN(current[fieldName])
      ? result
      : result + current[fieldName]
  );
};

const updateSummaries = (columns, data, footer, summary) => {
  let numericColumns = [...columns];
  let result = numericColumns.filter(col => isNumericColumn(col));
  result.forEach(col => {
    let field = col.fieldName;
    let value = undefined;
    switch (summary) {
      case "min":
        footer[field] = calculateMin(data, field);
        break;
      case "max":
        footer[field] = calculateMax(data, field);
        break;
      case "average":
        footer[field] = calculateAverage(data, field);
      default:
        footer[field] = calculateSum(data, field);
    }
  });

  result = numericColumns.filter(col => isDateColumn(col));
  result.forEach(col => {
    let field = col.fieldName;
    let value = undefined;
    switch (summary) {
      case "min":
        footer[field] = calculateMinDate(data, field);
        break;
      case "max":
        footer[field] = calculateMaxDate(data, field);
        break;
      //case "average":
      //  footer[field] = calculateAverage(data, field);
      default:
        footer[field] = undefined;
    }
  });

  return summary;
};

const handleHeaderAction = event => {
  const actionName = event.detail.action.name;
  const colDef = event.detail.columnDefinition;
  const footer =
    this.data && this.data.length && footer
      ? this.data[this.data.length - 1]
      : undefined;
  switch (actionName) {
    case "min":
      updateSummaries(this.columns, this.data, footer, actionName);
      break;
    case "max":
      updateSummaries(this.columns, this.data, footer, actionName);
      break;
    case "avg":
      updateSummaries(this.columns, this.data, footer, actionName);
      break;
    case "sum":
      updateSummaries(this.columns, this.data, footer, actionName);
      break;
    case "sortasc":
      resetSortedOptions(this.columns);
      this.sortedBy = colDef.fieldName;
      this.data = getSortedRecords(colDef, this.data, colDef.fieldName, "asc");
      colDef.actions.find(action.name === "sortasc").checked = true;
      break;
    case "sortdesc":
      resetSortedOptions(this.columns);
      this.sortedBy = colDef.fieldName;
      this.data = getSortedRecords(colDef, this.data, colDef.fieldName, "desc");
      colDef.actions.find(action.name === "sortdesc").checked = true;
      break;
    default:
      break;
  }
};

const getSortedRecords = (
  columnDefinition,
  data,
  sortedBy,
  sortedDirection
) => {
  let ascendingOrDescendingMultiplier = sortedDirection === "asc" ? 1 : -1;
  let isDate = isDateColumn(columnDefinition);
  let isNumber = isNumericColumn(columnDefinition);
  let isText = !isDate && !isNunmber;

  return data.sort((a, b) => {
    let x = isDate
      ? new Date(a[sortedBy])
      : isText
      ? !a[sortedBy]
        ? ""
        : a[sortedBy].toUpperCase()
      : a;
    let y = isDate
      ? new Date(b[sortedBy])
      : isText
      ? !b[sortedBy]
        ? ""
        : b[sortedBy].toUpperCase()
      : b;
    return x > y ? 1 : x === y ? 0 : -1;
  });
};

const resetSortedOptions = columns => {
  columns.forEach(col => {
    if (col.actions) {
      col.actions.forEach(action => {
        if (
          action.checked &&
          (action.name === "sortasc" || action.name === "sortdesc")
        ) {
          action.checked = false;
        }
      });
    }
  });
};

const getFilteredRecords = (
  columns,
  data,
  filters,
  fieldName,
  op,
  value,
  filter,
  footer,
  keyField,
  summary
) => {
  let currentFilters = { ...filters };
  let key = fieldName + "_" + op;
  let currentFilter = currentFilters[key];

  if (currentFilter) {
    if (!value || "" === value) {
      delete currentFilters[key];
    } else {
      currentFilter.value = value;
    }
  } else if (value) {
    currentFilters[key] = {
      name: fieldName,
      fieldName: fieldName,
      op: op,
      value: value
    };
  }

  let result = { filters: currentFilters };

  let filteredRecords = [...data];

  if (filters) {
    Object.keys(currentFilters).forEach(filterKey => {
      let filter = currentFilters[filterKey];
      filteredRecords = filteredRecords.filter(record => {
        if (record.filter) {
          return record;
        }

        let op = filter.op;
        let field = filter.fieldName;
        let recordVal = record[field];
        let dataType = filter.type;

        if (recordVal) {
          switch (op) {
            case "includes":
              if ((recordVal + "").includes(filter.value + "")) {
                return record;
              }
              break;
            case "gte":
              if ("daterange" === dataType || "date" === dataType) {
                let filterDate = new Date(filter.value);
                let recordDate = new Date(recordVal);
                if (recordDate >= filterDate) {
                  return record;
                }
              } else if (recordVal >= filter.value) {
                return record;
              }
              break;
            case "lte":
              if ("daterange" === dataType || "date" === dataType) {
                let filterDate = new Date(filter.value);
                let recordDate = new Date(recordVal);
                if (recordDate <= filterDate) {
                  return record;
                }
              } else if (recordVal <= filter.value) {
                return record;
              }
              break;
            default:
              if (recordVal === filter.value) {
                return record;
              }
          }
        }
      });
    });
  }

  if (filter) {
    addFilterRow(columns, filteredRecords, keyField);
  }

  if (footer) {
    addFooterRow(columns, filteredRecords, keyField, summary);
  }

  return { filters: currentFilters, records: filteredRecords };
};

export {
  handleHeaderAction,
  getFilteredRecords,
  getSortedRecords,
  updateSummaries,
  isNumericColumn,
  isDateColumn
};
