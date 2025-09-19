document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const notificationMessage = document.getElementById("notification-message");
    const notificationText = document.getElementById("notification-text");

    // Elementos dos campos
    const cpfInput = document.getElementById("cpf");
    const phoneInput = document.getElementById("phone");
    const cepInput = document.getElementById("cep");
    const ruaInput = document.getElementById("rua");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    // Funções de formatação
    function formatCPF(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    function formatPhone(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
    }

    function formatCEP(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2');
    }

    // Aplicar formatação aos campos
    cpfInput.addEventListener('input', (e) => {
        e.target.value = formatCPF(e.target.value);
    });

    phoneInput.addEventListener('input', (e) => {
        e.target.value = formatPhone(e.target.value);
    });

    cepInput.addEventListener('input', (e) => {
        e.target.value = formatCEP(e.target.value);
    });

    // Buscar endereço por CEP (simulado)
    cepInput.addEventListener('blur', async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        
        if (cep.length === 8) {
            showNotification("Buscando endereço...", "success");
            
            // Simula busca de endereço por CEP
            // Em ambiente real, usaria uma API como ViaCEP
            setTimeout(() => {
                // Dados simulados
                const enderecos = {
                    "26000000": {
                        rua: "Rua Coronel Bernardino de Melo",
                        bairro: "Centro",
                        cidade: "Nova Iguaçu"
                    },
                    "26210000": {
                        rua: "Rua da Conceição",
                        bairro: "Centro",
                        cidade: "Nova Iguaçu"
                    },
                    "26220000": {
                        rua: "Rua Bernardino Bento",
                        bairro: "Centro",
                        cidade: "Nova Iguaçu"
                    }
                };

                const endereco = enderecos[cep] || {
                    rua: "Rua Exemplo",
                    bairro: "Centro",
                    cidade: "Nova Iguaçu"
                };

                ruaInput.value = endereco.rua;
                bairroInput.value = endereco.bairro;
                cidadeInput.value = endereco.cidade;

                hideNotification();
            }, 1000);
        }
    });

    // Validação em tempo real das senhas
    function validatePasswords() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (confirmPassword && password !== confirmPassword) {
            confirmPasswordInput.setCustomValidity("As senhas não coincidem");
            return false;
        } else {
            confirmPasswordInput.setCustomValidity("");
            return true;
        }
    }

    passwordInput.addEventListener('input', validatePasswords);
    confirmPasswordInput.addEventListener('input', validatePasswords);

    // Validação de CPF
    function isValidCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        
        let remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        
        remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    // Validação de email
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Função para mostrar notificação
    function showNotification(message, type = "success") {
        notificationText.textContent = message;
        notificationMessage.className = `notification ${type}`;
        notificationMessage.classList.remove('hidden');
    }

    // Função para ocultar notificação
    function hideNotification() {
        setTimeout(() => {
            notificationMessage.classList.add('hidden');
        }, 3000);
    }

    // Validação completa do formulário
    function validateForm() {
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const cpf = cpfInput.value;
        const phone = phoneInput.value;
        const birthDate = document.getElementById("birthDate").value;
        const cep = cepInput.value;
        const numero = document.getElementById("numero").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const terms = document.getElementById("terms").checked;

        // Validações
        if (!firstName || !lastName) {
            showNotification("Nome e sobrenome são obrigatórios", "error");
            return false;
        }

        if (!isValidEmail(email)) {
            showNotification("E-mail inválido", "error");
            return false;
        }

        if (!isValidCPF(cpf)) {
            showNotification("CPF inválido", "error");
            return false;
        }

        if (!phone || phone.length < 14) {
            showNotification("Telefone inválido", "error");
            return false;
        }

        if (!birthDate) {
            showNotification("Data de nascimento é obrigatória", "error");
            return false;
        }

        // Validar se é maior de idade
        const today = new Date();
        const birth = new Date(birthDate);
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        if (age < 18) {
            showNotification("É necessário ser maior de idade para se cadastrar", "error");
            return false;
        }

        if (!cep || cep.length < 9) {
            showNotification("CEP inválido", "error");
            return false;
        }

        if (!numero) {
            showNotification("Número do endereço é obrigatório", "error");
            return false;
        }

        if (!username || username.length < 3) {
            showNotification("Nome de usuário deve ter pelo menos 3 caracteres", "error");
            return false;
        }

        if (!password || password.length < 6) {
            showNotification("Senha deve ter pelo menos 6 caracteres", "error");
            return false;
        }

        if (password !== confirmPassword) {
            showNotification("As senhas não coincidem", "error");
            return false;
        }

        if (!terms) {
            showNotification("Você deve aceitar os termos de uso", "error");
            return false;
        }

        return true;
    }

    // Simular cadastro no servidor
    async function registerUser(userData) {
        return new Promise((resolve, reject) => {
            // Simula tempo de processamento
            setTimeout(() => {
                // Simula verificação se usuário já existe
                const existingUsers = ['admin', 'test', 'usuario'];
                
                if (existingUsers.includes(userData.username.toLowerCase())) {
                    reject(new Error("Nome de usuário já existe"));
                    return;
                }

                // Simula verificação se email já existe
                const existingEmails = ['admin@test.com', 'test@test.com'];
                
                if (existingEmails.includes(userData.email.toLowerCase())) {
                    reject(new Error("E-mail já cadastrado"));
                    return;
                }

                // Simula sucesso
                resolve({
                    success: true,
                    message: "Usuário cadastrado com sucesso!",
                    userId: Math.floor(Math.random() * 10000)
                });
            }, 2000);
        });
    }

    // Submissão do formulário
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            hideNotification();
            return;
        }

        // Desabilita o botão durante o processamento
        const submitButton = registerForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Criando conta...";

        try {
            // Coleta dados do formulário
            const formData = new FormData(registerForm);
            const userData = {
                firstName: document.getElementById("firstName").value.trim(),
                lastName: document.getElementById("lastName").value.trim(),
                email: document.getElementById("email").value.trim(),
                cpf: cpfInput.value,
                phone: phoneInput.value,
                birthDate: document.getElementById("birthDate").value,
                cep: cepInput.value,
                rua: ruaInput.value,
                bairro: bairroInput.value,
                cidade: cidadeInput.value,
                numero: document.getElementById("numero").value.trim(),
                complemento: document.getElementById("complemento").value.trim(),
                username: document.getElementById("username").value.trim(),
                password: passwordInput.value
            };

            // Simula envio para o servidor
            showNotification("Criando sua conta...", "success");
            
            const result = await registerUser(userData);
            
            showNotification("Conta criada com sucesso! Redirecionando...", "success");
            
            // Redireciona para a página de login após sucesso
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);

        } catch (error) {
            showNotification(error.message, "error");
            console.error("Erro no cadastro:", error);
        } finally {
            // Reabilita o botão
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            hideNotification();
        }
    });
});