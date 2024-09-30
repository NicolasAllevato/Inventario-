document.addEventListener("DOMContentLoaded", () => {
  // Cargar categorías desde localStorage
  const categorias = JSON.parse(localStorage.getItem("categorias")) || [];
  const categoriaSelect = document.getElementById("categoriaProducto");
  categorias.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    categoriaSelect.appendChild(option);
  });

  // Agregar categoría
  document
    .getElementById("agregarCategoriaForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const nombreCategoria = document.getElementById("nombreCategoria").value;
      categorias.push(nombreCategoria);
      localStorage.setItem("categorias", JSON.stringify(categorias));

      // Agregar la nueva categoría al select
      const option = document.createElement("option");
      option.value = nombreCategoria;
      option.textContent = nombreCategoria;
      categoriaSelect.appendChild(option);

      // Limpiar el formulario
      this.reset();
    });

  // Agregar producto
  document
    .getElementById("agregarProductoForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const nombreProducto = document.getElementById("nombreProducto").value;
      const categoria = document.getElementById("categoriaProducto").value;
      const cantidad = document.getElementById("cantidadProducto").value;
      const precioUnitario = document.getElementById("precioUnitario").value;
      const unidadMedida = document.getElementById("unidadMedida").value;
      const fechaToma = document.getElementById("fechaToma").value;

      // Guardar el producto en el Local Storage
      const productos = JSON.parse(localStorage.getItem("productos")) || [];
      productos.push({
        nombreProducto,
        categoria,
        cantidad,
        precioUnitario,
        unidadMedida,
        fechaToma
      });
      localStorage.setItem("productos", JSON.stringify(productos));

      // Limpiar el formulario
      this.reset();
    });

  // Ver reporte de stock
  document.getElementById("verReporteStock").addEventListener("click", () => {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const tablaBody = document.querySelector("#tablaReporte tbody");
    tablaBody.innerHTML = ""; // Limpiar la tabla antes de mostrar datos

    productos.forEach((producto) => {
      const row = document.createElement("tr");
      const precioTotal = (producto.cantidad * producto.precioUnitario).toFixed(
        2
      ); // Calcular precio total

      row.innerHTML = `
                <td>${producto.categoria}</td>
                <td>${producto.nombreProducto}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.unidadMedida}</td>
                <td>${producto.precioUnitario}</td>
                <td>${precioTotal}</td>
                <td>${producto.fechaToma}</td>
            `;
      tablaBody.appendChild(row);
    });

    document.getElementById("reporteStock").style.display = "block"; // Mostrar el reporte
  });

  // Exportar a Excel
  document.getElementById("exportarExcel").addEventListener("click", () => {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent +=
      "Categoría,Producto,Cantidad,Unidad de Medida,Precio Unitario,Precio Total,Fecha de Toma\n"; // Cabecera

    productos.forEach((producto) => {
      const precioTotal = (producto.cantidad * producto.precioUnitario).toFixed(
        2
      );
      const row = [
        producto.categoria,
        producto.nombreProducto,
        producto.cantidad,
        producto.unidadMedida,
        producto.precioUnitario,
        precioTotal,
        producto.fechaToma
      ].join(",");
      csvContent += row + "\n"; // Añadir cada fila al contenido CSV
    });

    // Crear un enlace para descargar
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_stock.csv");
    document.body.appendChild(link); // Requerido para Firefox
    link.click(); // Simula el clic en el enlace para descargar
    document.body.removeChild(link); // Limpiar el DOM
  });
});
