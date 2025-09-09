// Script simples de validação
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
  
    if (user && pass) {
        alert("Login realizado com sucesso!");
        // Redireciona para a página principal
        window.location.href = "home.html";
      } else {
        alert("Por favor, preencha todos os campos.");
      }
    });
  