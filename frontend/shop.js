document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
  });
  
  function fetchProducts() {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(products => {
        const productsContainer = document.getElementById('products-container');
  
        productsContainer.innerHTML = ''; // Clear previous products if any
  
        // Loop through each product and display it
        products.forEach(product => {
          const card = document.createElement('div');
          card.classList.add('card');
          
          card.innerHTML = `
            <img src="images/${product.image_url}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            <p>${product.description}</p>
            <button class="buy-btn" onclick="addToCart(${product.product_id})" ${product.quantity <= 0 ? 'disabled' : ''}>
              ${product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          `;
  
          productsContainer.appendChild(card);
        });
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }
  
  function addToCart(productId) {
    fetch(`http://localhost:5000/api/products/buy/${productId}`, {
      method: 'POST'
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || 'Failed to buy product');
        });
      }
      return response.json();
    })
    .then(data => {
      alert('Product purchased successfully!');
      console.log(data.message);
      location.reload(); // Refresh the page to update the product list
    })
    .catch(error => {
      alert(error.message);
      console.error('Error purchasing product:', error);
    });
  }
  