<?php
// Incluir archivo de configuración
require_once 'config.php';

// Inicializar respuesta
$response = array('success' => false, 'message' => '');

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener datos del formulario
    $nombre = trim($_POST['nombre'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    
    // Validar datos
    if (empty($nombre) || empty($email) || empty($password) || empty($confirm_password)) {
        $response['message'] = 'Por favor, complete todos los campos.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Por favor, ingrese un correo electrónico válido.';
    } elseif (strlen($password) < 6) {
        $response['message'] = 'La contraseña debe tener al menos 6 caracteres.';
    } elseif ($password !== $confirm_password) {
        $response['message'] = 'Las contraseñas no coinciden.';
    } else {
        try {
            // Verificar si el correo electrónico ya existe
            $stmt = $conn->prepare("SELECT COUNT(*) FROM usuarios WHERE email = ?");
            $stmt->execute([$email]);
            $count = $stmt->fetchColumn();
            
            if ($count > 0) {
                $response['message'] = 'Este correo electrónico ya está registrado.';
            } else {
                // Hash de la contraseña
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                
                // Insertar nuevo usuario
                $stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)");
                $result = $stmt->execute([$nombre, $email, $hashed_password]);
                
                if ($result) {
                    $response['success'] = true;
                    $response['message'] = 'Registro exitoso. Ahora puede iniciar sesión.';
                } else {
                    $response['message'] = 'Error al registrar el usuario. Por favor, inténtelo de nuevo.';
                }
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
