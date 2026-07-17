export default {

	formatoValor(valor, columna = "") {

		if (valor === null || valor === undefined)
			return "";

		// ID Pago sin formato
if (
	columna === "id_pago_adquiriente" ||
	columna === "ID Pago"
)
	return parseInt(valor, 10);

if (
	columna === "cuenta_recibido" ||
	columna === "Cta. Recibido"
)
	return String(valor ?? "");

if (
	columna === "fecha_ingreso_adquiriente" ||
	columna === "Fecha"
)
	return moment(valor).format("DD/MM/YYYY");

		// Moneda sin formato
		if (columna === "moneda")
			return valor;

		// Banco sin formato
		if (columna === "banco_recibido")
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

		// Solo columnas visibles y excluir Observación
		const columnas =
			tabla.orderedTableColumns.filter(
				c =>
					c.isVisible &&
					c.id !== "observacion"
			);

		// Encabezado
		const proyecto =
			DD_Proyecto_Adq.selectedOptionLabel;

		const unidad =
			DD_Unidad_Adq.selectedOptionLabel;

		const adquirientes =
			data[0]?.adquirientes ||
			data[0]?.nombre_adquiriente ||
			"";

		// KPIs
		const valorUnidad =
			Number(data[0]?.valor_usd || 0);

		const abonado =
	data.reduce(
		(acc, row) =>
			acc +
			Number(
				String(row.monto_usd || 0)
					.replace(/,/g, "")
			),
		0
	);

		const pendiente =
			valorUnidad - abonado;

		return `
		
		<html>

<head>

<meta charset="UTF-8">

<title>

Estado de Cuenta

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

	width:420px;
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
	width:180px;

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

ESTADO DE CUENTA

</h1>

<div class="info">

<span class="label">

Proyecto:

</span>

${proyecto}

</div>

<div class="info">

<span class="label">

Unidad:

</span>

${unidad}

</div>

<div class="info">

<span class="label">

Adquiriente(s):

</span>

${adquirientes}

</div>

<table class="kpi">

<tr>

<td>

Valor Unidad

</td>

<td>

US$ ${this.formatoValor(valorUnidad)}

</td>

</tr>

<tr>

<td>

Abonado

</td>

<td>

US$ ${this.formatoValor(abonado)}

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