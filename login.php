<?php
// Retrieve form data
$username = $_POST['username'];
$password = $_POST['password'];

// Validate form data
$errors = [];

if (empty($username)) {
    $errors[] = "Username is required.";
}

if (empty($password)) {
    $errors[] = "Password is required.";
}

// If there are validation errors, display them
if (!empty($errors)) {
    foreach ($errors as $error) {
        echo "<p>$error</p>";
    }
} else {
    // If there are no errors, check if the username and password match
    $servername = "localhost";
    $dbusername = "root";
    $dbpassword = "";
    $dbname = "word_search";

    try {
        // Create a new PDO connection
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $dbusername, $dbpassword);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
        // Check if the username and password match
        $stmt = $conn->prepare("SELECT * FROM registered_users_db WHERE username = ? AND password = ?");
        $stmt->execute([$username, $password]);
        $user = $stmt->fetch();
    
        if ($user) {
            // Successful login, redirect to index1.html
            header("Location: levels.html");
            exit();
        } else {
            echo "<p>Invalid username or password. Please try again.</p>";
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
        // Close the database connection
        $conn = null;
    } finally {
        // Close the database connection
        $conn = null;
    }
}    
?>

