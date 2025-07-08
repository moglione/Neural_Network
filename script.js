document.addEventListener('DOMContentLoaded', () => {
    const numInputsSlider = document.getElementById('numInputs');
    const numHiddenLayersSlider = document.getElementById('numHiddenLayers');
    const neuronsPerLayerSlider = document.getElementById('neuronsPerLayer');
    const numOutputsSlider = document.getElementById('numOutputs');

    const numInputsValueSpan = document.getElementById('numInputsValue');
    const numHiddenLayersValueSpan = document.getElementById('numHiddenLayersValue');
    const neuronsPerLayerValueSpan = document.getElementById('neuronsPerLayerValue');
    const numOutputsValueSpan = document.getElementById('numOutputsValue');

    const svg = document.getElementById('neuralNetworkSvg');
    const svgNS = "http://www.w3.org/2000/svg";

    // Constantes para visualización de pesos
    const POSITIVE_WEIGHT_COLOR_RGB = '0, 150, 0'; // Verde
    const NEGATIVE_WEIGHT_COLOR_RGB = '200, 0, 0'; // Rojo
    const MIN_STROKE_WIDTH = 0.5;
    const MAX_STROKE_WIDTH = 6;
    const WEIGHT_VIS_OPACITY_FACTOR = 0.7; // Factor base para la opacidad, se puede modular más
    const WEIGHT_VIS_THICKNESS_FACTOR = 2.5; // Factor para el grosor

    let network = {
        inputs: [],
        hiddenLayers: [],
        outputs: [],
        weights: [], // Estructura: [weights_input_hidden1, weights_hidden_hidden..., weights_hidden_output]
        biases: []   // Estructura: [biases_hidden1, biases_hidden2..., biases_output]
    };
    let trainingData = []; // {inputs: [0.1, 0.2], outputs: [0.9]}

    function updateSliderValue(slider, span) {
        span.textContent = slider.value;
    }

    function drawNeuron(cx, cy, r, layerType, layerIndex, neuronIndex) {
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        circle.setAttribute('class', 'neuron');
        circle.setAttribute('data-layer', layerIndex);
        circle.setAttribute('data-neuron', neuronIndex);
        if (layerType === 'input') circle.setAttribute('fill', '#87CEEB'); // Azul claro
        else if (layerType === 'output') circle.setAttribute('fill', '#90EE90'); // Verde claro
        else circle.setAttribute('fill', '#FFD700'); // Dorado
        svg.appendChild(circle);
        return circle;
    }

    function drawConnection(x1, y1, x2, y2, weightValue = null) {
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('class', 'connection');

        if (weightValue !== null && typeof weightValue === 'number') {
            const absWeight = Math.abs(weightValue);

            // Grosor
            let strokeWidth = absWeight * WEIGHT_VIS_THICKNESS_FACTOR;
            strokeWidth = Math.max(MIN_STROKE_WIDTH, Math.min(strokeWidth, MAX_STROKE_WIDTH));
            line.setAttribute('stroke-width', strokeWidth.toFixed(2));

            // Color y Opacidad
            // Opacidad podría ser constante o variar con el peso.
            // Para empezar, una opacidad base más una modulación suave por el peso.
            let opacity = WEIGHT_VIS_OPACITY_FACTOR + (absWeight / (MAX_STROKE_WIDTH / WEIGHT_VIS_THICKNESS_FACTOR)) * (1 - WEIGHT_VIS_OPACITY_FACTOR);
            opacity = Math.min(1, opacity); // no pasar de 1

            const colorRGB = weightValue >= 0 ? POSITIVE_WEIGHT_COLOR_RGB : NEGATIVE_WEIGHT_COLOR_RGB;
            line.setAttribute('stroke', `rgba(${colorRGB}, ${opacity.toFixed(2)})`);

            // Tooltip para mostrar el valor exacto del peso (opcional, pero útil)
            const title = document.createElementNS(svgNS, 'title');
            title.textContent = `Peso: ${weightValue.toFixed(4)}`;
            line.appendChild(title);

        } else {
            // Estilo por defecto si no hay peso (o antes de inicializar)
            line.setAttribute('stroke-width', '1');
            line.setAttribute('stroke', '#555'); // Color por defecto de .connection en CSS
            line.style.opacity = '0.7'; // Opacidad por defecto
        }

        svg.appendChild(line);
    }

    function drawNeuralNetwork() {
        svg.innerHTML = ''; // Limpiar SVG
        const numInputs = parseInt(numInputsSlider.value);
        const numHiddenLayers = parseInt(numHiddenLayersSlider.value);
        const neuronsPerLayer = parseInt(neuronsPerLayerSlider.value);
        const numOutputs = parseInt(numOutputsSlider.value);

        const svgWidth = svg.clientWidth;
        const svgHeight = svg.clientHeight;
        const neuronRadius = 15;
        const layerGap = (svgWidth - 2 * neuronRadius * 2) / (numHiddenLayers + 1); // Espacio horizontal entre capas
        const neuronGapVertical = 2.5 * neuronRadius; // Espacio vertical entre neuronas

        let layers = [];

        // Capa de entrada
        let inputLayer = [];
        const inputLayerHeight = (numInputs - 1) * neuronGapVertical;
        const inputStartY = (svgHeight - inputLayerHeight) / 2;
        for (let i = 0; i < numInputs; i++) {
            const cx = neuronRadius * 2;
            const cy = inputStartY + i * neuronGapVertical;
            drawNeuron(cx, cy, neuronRadius, 'input', 0, i);
            inputLayer.push({ x: cx, y: cy });
        }
        layers.push(inputLayer);

        // Capas ocultas
        for (let i = 0; i < numHiddenLayers; i++) {
            let hiddenLayer = [];
            const hiddenLayerHeight = (neuronsPerLayer - 1) * neuronGapVertical;
            const hiddenStartY = (svgHeight - hiddenLayerHeight) / 2;
            for (let j = 0; j < neuronsPerLayer; j++) {
                const cx = neuronRadius * 2 + (i + 1) * layerGap;
                const cy = hiddenStartY + j * neuronGapVertical;
                drawNeuron(cx, cy, neuronRadius, 'hidden', i + 1, j);
                hiddenLayer.push({ x: cx, y: cy });
            }
            layers.push(hiddenLayer);
        }

        // Capa de salida
        let outputLayer = [];
        const outputLayerHeight = (numOutputs - 1) * neuronGapVertical;
        const outputStartY = (svgHeight - outputLayerHeight) / 2;
        for (let i = 0; i < numOutputs; i++) {
            const cx = neuronRadius * 2 + (numHiddenLayers + 1) * layerGap;
            const cy = outputStartY + i * neuronGapVertical;
            drawNeuron(cx, cy, neuronRadius, 'output', numHiddenLayers + 1, i);
            outputLayer.push({ x: cx, y: cy });
        }
        layers.push(outputLayer);

        // Dibujar conexiones
        for (let layerIdx = 0; layerIdx < layers.length - 1; layerIdx++) {
            const currentLayerNeurons = layers[layerIdx];
            const nextLayerNeurons = layers[layerIdx + 1];

            currentLayerNeurons.forEach((neuron1, neuron1Idx) => {
                nextLayerNeurons.forEach((neuron2, neuron2Idx) => {
                    let weight = null;
                    // network.weights[capa_destino_idx_en_pesos][neurona_destino_idx][neurona_origen_idx]
                    // La capa de pesos que conecta layerIdx con layerIdx+1 es network.weights[layerIdx]
                    if (network.weights && network.weights.length > layerIdx &&
                        network.weights[layerIdx] && network.weights[layerIdx].length > neuron2Idx &&
                        network.weights[layerIdx][neuron2Idx] && network.weights[layerIdx][neuron2Idx].length > neuron1Idx) {

                        weight = network.weights[layerIdx][neuron2Idx][neuron1Idx];
                    }
                    drawConnection(neuron1.x + neuronRadius, neuron1.y, neuron2.x - neuronRadius, neuron2.y, weight);
                });
            });
        }
    }

    // Inicializar valores y dibujar
    updateSliderValue(numInputsSlider, numInputsValueSpan);
    updateSliderValue(numHiddenLayersSlider, numHiddenLayersValueSpan);
    updateSliderValue(neuronsPerLayerSlider, neuronsPerLayerValueSpan);
    updateSliderValue(numOutputsSlider, numOutputsValueSpan);
    drawNeuralNetwork();

    // Event listeners para los sliders
    [numInputsSlider, numHiddenLayersSlider, neuronsPerLayerSlider, numOutputsSlider].forEach(slider => {
        slider.addEventListener('input', () => {
            updateSliderValue(slider, document.getElementById(slider.id + 'Value'));
            drawNeuralNetwork();
            initializeNetworkStructure(); // Re-inicializar pesos si la estructura cambia
        });
    });
    window.addEventListener('resize', drawNeuralNetwork); // Re-dibujar si cambia el tamaño de la ventana


    // --- Lógica de la Red Neuronal ---

    function sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    function sigmoidDerivative(x) {
        return x * (1 - x); // Asume que x ya es sigmoid(z)
    }

    function initializeNetworkStructure() {
        const numInputs = parseInt(numInputsSlider.value);
        const numHiddenLayers = parseInt(numHiddenLayersSlider.value);
        const neuronsPerHiddenLayer = parseInt(neuronsPerLayerSlider.value);
        const numOutputs = parseInt(numOutputsSlider.value);

        network.weights = [];
        network.biases = [];

        let lastLayerSize = numInputs;

        // Pesos y biases para capas ocultas
        for (let i = 0; i < numHiddenLayers; i++) {
            const currentLayerSize = neuronsPerHiddenLayer;
            const layerWeights = [];
            const layerBiases = [];
            for (let j = 0; j < currentLayerSize; j++) {
                const neuronWeights = [];
                for (let k = 0; k < lastLayerSize; k++) {
                    neuronWeights.push(Math.random() * 2 - 1); // Pesos entre -1 y 1
                }
                layerWeights.push(neuronWeights);
                layerBiases.push(Math.random() * 2 - 1); // Biases entre -1 y 1
            }
            network.weights.push(layerWeights);
            network.biases.push(layerBiases);
            lastLayerSize = currentLayerSize;
        }

        // Pesos y biases para la capa de salida
        const outputLayerWeights = [];
        const outputLayerBiases = [];
        for (let i = 0; i < numOutputs; i++) {
            const neuronWeights = [];
            for (let j = 0; j < lastLayerSize; j++) {
                neuronWeights.push(Math.random() * 2 - 1);
            }
            outputLayerWeights.push(neuronWeights);
            outputLayerBiases.push(Math.random() * 2 - 1);
        }
        network.weights.push(outputLayerWeights);
        network.biases.push(outputLayerBiases);

        console.log("Network structure initialized:", JSON.parse(JSON.stringify(network)));
        drawNeuralNetwork(); // Redibujar para mostrar pesos iniciales
    }


    function forwardPropagate(inputValues) {
        if (inputValues.length !== parseInt(numInputsSlider.value)) {
            console.error("Mismatch in input values length for forward propagation.");
            return null;
        }

        let currentActivations = [...inputValues];
        const allActivations = [[...currentActivations]]; // Guardar activaciones de cada capa, incluyendo entrada

        for (let i = 0; i < network.weights.length; i++) { // Itera sobre las capas (ocultas y salida)
            const layerWeights = network.weights[i];
            const layerBiases = network.biases[i];
            const newActivations = [];

            for (let j = 0; j < layerWeights.length; j++) { // Itera sobre las neuronas de la capa actual
                let weightedSum = layerBiases[j];
                for (let k = 0; k < currentActivations.length; k++) { // Itera sobre las activaciones de la capa anterior
                    weightedSum += currentActivations[k] * layerWeights[j][k];
                }
                newActivations.push(sigmoid(weightedSum));
            }
            currentActivations = newActivations;
            allActivations.push([...currentActivations]);
        }
        return { finalOutput: currentActivations, allActivations };
    }


    function backPropagate(inputValues, targetOutputs, learningRate, allActivations) {
        const numLayers = network.weights.length; // Número de capas con pesos (ocultas + salida)
        let errors = [];

        // Calcular error de la capa de salida
        const outputLayerActivations = allActivations[allActivations.length - 1];
        const outputErrors = [];
        for (let i = 0; i < outputLayerActivations.length; i++) {
            const error = targetOutputs[i] - outputLayerActivations[i];
            outputErrors.push(error * sigmoidDerivative(outputLayerActivations[i]));
        }
        errors[numLayers - 1] = outputErrors;

        // Retropropagar errores a capas ocultas
        for (let i = numLayers - 2; i >= 0; i--) { // Desde la última capa oculta hacia atrás
            const currentLayerActivations = allActivations[i + 1]; // Activaciones de la capa actual (i-ésima capa oculta o de salida)
            const nextLayerWeights = network.weights[i + 1];
            const nextLayerErrors = errors[i + 1];
            const currentLayerErrors = [];

            for (let j = 0; j < currentLayerActivations.length; j++) { // Para cada neurona en la capa actual
                let errorSum = 0;
                for (let k = 0; k < nextLayerErrors.length; k++) { // Sumar errores ponderados de la siguiente capa
                    errorSum += nextLayerErrors[k] * nextLayerWeights[k][j];
                }
                currentLayerErrors.push(errorSum * sigmoidDerivative(currentLayerActivations[j]));
            }
            errors[i] = currentLayerErrors;
        }

        // Actualizar pesos y biases
        for (let i = 0; i < numLayers; i++) { // Para cada capa (desde entrada-oculta1 hasta ultimaoculta-salida)
            const prevLayerActivations = allActivations[i]; // Activaciones de la capa anterior (o entrada)
            const currentLayerErrors = errors[i]; // Errores de las neuronas de la capa actual

            for (let j = 0; j < network.weights[i].length; j++) { // Para cada neurona en la capa actual
                for (let k = 0; k < network.weights[i][j].length; k++) { // Para cada peso conectado a esa neurona
                    network.weights[i][j][k] += learningRate * currentLayerErrors[j] * prevLayerActivations[k];
                }
                network.biases[i][j] += learningRate * currentLayerErrors[j];
            }
        }
    }

    // --- Manejo de Datos y Entrenamiento ---
    const trainInputsTextarea = document.getElementById('trainInputs');
    const trainOutputsTextarea = document.getElementById('trainOutputs');
    const epochsInput = document.getElementById('epochs');
    const learningRateInput = document.getElementById('learningRate');
    const trainButton = document.getElementById('trainButton');
    // const addTrainingDataButton = document.getElementById('addTrainingData'); // No implementado aún

    function parseTextareaData(textareaContent, expectedLength) {
        const lines = textareaContent.trim().split('\n');
        const data = [];
        for (const line of lines) {
            const values = line.split(',').map(s => parseFloat(s.trim()));
            if (values.some(isNaN)) {
                alert(`Error: '${line}' contiene valores no numéricos.`);
                return null;
            }
            if (values.length !== expectedLength) {
                alert(`Error: Se esperaban ${expectedLength} valores por línea, pero se encontraron ${values.length} en '${line}'.`);
                return null;
            }
            data.push(values);
        }
        return data;
    }

    trainButton.addEventListener('click', () => {
        const numInputs = parseInt(numInputsSlider.value);
        const numOutputs = parseInt(numOutputsSlider.value);

        const inputData = parseTextareaData(trainInputsTextarea.value, numInputs);
        const outputData = parseTextareaData(trainOutputsTextarea.value, numOutputs);

        if (!inputData || !outputData || inputData.length !== outputData.length) {
            alert("Error en los datos de entrada o salida. Asegúrate de que haya la misma cantidad de muestras y que los formatos sean correctos.");
            return;
        }

        if (inputData.length === 0) {
            alert("No hay datos de entrenamiento.");
            return;
        }

        trainingData = inputData.map((inputs, i) => ({ inputs, outputs: outputData[i] }));

        const epochs = parseInt(epochsInput.value);
        const learningRate = parseFloat(learningRateInput.value);

        if (isNaN(epochs) || epochs <= 0) {
            alert("Número de épocas inválido.");
            return;
        }
        if (isNaN(learningRate) || learningRate <= 0) {
            alert("Tasa de aprendizaje inválida.");
            return;
        }

        console.log("Iniciando entrenamiento...");
        trainButton.disabled = true;
        trainButton.textContent = "Entrenando...";

        // Re-initialize network in case structure changed and then training started
        // Or if it's the first training run.
        if (network.weights.length === 0 ||
            network.weights[0][0].length !== numInputs || // Check input layer weights
            network.weights[network.weights.length -1].length !== numOutputs) { // Check output layer size
             initializeNetworkStructure();
        }


        // Simulación de entrenamiento asíncrono para no bloquear UI (muy básico)
        let currentEpoch = 0;
        function trainingLoop() {
            if (currentEpoch < epochs) {
                let totalErrorEpoch = 0;
                for (const dataPair of trainingData) {
                    const { finalOutput, allActivations } = forwardPropagate(dataPair.inputs);
                    if (!finalOutput) { // Error en forwardPropagate
                        trainButton.disabled = false;
                        trainButton.textContent = "Entrenar Red";
                        return;
                    }
                    backPropagate(dataPair.inputs, dataPair.outputs, learningRate, allActivations);

                    // Calcular error MSE para la muestra actual (opcional, para logging)
                    let sampleError = 0;
                    for(let k=0; k < finalOutput.length; k++) {
                        sampleError += Math.pow(dataPair.outputs[k] - finalOutput[k], 2);
                    }
                    totalErrorEpoch += sampleError / finalOutput.length;
                }
                currentEpoch++;
                if (currentEpoch % 100 === 0 || currentEpoch === epochs) {
                    console.log(`Época: ${currentEpoch}/${epochs}, MSE aproximado: ${totalErrorEpoch / trainingData.length}`);
                }

                // Actualizar UI del botón cada X épocas para mostrar progreso
                if (currentEpoch % 50 === 0) {
                     trainButton.textContent = `Entrenando... (${currentEpoch}/${epochs})`;
                }
                requestAnimationFrame(trainingLoop); // Siguiente iteración en el próximo frame
            } else {
                console.log("Entrenamiento completado.");
                alert("Entrenamiento completado.");
                trainButton.disabled = false;
                trainButton.textContent = "Entrenar Red";
                drawNeuralNetwork(); // Redibujar para mostrar pesos finales después del entrenamiento
            }
        }
        trainingLoop(); // Iniciar el bucle
    });


    // --- Predicción ---
    const predictInputText = document.getElementById('predictInput');
    const predictButton = document.getElementById('predictButton');
    const predictionOutputP = document.getElementById('predictionOutput');

    predictButton.addEventListener('click', () => {
        const numInputs = parseInt(numInputsSlider.value);
        const inputValuesStr = predictInputText.value.split(',').map(s => s.trim());

        if (inputValuesStr.length !== numInputs) {
            alert(`Se esperan ${numInputs} valores de entrada para la predicción, pero se proporcionaron ${inputValuesStr.length}.`);
            return;
        }

        const inputValues = inputValuesStr.map(s => parseFloat(s));
        if (inputValues.some(isNaN)) {
            alert("Entrada de predicción contiene valores no numéricos.");
            return;
        }

        if (network.weights.length === 0) {
            alert("La red no ha sido entrenada o inicializada. Por favor, entrena la red primero.");
            return;
        }

        // Verificar si la estructura de la red coincide con la estructura actual de los sliders
        // Esto es importante si el usuario cambió los sliders DESPUÉS de entrenar.
        const currentNumInputs = parseInt(numInputsSlider.value);
        const currentNumHiddenLayers = parseInt(numHiddenLayersSlider.value);
        const currentNeuronsPerLayer = parseInt(neuronsPerLayerSlider.value);
        const currentNumOutputs = parseInt(numOutputsSlider.value);

        let expectedInputSizeInNetwork = network.weights[0][0].length;
        let expectedOutputSizeInNetwork = network.weights[network.weights.length-1].length;
        let expectedHiddenLayersInNetwork = network.weights.length -1; // -1 porque weights incluye la capa de salida
        let expectedNeuronsPerHiddenInNetwork = 0;
        if (expectedHiddenLayersInNetwork > 0) {
            expectedNeuronsPerHiddenInNetwork = network.weights[0].length; // Tamaño de la primera capa oculta
        }


        if (currentNumInputs !== expectedInputSizeInNetwork ||
            currentNumOutputs !== expectedOutputSizeInNetwork ||
            (currentNumHiddenLayers > 0 && (currentNumHiddenLayers !== expectedHiddenLayersInNetwork || currentNeuronsPerLayer !== expectedNeuronsPerHiddenInNetwork)) ||
            (currentNumHiddenLayers === 0 && expectedHiddenLayersInNetwork !== 0) // Caso: sliders a 0 capas ocultas, pero red entrenada tenía capas ocultas
            ) {
            alert("La estructura actual de la red (definida por los sliders) no coincide con la estructura de la red entrenada. Por favor, ajusta los sliders a la configuración usada durante el entrenamiento o re-entrena la red.");
            initializeNetworkStructure(); // Re-inicializar a la estructura actual para evitar errores si se intenta predecir de nuevo.
            predictionOutputP.textContent = "- (Estructura de red cambiada)";
            return;
        }


        const result = forwardPropagate(inputValues);
        if (result && result.finalOutput) {
            predictionOutputP.textContent = result.finalOutput.map(val => val.toFixed(4)).join(', ');
        } else {
            predictionOutputP.textContent = "Error en la predicción.";
        }
    });

    // Inicializar la estructura de la red al cargar
    initializeNetworkStructure();
});
