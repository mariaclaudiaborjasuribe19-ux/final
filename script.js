document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const ph = parseFloat(document.getElementById("ph").value);
    const sst = parseFloat(document.getElementById("sst").value);
    const aceitesygrasas = parseFloat(document.getElementById("aceitesygrasas").value);
    const cobre = parseFloat(document.getElementById("cobre").value);
    const hierro = parseFloat(document.getElementById("hierro").value);
    const zinc = parseFloat(document.getElementById("zinc").value);
    const arsenico = parseFloat(document.getElementById("arsenico").value);
    const cadmio = parseFloat(document.getElementById("cadmio").value);
    const cromo = parseFloat(document.getElementById("cromo").value);
    const mercurio = parseFloat(document.getElementById("mercurio").value);
    const cianuro = parseFloat(document.getElementById("cianuro").value);

    // Evaluar parámetros físicoquímicos, metales esenciales, compuestos tóxicos
    const resultadosFisicoquimicos = evaluarFisicoquimicos(ph, sst, aceitesygrasas);
    const resultadosMetales = evaluarMetalesesenciales(cobre, hierro, zinc);
    const resultadosToxicos = evaluarCompuestostoxicos(arsenico, cadmio, cromo, mercurio, cianuro);

    // Mostrar resultados en la página
    let resultadosTexto = "=== RESULTADOS DEL ANÁLISIS SEGÚN LMP ===\n\n";
    resultadosTexto += "--- Parámetros Físicoquímicos ---\n" + resultadosFisicoquimicos.join("\n") + "\n\n";
    resultadosTexto += "--- Metales esenciales ---\n" + resultadosMetales.join("\n") + "\n\n";
    resultadosTexto += "--- Compuestos Tóxicos ---\n" + resultadosToxicos.join("\n");

    document.getElementById("textResultados").textContent = resultadosTexto;

    // Graficar resultados
    graficar(ph, sst, aceitesygrasas, cobre, hierro, zinc, arsenico, cadmio, cromo, mercurio, cianuro);
});

// Funciones de evaluación
function evaluarFisicoquimicos(ph, sst, aceitesygrasas) {
    let resultados = [];
    if (ph >= 5 && ph <= 6) resultados.push("pH adecuado");
    else resultados.push("pH fuera de rango");
    
    if (sst <= 20) resultados.push("SST dentro del límite");
    else resultados.push("SST elevado");

    if (aceitesygrasas <= 50) resultados.push("Aceites y Grasas dentro del límite");
    else resultados.push("Aceites y Grasas elevados");

    return resultados;
}

function evaluarMetalesesenciales(cobre, hierro, zinc) {
    let resultados = [];
    if (cobre <= 0.5) resultados.push("Cobre dentro del límite");
    else resultados.push("Cobre elevado");
    
    if (hierro <= 2) resultados.push("Hierro dentro del límite");
    else resultados.push("Hierro elevado");

    if (zinc <= 1.5) resultados.push("Zinc dentro del límite");
    else resultados.push("Zinc elevado");

    return resultados;
}

function evaluarCompuestostoxicos(arsenico, cadmio, cromo, mercurio, cianuro) {
    let resultados = [];
    if (arsenico <= 0.1) resultados.push("Arsénico dentro del límite");
    else resultados.push("Arsénico elevado");

    if (cadmio <= 0.05) resultados.push("Cadmio dentro del límite");
    else resultados.push("Cadmio elevado");

    if (cromo <= 0.1) resultados.push("Cromo dentro del límite");
    else resultados.push("Cromo elevado");

    if (mercurio <= 0.002) resultados.push("Mercurio dentro del límite");
    else resultados.push("Mercurio elevado");

    if (cianuro <= 1) resultados.push("Cianuro dentro del límite");
    else resultados.push("Cianuro elevado");

    return resultados;
}

// Función para graficar
function graficar(ph, sst, aceitesygrasas, cobre, hierro, zinc, arsenico, cadmio, cromo, mercurio, cianuro) {
    // Gráfico de barras
    new Chart(document.getElementById("graficoBarras"), {
        type: 'bar',
        data: {
            labels: ["pH", "SST", "Aceites y Grasas", "Cobre", "Hierro", "Zinc", "Arsénico", "Cadmio", "Cromo", "Mercurio", "Cianuro"],
            datasets: [{
                label: 'Concentración (mg/L)',
                data: [ph, sst, aceitesygrasas, cobre, hierro, zinc, arsenico, cadmio, cromo, mercurio, cianuro],
                backgroundColor: 'skyblue',
                borderColor: 'blue',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

