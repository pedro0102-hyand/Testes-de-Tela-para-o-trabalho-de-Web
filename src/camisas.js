document.addEventListener("DOMContentLoaded", () => {
    const cartCountElement = document.getElementById('cart-count');
    const notificationMessage = document.getElementById('notification-message');
  
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
  
    // Atualiza o contador de itens no cabeçalho
    function updateCartCount() {
      const cart = getCart();
      cartCountElement.textContent = cart.length;
    }
    
    // Adiciona um listener para cada botão de 'adicionar ao carrinho'
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        // Pega o card do produto
        const productCard = e.target.closest('.product-card');
        if (!productCard) return;
  
        const productName = productCard.querySelector('h3').textContent;
        const productPriceStr = productCard.querySelector('.text-green-600').textContent;
        const productPrice = parseFloat(productPriceStr.replace('R$', '').replace(',', '.').trim());
        const productImage = productCard.querySelector('img').src;
        
        let cart = getCart();
  
        // Verifica se o produto já está no carrinho
        const existingProduct = cart.find(item => item.name === productName);
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cart.push({
            id: Date.now(),
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
          });
        }
  
        saveCart(cart);
        updateCartCount();
        
        // Mostra a notificação de sucesso
        notificationMessage.classList.remove('opacity-0', 'pointer-events-none');
        notificationMessage.classList.add('opacity-100');
        
        // Oculta a notificação após 3 segundos
        setTimeout(() => {
          notificationMessage.classList.remove('opacity-100');
          notificationMessage.classList.add('opacity-0', 'pointer-events-none');
        }, 3000);
      });
    });
  
    // Atualiza o contador de carrinho ao carregar a página
    updateCartCount();
  });