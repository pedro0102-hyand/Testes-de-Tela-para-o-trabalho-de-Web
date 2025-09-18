document.addEventListener("DOMContentLoaded", () => {
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal-final');
    const totalElement = document.getElementById('total-final');
    const finalizarButton = document.getElementById('finalizar-pedido');
    const cartCountElement = document.getElementById('cart-count');
    const notificationMessage = document.getElementById('notification-message');
    
    const SHIPPING_COST = 20.00;

    // Função para obter o carrinho do localStorage (simulação com dados em memória)
    function getCart() {
        // Como não podemos usar localStorage, vamos simular com dados de exemplo
        // Em um ambiente real, isso viria do localStorage
        const simulatedCart = [
            {
                id: 1,
                name: "Camisa Real Madrid 23/24",
                price: 350.00,
                image: "https://placehold.co/600x400/003366/ffffff?text=Real+Madrid",
                quantity: 1
            },
            {
                id: 2,
                name: "Caneca Man City",
                price: 45.00,
                image: "https://placehold.co/600x400/87CEEB/000000?text=Caneca+Man+City",
                quantity: 2
            }
        ];
        return simulatedCart;
    }

    // Renderiza os itens do pedido
    function renderOrderItems() {
        const cart = getCart();
        orderItemsContainer.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const orderItemHTML = `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="order-item-info">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-quantity">Quantidade: ${item.quantity}</div>
                        <div class="order-item-price">R$ ${itemTotal.toFixed(2).replace('.', ',')}</div>
                    </div>
                </div>
            `;
            orderItemsContainer.insertAdjacentHTML('beforeend', orderItemHTML);
        });

        // Atualiza os totais
        const total = subtotal + SHIPPING_COST;
        subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        
        // Atualiza contador do carrinho
        cartCountElement.textContent = cart.length;
    }

    // Controla a exibição dos dados do cartão
    document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const dadosCartao = document.getElementById('dados-cartao');
            if (radio.value === 'cartao') {
                dadosCartao.classList.remove('hidden');
            } else {
                dadosCartao.classList.add('hidden');
            }
        });
    });

    // Formatação de campos
    function formatCPF(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    function formatTelefone(value) {
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

    function formatCardNumber(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{4})(\d)/, '$1 $2')
            .replace(/(\d{4})(\d)/, '$1 $2')
            .replace(/(\d{4})(\d)/, '$1 $2');
    }

    function formatValidade(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1/$2');
    }

    // Aplica formatação aos campos
    document.getElementById('cpf').addEventListener('input', (e) => {
        e.target.value = formatCPF(e.target.value);
    });

    document.getElementById('telefone').addEventListener('input', (e) => {
        e.target.value = formatTelefone(e.target.value);
    });

    document.getElementById('cep').addEventListener('input', (e) => {
        e.target.value = formatCEP(e.target.value);
    });

    document.getElementById('numero-cartao').addEventListener('input', (e) => {
        e.target.value = formatCardNumber(e.target.value);
    });

    document.getElementById('validade').addEventListener('input', (e) => {
        e.target.value = formatValidade(e.target.value);
    });

    document.getElementById('cvv').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });

    // Validação de campos
    function validateField(field, errorMessage) {
        const value = field.value.trim();
        let isValid = true;
        
        // Remove classes de erro anteriores
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Validações específicas
        if (field.required && !value) {
            isValid = false;
        } else if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
            errorMessage = 'E-mail inválido';
        } else if (field.id === 'cpf' && value && !isValidCPF(value)) {
            isValid = false;
            errorMessage = 'CPF inválido';
        }

        if (!isValid) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        }

        return isValid;
    }

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function isValidCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        return cpf.length === 11;
    }

    // Validação do formulário
    function validateForm() {
        const requiredFields = [
            { field: document.getElementById('nome'), message: 'Nome é obrigatório' },
            { field: document.getElementById('cpf'), message: 'CPF é obrigatório' },
            { field: document.getElementById('email'), message: 'E-mail é obrigatório' },
            { field: document.getElementById('telefone'), message: 'Telefone é obrigatório' },
            { field: document.getElementById('cep'), message: 'CEP é obrigatório' },
            { field: document.getElementById('numero'), message: 'Número é obrigatório' },
            { field: document.getElementById('rua'), message: 'Rua é obrigatória' },
            { field: document.getElementById('bairro'), message: 'Bairro é obrigatório' },
            { field: document.getElementById('cidade'), message: 'Cidade é obrigatória' }
        ];

        let isFormValid = true;

        // Valida campos básicos
        requiredFields.forEach(({ field, message }) => {
            if (!validateField(field, message)) {
                isFormValid = false;
            }
        });

        // Valida forma de pagamento
        const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked');
        if (!pagamentoSelecionado) {
            showNotification('Selecione uma forma de pagamento', 'error');
            isFormValid = false;
        }

        // Valida dados do cartão se cartão foi selecionado
        if (pagamentoSelecionado && pagamentoSelecionado.value === 'cartao') {
            const cartaoFields = [
                { field: document.getElementById('numero-cartao'), message: 'Número do cartão é obrigatório' },
                { field: document.getElementById('nome-cartao'), message: 'Nome no cartão é obrigatório' },
                { field: document.getElementById('validade'), message: 'Validade é obrigatória' },
                { field: document.getElementById('cvv'), message: 'CVV é obrigatório' }
            ];

            cartaoFields.forEach(({ field, message }) => {
                if (!validateField(field, message)) {
                    isFormValid = false;
                }
            });
        }

        return isFormValid;
    }

    // Função para exibir notificação
    function showNotification(message, type = 'success') {
        notificationMessage.textContent = message;
        notificationMessage.className = `fixed top-5 right-5 z-50 p-4 text-white font-semibold rounded-lg shadow-lg opacity-100 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`;
        
        setTimeout(() => {
            notificationMessage.classList.add('opacity-0', 'pointer-events-none');
        }, 3000);
    }

    // Simula o processamento do pedido
    function processOrder(formData) {
        return new Promise((resolve) => {
            // Simula tempo de processamento
            setTimeout(() => {
                console.log('Pedido processado:', formData);
                resolve({ success: true, orderId: Math.floor(Math.random() * 10000) });
            }, 2000);
        });
    }

    // Finalizar pedido
    finalizarButton.addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Desabilita o botão e mostra loading
        finalizarButton.disabled = true;
        finalizarButton.classList.add('loading');

        try {
            // Coleta dados do formulário
            const formData = {
                cliente: {
                    nome: document.getElementById('nome').value,
                    cpf: document.getElementById('cpf').value,
                    email: document.getElementById('email').value,
                    telefone: document.getElementById('telefone').value
                },
                endereco: {
                    cep: document.getElementById('cep').value,
                    rua: document.getElementById('rua').value,
                    numero: document.getElementById('numero').value,
                    bairro: document.getElementById('bairro').value,
                    cidade: document.getElementById('cidade').value,
                    complemento: document.getElementById('complemento').value
                },
                pagamento: {
                    tipo: document.querySelector('input[name="pagamento"]:checked').value
                },
                itens: getCart(),
                total: parseFloat(totalElement.textContent.replace('R$ ', '').replace(',', '.'))
            };

            // Adiciona dados do cartão se necessário
            if (formData.pagamento.tipo === 'cartao') {
                formData.pagamento.cartao = {
                    numero: document.getElementById('numero-cartao').value,
                    nome: document.getElementById('nome-cartao').value,
                    validade: document.getElementById('validade').value,
                    cvv: document.getElementById('cvv').value,
                    parcelas: document.getElementById('parcelas').value
                };
            }

            // Processa o pedido
            const result = await processOrder(formData);
            
            if (result.success) {
                showNotification('Pedido realizado com sucesso!');
                
                // Limpa o carrinho (em ambiente real, limparia o localStorage)
                // localStorage.removeItem('cartItems');
                
                // Redireciona após sucesso
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 2000);
            }
        } catch (error) {
            console.error('Erro ao processar pedido:', error);
            showNotification('Erro ao processar pedido. Tente novamente.', 'error');
        } finally {
            // Reabilita o botão
            finalizarButton.disabled = false;
            finalizarButton.classList.remove('loading');
        }
    });

    // Busca endereço por CEP (simulado)
    document.getElementById('cep').addEventListener('blur', async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        
        if (cep.length === 8) {
            // Simula busca de endereço por CEP
            // Em ambiente real, usaria uma API como ViaCEP
            setTimeout(() => {
                document.getElementById('rua').value = "Rua Exemplo";
                document.getElementById('bairro').value = "Centro";
                document.getElementById('cidade').value = "Nova Iguaçu";
            }, 500);
        }
    });

    // Inicializa a página
    renderOrderItems();
});