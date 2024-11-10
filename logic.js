console.log('logic JS file is loaded');

const renderProducts = () => {
    console.log('renderProducts function is called');
    fetch('./products.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            //now I need to render the products in the product-feed div
            const productFeed = document.querySelector('.product-feed');
            data.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                <div class="image-container">
                    <img src="${product.imageUrl}" alt="${product.title}">
                    <span class="shop-label">${product.shop}</span>
                    <span class="price-overlay">${product.price}</span>
                </div>
                <div class="product-info">
                    <h2>${product.title}</h2>
                </div>
                `;
                productFeed.appendChild(productCard);
            });
        })
        .catch(error => console.log(error));   
}

document.addEventListener('DOMContentLoaded', renderProducts);