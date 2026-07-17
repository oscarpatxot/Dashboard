export default {

	formatoValor(valor, columna = "") {

		if (valor === null || valor === undefined)
			return "";

// Orden sin decimales
if (
	columna === "orden_en_proyecto" ||
	columna === "Orden"
)
	return parseInt(valor, 10);

// Fecha primer pago
if (
	columna === "fecha_primer_pago" ||
	columna === "Fecha 1er Pago"
)
	return moment(valor).format("DD/MM/YYYY");

// Fecha último pago
if (
	columna === "fecha_ultimo_pago" ||
	columna === "Fecha Ult. Pago"
)
	return moment(valor).format("DD/MM/YYYY");

// Campos de texto
if (
	columna === "nombre_adquiriente" ||
	columna === "adquiriente" ||
	columna === "unidad" ||
	columna === "nombre_unidad" ||
	columna === "estado"
)
	return valor;

		// Intentar convertir a número
		const numero = Number(
			String(valor).replace(/,/g, "")
		);

		if (!isNaN(numero) && String(valor).trim() !== "")
			return numero.toLocaleString(
				"en-US",
				{
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				}
			);

		return valor;

	},

	generarHTML(tabla) {

		const data = tabla.filteredTableData;

		if (!data || !data.length) {

			showAlert(
				"No hay datos para imprimir.",
				"warning"
			);

			return "";

		}

		const columnas =
			tabla.orderedTableColumns.filter(
				c => c.isVisible
			);

		const proyecto =
			DD_Proyecto_Adq.selectedOptionLabel;

		const valorTotal =
			data.reduce(
				(acc, row) =>
					acc +
					Number(
						String(row.valor_usd || 0)
							.replace(/,/g, "")
					),
				0
			);

		const pagado =
			data.reduce(
				(acc, row) =>
					acc +
					Number(
						String(row.total_pagado_usd || 0)
							.replace(/,/g, "")
					),
				0
			);

		const pendiente =
			data.reduce(
				(acc, row) =>
					acc +
					Number(
						String(row.balance_pendiente_usd || 0)
							.replace(/,/g, "")
					),
				0
			);

		const porcentaje =
			valorTotal > 0
				? (pagado / valorTotal) * 100
				: 0;

		return `
		
		<html>

<head>

<meta charset="UTF-8">

<title>

Estado General de Adquirientes

</title>

<style>

body{

	font-family:Arial,sans-serif;
	margin:35px;
	font-size:12px;
	color:#222;

}

h1{

	text-align:center;
	margin-bottom:30px;

}

.info{

	margin-bottom:8px;

}

.label{

	font-weight:bold;

}

.kpi{

	width:500px;
	border-collapse:collapse;
	margin-top:20px;
	margin-bottom:25px;

}

.kpi td{

	border:1px solid #999;
	padding:8px;

}

.kpi td:first-child{

	font-weight:bold;
	width:220px;

}

.kpi td:last-child{

	text-align:right;

}

table{

	width:100%;
	border-collapse:collapse;
	margin-top:20px;

}

th{

	background:#efefef;
	border:1px solid #999;
	padding:6px;
	text-align:left;
	font-size:10px;

}

td{

	border:1px solid #999;
	padding:5px;
	font-size:10px;

}

.footer{

	margin-top:40px;
	font-size:11px;
	color:#666;

}

</style>

</head>

<body>

<h1>

ESTADO GENERAL DE ADQUIRIENTES

</h1>

<div class="info">

<span class="label">

Proyecto:

</span>

${proyecto}

</div>

<table class="kpi">

<tr>

<td>

Valor Total

</td>

<td>

US$ ${this.formatoValor(valorTotal)}

</td>

</tr>

<tr>

<td>

Pagado

</td>

<td>

US$ ${this.formatoValor(pagado)}

</td>

</tr>

<tr>

<td>

% Pagado

</td>

<td>

${porcentaje.toLocaleString(
	"en-US",
	{
		minimumFractionDigits:2,
		maximumFractionDigits:2
	}
)}%

</td>

</tr>

<tr>

<td>

Pendiente

</td>

<td style="font-weight:bold;">

US$ ${this.formatoValor(pendiente)}

</td>

</tr>

</table>

<table>

<thead>

<tr>

${columnas.map(c=>`

<th>

${c.label}

</th>

`).join("")}

</tr>

</thead>

<tbody>

${data.map(row=>`

<tr>

${columnas.map(col=>`

<td>

${this.formatoValor(
	row[col.id],
	col.id
)}

</td>

`).join("")}

</tr>

`).join("")}

</tbody>

</table>

<div class="footer">

Generado el

${moment().format("DD/MM/YYYY HH:mm")}

</div>

</body>

</html>

`;

	}

}