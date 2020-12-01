const datatableToCSV = (columns, data, fileTitle) => {
    let keys = columns.map(column => column.fieldName);

    //Header row
    let csv = columns.map(col => col.fieldName).join(',') + '\r\n';

    //Rest of rows / records.
    data.filter(row => !row.filter).forEach(row => {
        csv += keys.map(key => row[key]).join(',') + '\r\n';
    });

    let exportedFilenmae = fileTitle || 'export.csv';

    var blob = new Blob([csv]);
    if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement('a');
        if (link.download !== undefined) {
            // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
};

export { datatableToCSV };
