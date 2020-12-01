export default [
  {
    label: "Label",
    fieldName: "name",
    type: "enhanced",
    typeAttributes: {
      recordId: { fieldName: "id" },
      fieldName: "name",
      type: "text"
    },
    sortable: true,
    hideDefaultActions: true
  },
  {
    label: "Website",
    fieldName: "website",
    type: "enhanced",
    typeAttributes: {
      recordId: { fieldName: "id" },
      fieldName: "website",
      type: "url"
    },
    sortable: true,
    hideDefaultActions: true
  },
  {
    label: "Phone",
    fieldName: "phone",
    type: "enhanced",
    typeAttributes: {
      recordId: { fieldName: "id" },
      fieldName: "phone",
      type: "phone",
      readOnly: true
    },
    sortable: true,
    hideDefaultActions: true
  },
  {
    label: "Balance",
    fieldName: "amount",
    type: "enhanced",
    typeAttributes: {
      recordId: { fieldName: "id" },
      fieldName: "amount",
      type: "number",
      formatStyle: "currency",
      currencyCode: "EUR",
      currencyDisplayAs: "code"
    },
    sortable: true,
    hideDefaultActions: true
  },
  {
    label: "Balance Range",
    fieldName: "amount2",
    type: "enhanced",
    typeAttributes: {
      recordId: { fieldName: "id" },
      fieldName: "amount2",
      type: "numericrange",
      currency: { fieldName: "display" }
    },
    sortable: true,
    hideDefaultActions: true
  },
  {
    label: "Select",
    fieldName: "select",
    type: "enhanced",
    typeAttributes: {
      recordId: { fieldName: "id" },
      fieldName: "select",
      options: [
        { value: "", label: "Select One" },
        { value: "123", label: "123" },
        { value: "234", label: "234" }
      ],
      type: "select",
      readOnly: false
    },
    wrapText: true
  },
  {
    label: "CloseAt",
    fieldName: "closeAt",
    type: "enhanced",
    typeAttributes: { recordId: { fieldName: "id" }, fieldName: "closeAt" },
    sortable: true,
    hideDefaultActions: true
  },
  {
    label: "Account",
    fieldName: "AccountId",
    type: "enhanced",
    typeAttributes: {
      recordId: { fieldName: "id" },
      fieldName: "AccountId",
      objectApiName: "Contact",
      type: "lookup"
    },
    wrapText: true,
    sortable: true,
    hideDefaultActions: true
  },
  {
    label: "Date",
    fieldName: "date",
    type: "enhanced",
    typeAttributes: {
      recordId: { fieldName: "id" },
      fieldName: "date",
      type: "daterange"
    },
    wrapText: true,
    sortable: true,
    hideDefaultActions: true
  }
];
