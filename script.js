// Variables globales para guardar las instancias de los gráficos y poder actualizarlos
let charts = {};

function evaluar() {
    // 1. OBTENER VALORES
    const ph = parseFloat(document.getElementById('ph').value);
    const sst = parseFloat(document.getElementById('sst').value);
    const aceites = parseFloat(document.getElementById('aceites').value);
    const cobre = parseFloat(document.getElementById('cobre').value);
    const hierro = parseFloat(document.getElementById('hierro').value);
    const zinc = parseFloat(document.getElementById('zinc').value);
    const arsenico = parseFloat(document.getElementById('arsenico').value);
    const cadmio = parseFloat(document.getElementById('cadmio').value);
    const cromo = parseFloat(document.getElementById('cromo').value);
    const mercurio = parseFloat(document.getElementById('mercurio').value);
    const cianuro = parseFloat(document.getElementById('cianuro').value);

    // 2. LÓGICA DE EVALUACIÓN (Traducción de tu Python)
    let resultados = "=== RESULTADOS DEL ANÁLISIS SEGÚN LMP ===\n\n";

    // Físicoquímicos (Corregido rango lógico de pH)
    resultados += "--- Parámetros Físicoquímicos ---\n";
    resultados += (ph >= 6 && ph <= 9) ? "✅ pH adecuado\n" : "⚠️ pH fuera de rango\n";
    resultados += (sst <= 20) ? "✅ SST dentro del límite\n" : "⚠️ SST elevado\n";
    resultados += (aceites <= 50) ? "✅ Aceites y Grasas ok\n" : "⚠️ Aceites y Grasas elevado\n";

    // Metales
    resultados += "\n--- Metales esenciales ---\n";
    resultados += (cobre <= 0.5) ? "✅ Cobre Total ok\n" : "⚠️ Cobre Total elevado\n";
    resultados += (hierro <= 2) ? "✅ Hierro (Disuelto) ok\n" : "⚠️ Hierro (Disuelto) elevado\n";
    resultados += (zinc <= 1.5) ? "✅ Zinc Total ok\n" : "⚠️ Zinc Total alto\n";

    // Tóxicos
    resultados += "\n--- Compuestos Tóxicos ---\n";
    resultados += (arsenico <= 0.1) ? "✅ Arsénico Total ok\n" : "⚠️ Arsénico Total elevado\n";
    resultados += (cadmio <= 0.05) ? "✅ Cadmio Total ok\n" : "⚠️ Cadmio Total elevado\n";
    resultados += (cromo <= 0.1) ? "✅ Cromo Hexavalente ok\n" : "⚠️ Cromo Hexavalente elevado\n";
    resultados += (mercurio <= 0.002) ? "✅ Mercurio Total ok\n" : "⚠️ Mercurio Total elevado\n";
    resultados += (cianuro <= 1) ? "✅ Cianuro Total ok\n" : "⚠️ Cianuro Total elevado\n";

    // Mostrar texto
    document.getElementById('textResult').innerText = resultados;

    // 3. GRAFICAR
    actualizarGraficas([ph, sst, aceites, cobre, hierro, zinc, arsenico, cadmio, cromo, mercurio, cianuro]);
}

function actualizarGraficas(dataValues) {
    const labels = ["pH", "SST", "Aceites", "Cobre", "Hierro", "Zinc", "As", "Cd", "Cr", "Hg", "CN"];
    
    // Configuración común
    const commonConfig = (type, label, color, bgColor) => ({
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: dataValues,
                borderColor: color,
                backgroundColor: bgColor,
                borderWidth: 1,
                pointRadius: 5 // Para scatter/line
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // Destruir gráficas anteriores si existen para redibujar
    if (charts.bar) charts.bar.destroy();
    if (charts.line) charts.line.destroy();
    if (charts.scatter) charts.scatter.destroy();
    if (charts.hbar) charts.hbar.destroy();

    // 1. Gráfico de Barras
    const ctx1 = document.getElementById('chartBar').getContext('2d');
    charts.bar = new Chart(ctx1, commonConfig('bar', 'Concentración (Barras)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.5)'));

    // 2. Gráfico de Líneas
    const ctx2 = document.getElementById('chartLine').getContext('2d');
    charts.line = new Chart(ctx2, commonConfig('line', 'Concentración (Líneas)', 'orange', 'transparent'));

    // 3. Gráfico de Dispersión (Scatter)
    // En Chart.js scatter requiere coordenadas x/y, pero podemos simularlo con 'line' y showLine: false
    let scatterConfig = commonConfig('line', 'Dispersión', 'green', 'green');
    scatterConfig.data.datasets[0].showLine = false; 
    const ctx3 = document.getElementById('chartScatter').getContext('2d');
    charts.scatter = new Chart(ctx3, scatterConfig);

    // 4. Gráfico de Barras Horizontales
    let hBarConfig = commonConfig('bar', 'Concentración (Horizontal)', 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.5)');
    hBarConfig.options.indexAxis = 'y'; // Esto lo hace horizontal
    const ctx4 = document.getElementById('chartHBar').getContext('2d');
    charts.hbar = new Chart(ctx4, hBarConfig);
}

// Ejecutar una evaluación inicial al cargar
window.onload = evaluar;

