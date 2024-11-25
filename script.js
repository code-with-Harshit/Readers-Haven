document.getElementById('search-box').addEventListener('input', async (e) => {
	const query = e.target.value.trim();
	if (query.length > 2) {
	  try {
		const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
		const data = await response.json();
		displayResults(data.items || []);
	  } catch (error) {
		console.error("Error fetching data:", error);
	  }
	}
  });

  function displayResults(books) {
	const resultContainer = document.getElementById('result-container');
	resultContainer.innerHTML = books.map(book => {
	  const title = book.volumeInfo.title || "No Title";
	  const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : "No Authors";
	  const thumbnail = book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150";
	  const bookId = book.id;

	  return `
		<div class="book-result" data-id="${bookId}">
		  <img src="${thumbnail}" alt="${title}">
		  <h3>${title}</h3>
		  <p>${authors}</p>
		</div>`;
	}).join('');

	// Add click listeners to each book card
	document.querySelectorAll('.book-result').forEach(bookCard => {
	  bookCard.addEventListener('click', () => {
		const bookId = bookCard.getAttribute('data-id');
		window.open(`bookDetails.html?bookId=${bookId}`, '_parent');
	  });
	});
  }

document.addEventListener('click', (event) => {
    const searchBox = document.getElementById('search-box');
    const resultContainer = document.getElementById('result-container');
    if (!searchBox.contains(event.target) && !resultContainer.contains(event.target)) {
      resultContainer.style.display = 'none'; // Hide the dropdown
    } else {
      resultContainer.style.display = 'block'; // Show the dropdown
    }
  });
  
  function getBookName(button) {
    // Select the book name element and the search box
	const box = button.closest(".box"); 
    // Find the book name within this specific box
    const bookNameElement = box.querySelector(".book-name");
	const searchBox = document.getElementById("search-box");
    
    if (bookNameElement && searchBox) {
        // Get the book name text
        const bookNameText = bookNameElement.textContent || bookNameElement.innerText;

        // Set the value of the search box to the book name
        searchBox.value = bookNameText;

        // Simulate an input event to trigger the search
        const inputEvent = new Event("input", { bubbles: true });
        searchBox.dispatchEvent(inputEvent);
    } else {
        console.error("Book name or search box not found.");
    }
}

const cartIconBtn = document.querySelector(".cartIcon-btn");
const cartItemsContainer = document.querySelector('#cart-items tbody');
const cartCountDisplay = document.querySelector('.cart-count');
const totalAmountDisplay = document.getElementById('total-amount');
const closeCartButton = document.getElementById('close-cart');
const checkoutButton = document.getElementById('checkout');
const shoppingCart = document.querySelector('.shopping-cart');
const cartIcon = document.getElementById('cart-icon');

// Initialize cart count and items
let cartCount = 0;
let totalAmount = 0;

// Add functionality to 'Add to Cart' button
cartIconBtn.addEventListener('click', () => {
    openCart();
});

cartIcon.addEventListener('click', () => {
    openCart();
});

// Function to update cart count in the icon
function updateCartCount() {
    cartCountDisplay.textContent = cartCount;
}

// Function to open the cart (slide in from the right)
function openCart() {
    shoppingCart.classList.add('active');
}

// Add functionality to 'Close Cart' button
closeCartButton.addEventListener('click', () => {
    shoppingCart.classList.remove('active');
});

// Add functionality to 'Checkout' button
checkoutButton.addEventListener('click', () => {
    if (cartCount > 0) {
        alert(`Checking out ${cartCount} items for a total of $${totalAmount.toFixed(2)}.`);
        // Clear the cart after checkout
        cartItemsContainer.innerHTML = '';
        cartCount = 0;
        totalAmount = 0;
        updateCartCount();
        totalAmountDisplay.textContent = '0.00';
        shoppingCart.classList.remove('active');
    } else {
        alert(`Your cart is empty!`);
    }
});

// Function to add an item to the cart
function addCartItem(itemName, itemPrice) {
    const existingRow = Array.from(cartItemsContainer.rows).find(row => row.cells[0].textContent === itemName);
    
    if (existingRow) {
        // If the item already exists, increase the quantity
        const quantityCell = existingRow.cells[2];
        const totalCell = existingRow.cells[3];
        
        let quantity = parseInt(quantityCell.textContent) + 1;
        quantityCell.textContent = quantity;
        
        // Update the total price for this item
        const total = (itemPrice * quantity).toFixed(2);
        totalCell.textContent = total;
        
    } else {
        // If the item doesn't exist, create a new row
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${itemName}</td>
            <td>$${itemPrice.toFixed(2)}</td>
            <td>1</td>
            <td>$${itemPrice.toFixed(2)}</td>
        `;
        cartItemsContainer.appendChild(newRow);
    }

    // Update the total amount payable
    totalAmount += itemPrice;
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
}

// Wait for the DOM to load before adding event listeners to the 'Add to Cart' buttons
document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            // Use event.target to get the button that was clicked
            const featuredContent = event.target.closest('.featured-content');
            const itemName = featuredContent.querySelector('.book-name').textContent;
            const itemPrice = parseFloat(featuredContent.querySelector('.price').textContent.replace('$', '')); // Get the price without the dollar sign

            // Add the item to the cart
            addCartItem(itemName, itemPrice);

            // Update the cart count and open the cart
            cartCount++; // Increment cart count
            updateCartCount();
            openCart();
        });
    });
});
