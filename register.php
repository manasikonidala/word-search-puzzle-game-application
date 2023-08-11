<?php
// Retrieve form data
$name = $_POST['name'];
$email = $_POST['email'];
$username = $_POST['username'];
$password = $_POST['password'];

// Validate form data
$errors = [];

try {
    if (empty($name)) {
        $errors[] = "Name is required.";
    }

    if (empty($email)) {
        $errors[] = "Email is required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format.";
    }

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
        // If there are no errors, store user details in the database
        $servername = "localhost";
        $username1 = "root";
        $password1 = "";
        $dbname = "word_search";

        // Create a new PDO connection
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username1, $password1);

        // Prepare the SQL statement to check for existing username
        $stmt = $conn->prepare("SELECT * FROM registered_users_db WHERE username = ?");
        $stmt->execute([$username]);

        $existingUser = $stmt->fetch();

        if ($existingUser) {
            echo "<p>Username already exists. Please choose a different username.</p>";
        } else {
            // Insert user details into the database
            $stmt = $conn->prepare("INSERT INTO registered_users_db (name, email, username, password) VALUES (?, ?, ?, ?)");
            $stmt->execute([$name, $email, $username, $password]);
            // Display success message
            header("Location: login.html");
        }
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

// Close the database connection
$conn = null;
?>
