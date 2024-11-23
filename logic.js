console.log('logic JS file is loaded');

let wishList = [];

let activeFeedControlButton = 'wish-list';

document.querySelector('#wish-list-button').addEventListener('click', () => {
    activeFeedControlButton = 'product-list';
    document.querySelector('#wish-list-button').style.display = 'none';
    document.querySelector('#product-list-button').style.display = 'block';
    renderWishList();
})

document.querySelector('#product-list-button').addEventListener('click', () => {
  activeFeedControlButton = 'wish-list';
  document.querySelector('#product-list-button').style.display = 'none';
  document.querySelector('#wish-list-button').style.display = 'block';
  renderProducts();
})

const addToWishList = (id) => {
  const product = data.find(product => product.id === id);
  wishList.push(product.id);
  const button = document.querySelector(`.add-to-list-button[data-id="${id}"]`);
  button.textContent = 'Додано до списку';
  button.disabled = true;
  console.log(wishList);
}

const deleteFromWishList = (id) => {
  wishList = wishList.filter(productId => productId !== id);
  console.log(wishList);
  renderWishList();
}

const renderProducts = () => {
    console.log('renderProducts function is called');
    
    const productFeed = document.querySelector('.product-feed');
    productFeed.innerHTML = '';

    fetch('./products.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            //now I need to render the products in the product-feed div
            const productFeed = document.querySelector('.product-feed');

            data.forEach(product => {
                const productCard = document.createElement('div')
                productCard.className = 'product-card'
                productCard.innerHTML = `
                <div class="image-container">
                    <img src="${product.imageUrl}" alt="${product.title}">
                    <span class="shop-label">${product.shop}</span>
                    <span class="price-overlay">${product.price} ${product.measureUnit}</span>
                </div>
                <div class="product-info">
                    <h2>${product.title}</h2>
                    <button class="add-to-list-button" 
                      data-id="${product.id}" 
                      ${wishList.includes(product.id) ? 'disabled' : ''}>
                      ${wishList.includes(product.id) ? 'Додано до списку' : 'Додати до списку'}
                    </button>
                </div>
                `

                productCard.querySelector('.add-to-list-button').addEventListener('click', () => {
                    addToWishList(product.id);
                })

                productFeed.appendChild(productCard)

              });
        })
        .catch(error => console.log(error));

    
        
}

const renderWishList = () => {
    console.log('showWishList function is called');
    //show only those products which IDs are in the `wishList` array
    const wishListFeed = document.querySelector('.product-feed');
    wishListFeed.innerHTML = '';
    
    wishList = wishList.filter(id => data.some(product => product.id === id));
    
    if (wishList.length === 0) {
      const message = document.createElement('p');
      message.textContent = 'Ви поки не додали продукти до списку покупок';
      wishListFeed.appendChild(message);
    } else {
      const wishListProducts = data.filter(product => wishList.includes(product.id));
      wishListProducts.forEach(product => {
        const productCard = document.createElement('div')
        productCard.className = 'product-card'
        productCard.innerHTML = `
        <div class="image-container">
          <img src="${product.imageUrl}" alt="${product.title}">
          <span class="shop-label">${product.shop}</span>
          <span class="price-overlay">${product.price} ${product.measureUnit}</span>
        </div>
        <div class="product-info">
          <h2>${product.title}</h2>
          <button class="remove-from-list-button" data-id="${product.id}">
            Видалити зі списку
          </button>
        </div>
        `

      productCard.querySelector('.remove-from-list-button').addEventListener('click', () => {
          deleteFromWishList(product.id);
      })
        wishListFeed.appendChild(productCard)
      });
    }

}

document.addEventListener('DOMContentLoaded', renderProducts);