// Invoice functionality
class Invoice {
    constructor() {
        this.invoiceNumber = this.generateInvoiceNumber();
        this.invoiceDate = new Date().toLocaleDateString('id-ID');
    }

    generateInvoiceNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `INV/${year}${month}${day}/${random}`;
    }

    generateInvoice(customerInfo, orderItems, total) {
        const invoiceContent = `
            <div class="invoice-header">
                <div class="flex justify-between items-start">
                    <div>
                        <h1 class="text-2xl font-bold">Katalog Produk Kabel & Jaringan</h1>
                        <p class="text-gray-600">Tuminting, Manado, Sulawesi Utara</p>
                        <p class="text-gray-600">+62 895-3312-44803</p>
                    </div>
                    <div class="text-right">
                        <h2 class="text-xl font-bold">INVOICE</h2>
                        <p class="text-gray-600">No: ${this.invoiceNumber}</p>
                        <p class="text-gray-600">Tanggal: ${this.invoiceDate}</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <h3 class="font-semibold mb-2">Informasi Pembeli:</h3>
                    <p><strong>Nama:</strong> ${customerInfo.name}</p>
                    <p><strong>Email:</strong> ${customerInfo.email}</p>
                    <p><strong>Telepon:</strong> ${customerInfo.phone}</p>
                    <p><strong>Alamat:</strong> ${customerInfo.address}</p>
                    ${customerInfo.notes ? `<p><strong>Catatan:</strong> ${customerInfo.notes}</p>` : ''}
                </div>
                <div>
                    <h3 class="font-semibold mb-2">Informasi Penjual:</h3>
                    <p><strong>Nama:</strong> Katalog Produk Kabel & Jaringan</p>
                    <p><strong>Alamat:</strong> Tuminting, Manado, Sulawesi Utara</p>
                    <p><strong>Telepon:</strong> +62 895-3312-44803</p>
                </div>
            </div>

            <div class="mb-6">
                <h3 class="font-semibold mb-2">Rincian Pesanan:</h3>
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Produk</th>
                            <th>Jumlah</th>
                            <th>Harga</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderItems.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>${item.price}</td>
                                <td>${item.subtotal}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4" class="text-right font-semibold">Total:</td>
                            <td class="font-bold">${this.formatPrice(total)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="invoice-footer">
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <h3 class="font-semibold mb-2">Catatan:</h3>
                        <p>Terima kasih atas pesanan Anda. Silakan lakukan pembayaran sesuai dengan total yang tertera.</p>
                        <p>Invoice ini sah setelah dilakukan pembayaran.</p>
                    </div>
                    <div class="text-right">
                        <p>Hormat kami,</p>
                        <p class="mt-8">Katalog Produk Kabel & Jaringan</p>
                    </div>
                </div>
            </div>
        `;

        return invoiceContent;
    }

    formatPrice(price) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    }

    printInvoice() {
        window.print();
    }

    downloadInvoice() {
        const invoiceContent = document.getElementById('invoiceContent').innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice ${this.invoiceNumber}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    .invoice-header {
                        border-bottom: 2px solid #3b82f6;
                        padding-bottom: 1rem;
                        margin-bottom: 1rem;
                    }
                    .invoice-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 1rem;
                    }
                    .invoice-table th,
                    .invoice-table td {
                        border: 1px solid #e5e7eb;
                        padding: 0.5rem;
                        text-align: left;
                    }
                    .invoice-table th {
                        background-color: #f3f4f6;
                        font-weight: 600;
                    }
                    .invoice-footer {
                        border-top: 2px solid #3b82f6;
                        padding-top: 1rem;
                        margin-top: 1rem;
                    }
                    @media print {
                        body {
                            margin: 0;
                        }
                    }
                </style>
            </head>
            <body>
                ${invoiceContent}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// Initialize invoice
const invoice = new Invoice();
