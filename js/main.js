// DOM Elements
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const brandFilter = document.getElementById('brandFilter');
const priceFilter = document.getElementById('priceFilter');
const resetBtn = document.getElementById('resetBtn');
const productCount = document.getElementById('productCount');
const noResults = document.getElementById('noResults');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCartModal = document.getElementById('closeCartModal');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutModal = document.getElementById('closeCheckoutModal');
const cancelCheckoutBtn = document.getElementById('cancelCheckoutBtn');
const checkoutForm = document.getElementById('checkoutForm');
const invoiceModal = document.getElementById('invoiceModal');
const closeInvoiceModal = document.getElementById('closeInvoiceModal');
const printInvoiceBtn = document.getElementById('printInvoiceBtn');
const newOrderBtn = document.getElementById('newOrderBtn');

// Product detail elements
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const modalMainImage = document.getElementById('modalMainImage');
const modalThumbnails = document.getElementById('modalThumbnails');
const modalFeatures = document.getElementById('modalFeatures');
const modalAdvantages = document.getElementById('modalAdvantages');
const modalBrochure = document.getElementById('modalBrochure');
const addToCartBtn = document.getElementById('addToCartBtn');
const productQty = document.getElementById('productQty');
const decreaseQty = document.getElementById('decreaseQty');
const increaseQty = document.getElementById('increaseQty');

// State
let filteredProducts = [...products];
let currentProduct = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search and filter
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    brandFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
    resetBtn.addEventListener('click', resetFilters);

    // Product modal
    closeModal.addEventListener('click', () => {
        productModal.classList.add('hidden');
    });

    // Cart modal
    cartBtn.addEventListener('click', () => {
        cartModal.classList.remove('hidden');
        cart.renderCart();
    });

    closeCartModal.addEventListener('click', () => {
        cartModal.classList.add('hidden');
    });

    clearCartBtn.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
            cart.clearCart();
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.items.length === 0) {
            alert('Keranjang belanja kosong!');
            return;
        }
        cartModal.classList.add('hidden');
        checkoutModal.classList.remove('hidden');
        updateOrderSummary();
    });

    // Checkout modal
    closeCheckoutModal.addEventListener('click', () => {
        checkoutModal.classList.add('hidden');
    });

    cancelCheckoutBtn.addEventListener('click', () => {
        checkoutModal.classList.add('hidden');
    });

    checkoutForm.addEventListener('submit', handleCheckout);

    // Invoice modal
    closeInvoiceModal.addEventListener('click', () => {
        invoiceModal.classList.add('hidden');
    });

    printInvoiceBtn.addEventListener('click', () => {
        invoice.printInvoice();
    });

    newOrderBtn.addEventListener('click', () => {
        invoiceModal.classList.add('hidden');
        cart.clearCart();
    });

    // Product quantity
    decreaseQty.addEventListener('click', () => {
        const currentValue = parseInt(productQty.value);
        if (currentValue > 1) {
            productQty.value = currentValue - 1;
        }
    });

    increaseQty.addEventListener('click', () => {
        const currentValue = parseInt(productQty.value);
        productQty.value = currentValue + 1;
    });

    // Add to cart
    addToCartBtn.addEventListener('click', () => {
        if (currentProduct) {
            const quantity = parseInt(productQty.value);
            cart.addItem(currentProduct, quantity);
            productModal.classList.add('hidden');
        }
    });

    // Close modals when clicking outside
    [productModal, cartModal, checkoutModal, invoiceModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

// Render products
function renderProducts() {
    productGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        noResults.classList.remove('hidden');
        productCount.textContent = '0';
        return;
    }
    
    noResults.classList.add('hidden');
    productCount.textContent = filteredProducts.length;
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer';
        productCard.onclick = () => showProductDetail(product);
        
        // Extract brand from product name
        const brandMatch = product.name.match(/(CABLE LINK|FALCOM|GLOBAL)/i);
        const brand = brandMatch ? brandMatch[0] : '';
        
        productCard.innerHTML = `
            <div class="h-48 bg-gray-200 flex items-center justify-center">
                <i class="fas fa-network-wired text-4xl text-gray-400"></i>
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        ${product.id.startsWith('fo-') ? 'Fiber Optik' : 'Kabel LAN'}
                    </span>
                    ${brand ? `<span class="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-800 rounded">${brand}</span>` : ''}
                </div>
                <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">${product.shortDescription}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-blue-600">${product.price}</span>
                    <button class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
}

// Filter products
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const brand = brandFilter.value;
    const priceRange = priceFilter.value;
    
    filteredProducts = products.filter(product => {
        // Search filter
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            product.shortDescription.toLowerCase().includes(searchTerm);
        
        // Category filter
        const matchesCategory = !category || product.id.startsWith(category);
        
        // Brand filter
        let matchesBrand = true;
        if (brand) {
            const brandName = brand.toLowerCase().replace('-', ' ');
            matchesBrand = product.name.toLowerCase().includes(brandName);
        }
        
        // Price filter
        let matchesPrice = true;
        if (priceRange) {
            const price = parseInt(product.price.replace(/[^\d]/g, ''));
            if (priceRange === 'low') {
                matchesPrice = price < 500000;
            } else if (priceRange === 'mid') {
                matchesPrice = price >= 500000 && price <= 800000;
            } else if (priceRange === 'high') {
                matchesPrice = price > 800000;
            }
        }
        
        return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });
    
    renderProducts();
}

// Reset filters
function resetFilters() {
    searchInput.value = '';
    categoryFilter.value = '';
    brandFilter.value = '';
    priceFilter.value = '';
    filteredProducts = [...products];
    renderProducts();
}

// Show product detail
function showProductDetail(product) {
    currentProduct = product;
    
    // Reset quantity
    productQty.value = 1;
    
    // Set modal content
    modalTitle.textContent = product.name;
    modalDescription.textContent = product.shortDescription;
    modalPrice.textContent = product.price;
    
    // Set main image (placeholder)
    modalMainImage.src = 'https://via.placeholder.com/600x400?text=Product+Image';
    
    // Set thumbnails (placeholders)
    modalThumbnails.innerHTML = '';
    
    // Add main image as first thumbnail
    const mainThumb = document.createElement('div');
    mainThumb.className = 'thumbnail active border-2 border-blue-500 rounded cursor-pointer';
    mainThumb.innerHTML = `<img src="https://via.placeholder.com/100x100?text=Main" class="w-full h-full object-cover rounded">`;
    mainThumb.onclick = () => {
        modalMainImage.src = 'https://via.placeholder.com/600x400?text=Product+Image';
        document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
        mainThumb.classList.add('active');
    };
    modalThumbnails.appendChild(mainThumb);
    
    // Add detail images thumbnails
    product.detailImages.forEach((img, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail border-2 border-transparent rounded cursor-pointer';
        thumb.innerHTML = `<img src="https://via.placeholder.com/100x100?text=Detail+${index+1}" class="w-full h-full object-cover rounded">`;
        thumb.onclick = () => {
            modalMainImage.src = `https://via.placeholder.com/600x400?text=Detail+${index+1}`;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        };
        modalThumbnails.appendChild(thumb);
    });
    
    // Set brochure link
    if (product.brochurePdf) {
        modalBrochure.href = '#'; // Placeholder
        modalBrochure.style.display = 'inline-block';
    } else {
        modalBrochure.style.display = 'none';
    }
    
    // Parse description for features and advantages
    modalFeatures.innerHTML = '';
    modalAdvantages.innerHTML = '';
    
    // Simple parsing for features and advantages
    const descriptionLines = product.description.split('\n');
    let currentSection = '';
    
    descriptionLines.forEach(line => {
        if (line.includes('**Fitur Utama**')) {
            currentSection = 'features';
        } else if (line.includes('**Keunggulan**')) {
            currentSection = 'advantages';
        } else if (line.startsWith('- ') && currentSection === 'features') {
            const feature = line.substring(2);
            const li = document.createElement('li');
            li.textContent = feature;
            modalFeatures.appendChild(li);
        } else if (line.startsWith('- ') && currentSection === 'advantages') {
            const advantage = line.substring(2);
            const li = document.createElement('li');
            li.textContent = advantage;
            modalAdvantages.appendChild(li);
        }
    });
    
    // Show modal
    productModal.classList.remove('hidden');
}

// Update order summary
function updateOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const orderTotal = document.getElementById('orderTotal');
    
    const orderItems = cart.getOrderSummary();
    const total = cart.getTotal();
    
    orderSummary.innerHTML = orderItems.map(item => `
        <div class="flex justify-between py-2 border-b">
            <span>${item.name} x ${item.quantity}</span>
            <span>${item.subtotal}</span>
        </div>
    `).join('');
    
    orderTotal.textContent = cart.formatPrice(total);
}

// Handle checkout
function handleCheckout(e) {
    e.preventDefault();
    
    const customerInfo = {
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value,
        address: document.getElementById('customerAddress').value,
        notes: document.getElementById('customerNotes').value
    };
    
    const orderItems = cart.getOrderSummary();
    const total = cart.getTotal();
    
    // Generate invoice
    const invoiceContent = invoice.generateInvoice(customerInfo, orderItems, total);
    document.getElementById('invoiceContent').innerHTML = invoiceContent;
    
    // Show invoice modal
    checkoutModal.classList.add('hidden');
    invoiceModal.classList.remove('hidden');
    
    // Reset form
    checkoutForm.reset();
}
