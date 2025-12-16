let charts = {};

function evaluar() {
    try {
        console.log("Iniciando evaluación con ajustes logarítmicos y color.");

        // 1. OBTENER VALORES
        const getVal = (id) => {
            const el = document.getElementById(id);
            if (!el) throw new Error(`No se encontró el campo con ID: ${id}`);
            // Usamos un pequeño valor mínimo (1e-6) para el logaritmo
            const value = parseFloat(el.value);
            return isNaN(value) ? 0 : Math.max(value, 1e-6); 
        };

        const ph = getVal('ph');
        const sst = getVal('sst');
        const aceites = getVal('aceites');
        const cobre = getVal('cobre');
        const hierro = getVal('hierro');
        const zinc = getVal('zinc');
        const arsenico = getVal('arsenico');
        const cadmio = getVal('cadmio');
        const cromo = getVal('cromo');
        const mercurio = getVal('mercurio');
        const cianuro = getVal('cianuro');

        // 2. LÓGICA DE EVALUACIÓN
        let resultados = "=== 📝 RESULTADOS DEL ANÁLISIS SEGÚN LMP ===\n\n";

        // --- Parámetros Físicoquímicos (Límites corregidos del original)
        resultados += "--- 🧪 Parámetros Físicoquímicos ---\n";
        resultados += (ph >= 6 && ph <= 9) ? "✅ pH adecuado\n" : "🛑 pH fuera de rango\n";
        resultados += (sst <= 50) ? "✅ SST dentro del límite\n" : "🛑 SST elevado\n";
        resultados += (aceites <= 20) ? "✅ Aceites y Grasas ok\n" : "🛑 Aceites y Grasas elevado\n";

        // --- Metales
        resultados += "\n--- ⛏️ Metales esenciales ---\n";
        resultados += (cobre <= 0.5) ? "✅ Cobre Total ok\n" : "🛑 Cobre Total elevado\n";
        resultados += (hierro <= 2) ? "✅ Hierro (Disuelto) ok\n" : "🛑 Hierro (Disuelto) elevado\n";
        resultados += (zinc <= 1.5) ? "✅ Zinc Total ok\n" : "🛑 Zinc Total alto\n";

        // --- Compuestos Tóxicos
        resultados += "\n--- ☠️ Compuestos Tóxicos ---\n";
        resultados += (arsenico <= 0.1) ? "✅ Arsénico Total ok\n" : "🛑 Arsénico Total elevado\n";
        resultados += (cadmio <= 0.05) ? "✅ Cadmio Total ok\n" : "🛑 Cadmio Total elevado\n";
        resultados += (cromo <= 0.1) ? "✅ Cromo Hexavalente ok\n" : "🛑 Cromo Hexavalente elevado\n";
        resultados += (mercurio <= 0.002) ? "✅ Mercurio Total ok\n" : "🛑 Mercurio Total elevado\n";
        resultados += (cianuro <= 1) ? "✅ Cianuro Total ok\n" : "🛑 Cianuro Total elevado\n";

        // Mostrar texto
        const txtOutput = document.getElementById('textResult');
        if(txtOutput) {
            txtOutput.innerText = resultados;
        }

        // 3. GRAFICAR
        actualizarGraficas([ph, sst, aceites, cobre, hierro, zinc, arsenico, cadmio, cromo, mercurio, cianuro]);

    } catch (error) {
        alert("Ocurrió un error: " + error.message);
        console.error(error);
    }
}

function actualizarGraficas(dataValues) {
    if (typeof Chart === 'undefined') {
        document.getElementById('textResult').innerText += "\n\n⚠️ Error: No se pudo cargar la librería de gráficas (Chart.js).";
        return;
    }

    const labels = ["pH", "SST", "Aceites", "Cobre", "Hierro", "Zinc", "As", "Cd", "Cr", "Hg", "CN"];
    
    // Asignación de colores por tipo de parámetro para mejor distinción
    const colors = [
        '#2ecc71', // pH (Verde - Físico)
        '#3498db', // SST (Azul - Físico)
        '#3498db', // Aceites (Azul - Físico)
        '#f1c40f', // Cobre (Amarillo - Metal)
        '#f1c40f', // Hierro (Amarillo - Metal)
        '#f1c40f', // Zinc (Amarillo - Metal)
        '#e74c3c', // Arsénico (Rojo - Tóxico)
        '#e74c3c', // Cadmio (Rojo - Tóxico)
        '#e74c3c', // Cromo (Rojo - Tóxico)
        '#e74c3c', // Mercurio (Rojo - Tóxico)
        '#e74c3c', // Cianuro (Rojo - Tóxico)
    ];

    const commonConfig = (type, label, backgroundColor, borderColor, logScale = false) => ({
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: dataValues,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                borderWidth: 2,
                pointRadius: 6,
                pointBackgroundColor: borderColor,
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: logScale ? 'logarithmic' : 'linear',
                    title: {
                        display: true,
                        text: logScale ? 'Concentración (Escala Logarítmica)' : 'Concentración (Escala Lineal)'
                    }
                }
            }
        }
    });

    // Destruir gráficas anteriores
    if (charts.bar) charts.bar.destroy();
    if (charts.line) charts.line.destroy();
    if (charts.scatter) charts.scatter.destroy();
    if (charts.hbar) charts.hbar.destroy();

    // 1. Gráfico de Barras con ESCALA LOGARÍTMICA
    const ctx1 = document.getElementById('chartBar');
    if (ctx1) charts.bar = new Chart(ctx1.getContext('2d'), commonConfig(
        'bar', 
        'Concentración (Escala Log)', 
        colors.map(c => c + '80'), // Fondo con transparencia
        colors, // Borde sólido
        true // ACTIVAR ESCALA LOGARÍTMICA
    ));
    
    // 2. Gráfico de Líneas con ESCALA LOGARÍTMICA
    const ctx2 = document.getElementById('chartLine');
    if (ctx2) charts.line = new Chart(ctx2.getContext('2d'), commonConfig(
        'line', 
        'Tendencia (Escala Log)', 
        'transparent', // Fondo transparente
        colors, // Color de línea
        true // ACTIVAR ESCALA LOGARÍTMICA
    ));

    // 3. Gráfico de Dispersión (Scatter) - ESCALA LINEAL
    const ctx3 = document.getElementById('chartScatter');
    if (ctx3) {
        let scatterConfig = commonConfig(
            'line', 
            'Dispersión (Lineal)', 
            'transparent', 
            colors, 
            false
        );
        scatterConfig.data.datasets[0].showLine = false; 
        charts.scatter = new Chart(ctx3.getContext('2d'), scatterConfig);
    }

    // 4. Gráfico de Barras Horizontales - ESCALA LINEAL
    const ctx4 = document.getElementById('chartHBar');
    if (ctx4) {
        let hBarConfig = commonConfig(
            'bar', 
            'Comparativa (Lineal)', 
            colors.map(c => c + '99'),
            colors,
            false
        );
        hBarConfig.options.indexAxis = 'y';
        charts.hbar = new Chart(ctx4.getContext('2d'), hBarConfig);
    }
}

// Ejecutar una evaluación inicial al cargar la página
window.onload = evaluar;

