export default {
  exportarCSV(tabla, nombreArchivo) {
    const data = tabla.filteredTableData;

    if (!data || !data.length) {
      showAlert("No hay datos para exportar.", "warning");
      return;
    }

    const columns = tabla.orderedTableColumns.filter(c => c.isVisible);

    const headers = columns.map(c => c.label);

    const csv = [
      headers.join(","),
      ...data.map(row =>
        columns.map(col =>
          `"${String(row[col.id] ?? "").replace(/"/g, '""')}"`
        ).join(",")
      )
    ].join("\n");

    download(
      csv,
      `${nombreArchivo}_${moment().format("YYYY-MM-DD_HH-mm")}.csv`,
      "text/csv"
    );
  }
}