// Cart functionality
class Cart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
    }

    loadFromStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartCount();
        }
    }

    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity
            });
        }
        
        this.saveToStorage();
        this.showToast(`${product.name} ditambahkan ke keranjang`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.renderCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
                this.renderCart();
            }
        }
    }

    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.renderCart();
    }

    getTotal() {
        return this.items.reduce((total, item) => {
            const price = parseInt(item.price.replace(/[^\d]/g, ''));
            return total + (price * item.quantity);
        }, 0);
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
        }
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const cartSummary = document.getElementById('cartSummary');
        const cartTotal = document.getElementById('cartTotal');

        if (this.items.length === 0) {
            cartItems.innerHTML = '';
            emptyCart.classList.remove('hidden');
            cartSummary.classList.add('hidden');
            return;
        }

        emptyCart.classList.add('hidden');
        cartSummary.classList.remove('hidden');

        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h4 class="font-semibold">${item.name}</h4>
                        <p class="text-gray-600">${item.price} x ${item.quantity}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})" 
                                class="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="w-8 text-center">${item.quantity}</span>
                        <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})" 
                                class="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button onclick="cart.removeItem('${item.id}')" 
                                class="text-red-500 hover:text-red-700 ml-2">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        cartTotal.textContent = this.formatPrice(this.getTotal());
    }

    formatPrice(price) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    }

    showToast(message) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create new toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    getOrderSummary() {
        return this.items.map(item => {
            const price = parseInt(item.price.replace(/[^\d]/g, ''));
            const subtotal = price * item.quantity;
            return {
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                subtotal: this.formatPrice(subtotal)
            };
        });
    }
}

// Initialize cart
const cart = new Cart();
