document.addEventListener("DOMContentLoaded", () => {
    // Contador de itens no carrinho
    let cartCount = 0;
    const cartCountElement = document.getElementById('cart-count');
    const notificationMessage = document.getElementById('notification-message');
  
    // Adiciona um listener para cada botão de 'adicionar ao carrinho'
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
        cartCount++;
        cartCountElement.textContent = cartCount;
        
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
    
});