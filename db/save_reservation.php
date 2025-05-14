<?php
// Incluir archivo de configuración
require_once 'config.php';

// Iniciar sesión
session_start();

// Inicializar respuesta
$response = array('success' => false, 'message' => '');

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener datos del formulario
    $nombre = trim($_POST['nombre'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $telefono = trim($_POST['telefono'] ?? '');
    $tipo_evento = trim($_POST['tipo_evento'] ?? '');
    $fecha = trim($_POST['fecha'] ?? '');
    $hora = trim($_POST['hora'] ?? '');
    $invitados = intval($_POST['invitados'] ?? 0);
    $presupuesto = trim($_POST['presupuesto'] ?? '');
    $mensaje = trim($_POST['mensaje'] ?? '');
    
    // Obtener ID de usuario si está logueado
    $usuario_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    
    // Validar datos
    if (empty($nombre) || empty($email) || empty($telefono) || empty($tipo_evento) || 
        empty($fecha) || empty($hora) || $invitados <= 0) {
        $response['message'] = 'Por favor, complete todos los campos requeridos.';
    } else {
        try {
            // Insertar reserva
            $stmt = $conn->prepare("INSERT INTO reservas (usuario_id, nombre, email, telefono, tipo_evento, fecha, hora, invitados, presupuesto, mensaje) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $result = $stmt->execute([$usuario_id, $nombre, $email, $telefono, $tipo_evento, $fecha, $hora, $invitados, $presupuesto, $mensaje]);
            
            if ($result) {
                $response['success'] = true;
                $response['message'] = 'Reserva realizada con éxito.';
                $response['reservation_id'] = $conn->lastInsertId();
            } else {
                $response['message'] = 'Error al realizar la reserva. Por favor, inténtelo de nuevo.';
            }
        } catch (PDOException $e) {
            $response['message'] = 'Error del servidor: ' . $e->getMessage();
        }
    }
}

// Devolver respuesta como JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
