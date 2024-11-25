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


console.clear();

const { gsap, imagesLoaded } = window;

const buttons = {
	prev: document.querySelector(".btn--left"),
	next: document.querySelector(".btn--right"),
};
const cardsContainerEl = document.querySelector(".cards__wrapper");
const appBgContainerEl = document.querySelector(".app__bg");

const cardInfosContainerEl = document.querySelector(".info__wrapper");

buttons.next.addEventListener("click", () => swapCards("right"));

buttons.prev.addEventListener("click", () => swapCards("left"));

function swapCards(direction) {
	const currentCardEl = cardsContainerEl.querySelector(".current--card");
	const previousCardEl = cardsContainerEl.querySelector(".previous--card");
	const nextCardEl = cardsContainerEl.querySelector(".next--card");

	const currentBgImageEl = appBgContainerEl.querySelector(".current--image");
	const previousBgImageEl = appBgContainerEl.querySelector(".previous--image");
	const nextBgImageEl = appBgContainerEl.querySelector(".next--image");

	changeInfo(direction);
	swapCardsClass();

	removeCardEvents(currentCardEl);

	function swapCardsClass() {
		currentCardEl.classList.remove("current--card");
		previousCardEl.classList.remove("previous--card");
		nextCardEl.classList.remove("next--card");

		currentBgImageEl.classList.remove("current--image");
		previousBgImageEl.classList.remove("previous--image");
		nextBgImageEl.classList.remove("next--image");

		currentCardEl.style.zIndex = "50";
		currentBgImageEl.style.zIndex = "-2";

		if (direction === "right") {
			previousCardEl.style.zIndex = "20";
			nextCardEl.style.zIndex = "30";

			nextBgImageEl.style.zIndex = "-1";

			currentCardEl.classList.add("previous--card");
			previousCardEl.classList.add("next--card");
			nextCardEl.classList.add("current--card");

			currentBgImageEl.classList.add("previous--image");
			previousBgImageEl.classList.add("next--image");
			nextBgImageEl.classList.add("current--image");
		} else if (direction === "left") {
			previousCardEl.style.zIndex = "30";
			nextCardEl.style.zIndex = "20";

			previousBgImageEl.style.zIndex = "-1";

			currentCardEl.classList.add("next--card");
			previousCardEl.classList.add("current--card");
			nextCardEl.classList.add("previous--card");

			currentBgImageEl.classList.add("next--image");
			previousBgImageEl.classList.add("current--image");
			nextBgImageEl.classList.add("previous--image");
		}
	}
}

function changeInfo(direction) {
	let currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
	let previousInfoEl = cardInfosContainerEl.querySelector(".previous--info");
	let nextInfoEl = cardInfosContainerEl.querySelector(".next--info");

	gsap.timeline()
		.to([buttons.prev, buttons.next], {
		duration: 0.2,
		opacity: 0.5,
		pointerEvents: "none",
	})
		.to(
		currentInfoEl.querySelectorAll(".text"),
		{
			duration: 0.4,
			stagger: 0.1,
			translateY: "-120px",
			opacity: 0,
		},
		"-="
	)
		.call(() => {
		swapInfosClass(direction);
	})
		.call(() => initCardEvents())
		.fromTo(
		direction === "right"
		? nextInfoEl.querySelectorAll(".text")
		: previousInfoEl.querySelectorAll(".text"),
		{
			opacity: 0,
			translateY: "40px",
		},
		{
			duration: 0.4,
			stagger: 0.1,
			translateY: "0px",
			opacity: 1,
		}
	)
		.to([buttons.prev, buttons.next], {
		duration: 0.2,
		opacity: 1,
		pointerEvents: "all",
	});

	function swapInfosClass() {
		currentInfoEl.classList.remove("current--info");
		previousInfoEl.classList.remove("previous--info");
		nextInfoEl.classList.remove("next--info");

		if (direction === "right") {
			currentInfoEl.classList.add("previous--info");
			nextInfoEl.classList.add("current--info");
			previousInfoEl.classList.add("next--info");
		} else if (direction === "left") {
			currentInfoEl.classList.add("next--info");
			nextInfoEl.classList.add("previous--info");
			previousInfoEl.classList.add("current--info");
		}
	}
}

function updateCard(e) {
	const card = e.currentTarget;
	const box = card.getBoundingClientRect();
	const centerPosition = {
		x: box.left + box.width / 2,
		y: box.top + box.height / 2,
	};
	let angle = Math.atan2(e.pageX - centerPosition.x, 0) * (35 / Math.PI);
	gsap.set(card, {
		"--current-card-rotation-offset": `${angle}deg`,
	});
	const currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
	gsap.set(currentInfoEl, {
		rotateY: `${angle}deg`,
	});
}

function resetCardTransforms(e) {
	const card = e.currentTarget;
	const currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
	gsap.set(card, {
		"--current-card-rotation-offset": 0,
	});
	gsap.set(currentInfoEl, {
		rotateY: 0,
	});
}

function initCardEvents() {
	const currentCardEl = cardsContainerEl.querySelector(".current--card");
	currentCardEl.addEventListener("pointermove", updateCard);
	currentCardEl.addEventListener("pointerout", (e) => {
		resetCardTransforms(e);
	});
}

initCardEvents();

function removeCardEvents(card) {
	card.removeEventListener("pointermove", updateCard);
}

function init() {

	let tl = gsap.timeline();

	tl.to(cardsContainerEl.children, {
		delay: 0.15,
		duration: 0.5,
		stagger: {
			ease: "power4.inOut",
			from: "right",
			amount: 0.1,
		},
		"--card-translateY-offset": "0%",
	})
		.to(cardInfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
		delay: 0.5,
		duration: 0.4,
		stagger: 0.1,
		opacity: 1,
		translateY: 0,
	})
		.to(
		[buttons.prev, buttons.next],
		{
			duration: 0.4,
			opacity: 1,
			pointerEvents: "all",
		},
		"-=0.4"
	);
}

const waitForImages = () => {
	const images = [...document.querySelectorAll("img")];
	const totalImages = images.length;
	let loadedImages = 0;
	const loaderEl = document.querySelector(".loader span");

	gsap.set(cardsContainerEl.children, {
		"--card-translateY-offset": "100vh",
	});
	gsap.set(cardInfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
		translateY: "40px",
		opacity: 0,
	});
	gsap.set([buttons.prev, buttons.next], {
		pointerEvents: "none",
		opacity: "0",
	});

	images.forEach((image) => {
		imagesLoaded(image, (instance) => {
			if (instance.isComplete) {
				loadedImages++;
				let loadProgress = loadedImages / totalImages;

				gsap.to(loaderEl, {
					duration: 1,
					scaleX: loadProgress,
					backgroundColor: `hsl(${loadProgress * 120}, 100%, 50%`,
				});

				if (totalImages == loadedImages) {
					gsap.timeline()
						.to(".loading__wrapper", {
						duration: 0.8,
						opacity: 0,
						pointerEvents: "none",
					})
						.call(() => init());
				}
			}
		});
	});
};

waitForImages();

const addToCartButton = document.querySelector('.add-to-cart');
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartCountDisplay = document.querySelector('.cart-count');
        const closeCartButton = document.getElementById('close-cart');
        const checkoutButton = document.getElementById('checkout');
        const shoppingCart = document.getElementById('shopping-cart');
        const cartIcon = document.getElementById('cart-icon');

        // Initialize cart count and items
        let cartCount = 0;

        // Add functionality to 'Add to Cart' button
        addToCartButton.addEventListener('click', () => {
            cartCount++;
            const itemName = (`Item ${cartCount}`);
            updateCartCount();
            addCartItem(itemName);
            openCart();
        });

        // Function to update cart count in the icon
        function updateCartCount() {
            cartCountDisplay.textContent = cartCount;
        }

        // Function to add items to the cart
        function addCartItem(itemName) {
            const itemElement = document.createElement('div');
            itemElement.textContent = itemName;
            itemElement.style.marginBottom = '10px';
            cartItemsContainer.appendChild(itemElement);
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
                alert(`Checking out ${cartCount} items.`);
                // Clear the cart after checkout
                cartItemsContainer.innerHTML = '';
                cartCount = 0;
                updateCartCount();
                shoppingCart.classList.remove('active');
            } else {
                alert(`Your cart is empty!`);
            }
        });

		
