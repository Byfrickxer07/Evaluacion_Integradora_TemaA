# Eleganza Eventos - Sitio Web

Este repositorio contiene el código fuente para el sitio web de "Eleganza Eventos", un salón de eventos elegante y moderno. El sitio está desarrollado con HTML, CSS y JavaScript, utilizando Bootstrap 5 como framework principal.

## Funcionalidades Principales

### 1. Diseño Responsivo
- El sitio está completamente adaptado para dispositivos móviles y de escritorio
- Utiliza Bootstrap 5 para garantizar una experiencia fluida en cualquier tamaño de pantalla

### 2. Navegación Intuitiva
- Barra de navegación fija en la parte superior que permite acceder a todas las secciones
- Enlaces de navegación suave (smooth scrolling) para una mejor experiencia de usuario

### 3. Carrusel de Imágenes
- Presentación automática de imágenes en la sección principal (hero)
- Imágenes optimizadas para mostrar los espacios del salón de eventos

### 4. Galería de Imágenes con Filtros
- Galería interactiva que muestra diferentes tipos de eventos
- Filtros para categorizar por tipo de evento (Bodas, Cumpleaños)
- Integración con Lightbox para ver las imágenes en tamaño completo

### 5. Reproductor de Audio
- Música de fondo que se puede activar/desactivar
- Efectos de sonido al hacer clic en los botones

### 6. Modo Oscuro/Claro
- Opción para cambiar entre tema claro y oscuro
- La preferencia se guarda en localStorage para futuras visitas

### 7. Sistema de Reservas con IndexedDB
- Formulario completo para solicitar reservas de eventos
- Almacenamiento local de las reservas mediante IndexedDB
- Visualización de reservas guardadas en un modal
- Opción para cancelar reservas existentes

### 8. Integración con Google Maps
- Mapa interactivo que muestra la ubicación del salón de eventos
- Marcador personalizado con información adicional

## Cómo Clonar y Probar el Sitio

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Edge, etc.)
- Conexión a internet (para cargar las dependencias externas como Bootstrap, jQuery, etc.)

### Pasos para Clonar el Repositorio

1. Abre una terminal o línea de comandos
2. Ejecuta el siguiente comando para clonar el repositorio:
   ```
   git clone https://github.com/Byfrickxer07/Evaluacion_Integradora_TemaA.git
   ```
3. Navega al directorio del proyecto:
   ```
   cd Evaluacion_Integradora_TemaA
   ```

### Pasos para Ejecutar el Sitio

#### Método 1: Abrir Directamente
1. Navega a la carpeta donde clonaste el repositorio
2. Haz doble clic en el archivo `index.html`
3. El sitio se abrirá en tu navegador predeterminado

#### Método 2: Usando un Servidor Local
1. Si tienes Python instalado, puedes ejecutar un servidor local:
   - Para Python 3.x:
     ```
     python -m http.server
     ```
   - Para Python 2.x:
     ```
     python -m SimpleHTTPServer
     ```
2. Abre tu navegador y ve a `http://localhost:8000`

#### Método 3: Usando Visual Studio Code
1. Abre la carpeta del proyecto en Visual Studio Code
2. Instala la extensión "Live Server"
3. Haz clic derecho en el archivo `index.html` y selecciona "Open with Live Server"

## Funcionalidades Destacadas y Cómo Usarlas

### Sistema de Reservas
1. Ve a la sección "Reserva Tu Evento"
2. Completa el formulario con tus datos
3. Haz clic en "Enviar Solicitud"
4. Para ver tus reservas, haz clic en "Ver Mis Reservas"
5. Para cancelar una reserva, haz clic en el botón "Cancelar" junto a la reserva

### Cambio de Tema
- Haz clic en el ícono de luna/sol en la barra de navegación para cambiar entre tema claro y oscuro

### Control de Audio
- Haz clic en el ícono de volumen en la barra de navegación para activar/desactivar la música de fondo

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5
- jQuery
- Lightbox
- Google Maps API
- IndexedDB
- Font Awesome

## Notas Adicionales

- Las reservas se guardan localmente en el navegador utilizando IndexedDB
- El sitio no requiere conexión a un servidor backend para funcionar
- Las imágenes y archivos de audio están incluidos en el repositorio