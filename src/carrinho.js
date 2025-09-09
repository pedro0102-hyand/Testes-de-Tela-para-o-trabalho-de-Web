document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const notificationMessage = document.getElementById('notification-message');
  
    const SHIPPING_COST = 20.00;
  
    // Função para obter o carrinho do localStorage
    function getCart() {
      try {
        const cart = localStorage.getItem('cartItems');
        return cart ? JSON.parse(cart) : [];
      } catch (e) {
        console.error("Falha ao carregar o carrinho do localStorage", e);
        return [];
      }
    }
  
    // Função para salvar o carrinho no localStorage
    function saveCart(cart) {
      try {
        localStorage.setItem('cartItems', JSON.stringify(cart));
      } catch (e) {
        console.error("Falha ao salvar o carrinho no localStorage", e);
      }
    }
  
    // Renderiza os itens do carrinho na página
    function renderCart() {
      const cart = getCart();
      cartItemsContainer.innerHTML = '';
      let subtotal = 0;
  
      if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
      } else {
        emptyCartMessage.classList.add('hidden');
        cart.forEach(item => {
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;
          
          const cartItemHTML = `
            <div class="cart-item">
              <img src="${item.image}" alt="" class="cart-item-image">
              <div class="flex-1 flex flex-col md:flex-row items-center justify-between ml-4">
                <div class="mb-2 md:mb-0">
                  <h3 class="text-lg font-semibold text-gray-800">${item.name}</h3>
                  <p class="text-gray-600">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="quantity-control">
                  <button data-id="${item.id}" data-action="decrease">-</button>
                  <span class="mx-2">${item.quantity}</span>
                  <button data-id="${item.id}" data-action="increase">+</button>
                </div>
                <div class="text-right mt-2 md:mt-0">
                  <span class="text-xl font-bold text-gray-800">R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
                  <button data-id="${item.id}" data-action="remove" class="ml-4 text-red-500 hover:text-red-700 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          `;
          cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });
      }
  
      // Atualiza os valores do resumo
      const total = subtotal + SHIPPING_COST;
      subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
      totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
  
    // Lida com cliques nos botões do carrinho
    cartItemsContainer.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;
  
      const productId = parseInt(button.dataset.id);
      const action = button.dataset.action;
      let cart = getCart();
      const itemIndex = cart.findIndex(item => item.id === productId);
      
      if (itemIndex > -1) {
        if (action === 'increase') {
          cart[itemIndex].quantity++;
        } else if (action === 'decrease') {
          cart[itemIndex].quantity--;
          if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
            showNotification("Produto removido do carrinho!");
          }
        } else if (action === 'remove') {
          cart.splice(itemIndex, 1);
          showNotification("Produto removido do carrinho!");
        }
      }
      
      saveCart(cart);
      renderCart();
    });
  
    // Função para exibir a notificação
    function showNotification(message) {
      notificationMessage.textContent = message;
      notificationMessage.classList.remove('opacity-0', 'pointer-events-none');
      notificationMessage.classList.add('opacity-100');
      
      setTimeout(() => {
        notificationMessage.classList.remove('opacity-100');
        notificationMessage.classList.add('opacity-0', 'pointer-events-none');
      }, 3000);
    }
  
    // Renderiza o carrinho ao carregar a página
    renderCart();
  });