# Visualizador Interactivo de Red Neuronal Multicapa

Esta es una aplicación web standalone diseñada para ayudar a entender los conceptos básicos de una red neuronal multicapa (MLP). Permite configurar interactivamente la arquitectura de la red, entrenarla con datos personalizados y visualizar tanto su estructura como los pesos de sus conexiones.

## Características Principales

*   **Configuración Interactiva de la Red**:
    *   Ajuste del número de neuronas de entrada (1-10).
    *   Ajuste del número de capas ocultas (0-10).
    *   Ajuste del número de neuronas por capa oculta (1-10).
    *   Ajuste del número de neuronas de salida (1-10).
*   **Visualización Dinámica SVG**:
    *   La arquitectura de la red (neuronas y conexiones) se dibuja en formato SVG y se actualiza en tiempo real según los parámetros de los sliders.
    *   Las neuronas se colorean según su capa (entrada, oculta, salida).
*   **Visualización de Pesos de Conexión**:
    *   El grosor de cada conexión (axón) en el SVG representa la magnitud absoluta del peso asociado.
    *   El color de la conexión indica el signo del peso (ej., verde para positivo, rojo para negativo), con la opacidad también modulada por la magnitud.
    *   Un tooltip muestra el valor numérico exacto del peso al pasar el cursor sobre una conexión.
*   **Entrenamiento Personalizado**:
    *   Ingreso de datos de entrenamiento: pares de entrada y salida deseada, en formato de texto (valores separados por comas, una muestra por línea).
    *   Configuración de los hiperparámetros del entrenamiento:
        *   Número de épocas.
        *   Tasa de aprendizaje.
    *   Botón para iniciar el proceso de entrenamiento (backpropagation con descenso de gradiente).
*   **Predicción**:
    *   Una vez entrenada la red, se pueden ingresar nuevos valores de entrada para obtener una predicción.
    *   La salida de la red se muestra en la interfaz.
*   **Interfaz de Usuario Clara**:
    *   Layout de dos paneles:
        *   **Panel Izquierdo**: Contiene todos los controles para configurar la red, ingresar datos de entrenamiento y definir parámetros de entrenamiento.
        *   **Panel Derecho**: Muestra la sección para probar la red entrenada (entrada y predicción) y el dibujo SVG de la red neuronal.
*   **Tecnología Pura**:
    *   Construido con HTML, CSS y JavaScript (Vanilla JS), sin dependencias externas o frameworks.

## Cómo Usar

1.  **Abrir la Aplicación**:
    *   Descarga los archivos (`index.html`, `style.css`, `script.js`).
    *   Abre el archivo `index.html` en cualquier navegador web moderno.
2.  **Configurar la Arquitectura de la Red**:
    *   Utiliza los cuatro controles deslizantes en el panel izquierdo ("Configuración de Red") para definir el número de entradas, capas ocultas, neuronas por capa oculta y salidas.
    *   Observa cómo el dibujo de la red en el panel derecho se actualiza instantáneamente.
3.  **Ingresar Datos de Entrenamiento**:
    *   En la sección "Datos de Entrenamiento" (panel izquierdo), introduce tus datos:
        *   **Entradas**: Cada línea representa una muestra de entrada. Los valores dentro de una muestra deben estar separados por comas (ej., `0.1,0.2,0.3`). El número de valores debe coincidir con el "Número de Entradas" configurado.
        *   **Salidas**: Cada línea representa la salida deseada para la muestra de entrada correspondiente. Formato similar (ej., `0.9,0.1`). El número de valores debe coincidir con el "Número de Salidas".
4.  **Establecer Parámetros de Entrenamiento**:
    *   En "Parámetros de Entrenamiento" (panel izquierdo), define:
        *   **Épocas**: El número de veces que el conjunto de datos de entrenamiento se usará para ajustar los pesos.
        *   **Tasa de Aprendizaje**: Controla qué tan grandes son los ajustes a los pesos en cada iteración.
5.  **Entrenar la Red**:
    *   Pulsa el botón "Entrenar Red".
    *   El botón mostrará el progreso. La visualización de los pesos (colores/grosores de las conexiones) se actualizará al inicio (pesos aleatorios) y al final del entrenamiento.
    *   Una alerta notificará cuando el entrenamiento haya finalizado.
6.  **Probar la Red Entrenada**:
    *   En la sección "Probar Red Entrenada" (panel derecho, encima del dibujo de la red), ingresa un nuevo conjunto de valores de entrada (separados por comas).
    *   Pulsa el botón "Predecir".
    *   La "Salida de la Red" mostrará los valores predichos por la red neuronal entrenada.

## Tecnologías Utilizadas

*   **HTML5**: Para la estructura de la página.
*   **CSS3**: Para los estilos y el layout (Flexbox).
*   **JavaScript (ES6+)**: Para toda la lógica de la aplicación, incluyendo:
    *   Manipulación del DOM.
    *   Dibujo SVG dinámico.
    *   Implementación de la red neuronal (forward propagation, backpropagation).
    *   Manejo de eventos e interacciones.

## Posibles Mejoras Futuras

*   Visualización de los valores de los biases de las neuronas.
*   Opción de elegir diferentes funciones de activación (ej., ReLU, Tanh).
*   Guardar y cargar modelos de red entrenados (pesos y arquitectura).
*   Gráficas de error durante el entrenamiento.
*   Visualización de las activaciones de las neuronas.
*   Conjuntos de datos de ejemplo precargados.
*   Mejoras en la interfaz de usuario y la experiencia de usuario.
*   Optimización del rendimiento para redes más grandes o entrenamientos más largos.

---

Hecho con fines educativos para demostrar el funcionamiento interno de una red neuronal.
