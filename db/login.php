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
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    // Validar datos
    if (empty($email) || empty($password)) {
        $response['message'] = 'Por favor, complete todos los campos.';
    } else {
        try {
            // Buscar usuario por correo electrónico
            $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($password, $user['password'])) {
                // Iniciar sesión
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['nombre'];
                $_SESSION['user_email'] = $user['email'];
                
                $response['success'] = true;
                $response['message'] = 'Inicio de sesión exitoso.';
                $response['user'] = array(
                    'id' => $user['id'],
                    'nombre' => $user['nombre'],
                    'email' => $user['email']
                );
            } else {
                $response['message'] = 'Correo electrónico o contraseña incorrectos.';
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
