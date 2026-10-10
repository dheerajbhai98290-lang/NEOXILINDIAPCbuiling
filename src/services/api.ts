import {
  CompanySettings,
  BankDetails,
  Customer,
  Supplier,
  Product,
  Invoice,
  PurchaseBill,
  Expense,
  PaymentRecord,
  ProductionBatch,
  BillOfMaterials,
  WastageRecord,
  ReturnRecord,
  DashboardStats,
  ResetSummaryReport,
  VerificationTestItem,
  BackupArchive,
} from '../types.ts';

const BASE_URL = '/api';

export const api = {
  async getStatus() {
    const res = await fetch(`${BASE_URL}/status`);
    if (!res.ok) throw new Error('Failed to get status');
    return res.json();
  },

  async getCompanySettings(): Promise<CompanySettings> {
    const res = await fetch(`${BASE_URL}/company`);
    if (!res.ok) throw new Error('Failed to get company settings');
    return res.json();
  },

  async updateCompanySettings(data: Partial<CompanySettings>): Promise<CompanySettings> {
    const res = await fetch(`${BASE_URL}/company`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update company settings');
    return res.json();
  },

  async getBankDetails(): Promise<BankDetails> {
    const res = await fetch(`${BASE_URL}/bank`);
    if (!res.ok) throw new Error('Failed to get bank details');
    return res.json();
  },

  async updateBankDetails(data: Partial<BankDetails>): Promise<BankDetails> {
    const res = await fetch(`${BASE_URL}/bank`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update bank details');
    return res.json();
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${BASE_URL}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to get dashboard stats');
    return res.json();
  },

  // Customers
  async getCustomers(): Promise<Customer[]> {
    const res = await fetch(`${BASE_URL}/customers`);
    if (!res.ok) throw new Error('Failed to get customers');
    return res.json();
  },

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    const res = await fetch(`${BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create customer');
    return res.json();
  },

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    const res = await fetch(`${BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update customer');
    return res.json();
  },

  async deleteCustomer(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/customers/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete customer');
  },

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    const res = await fetch(`${BASE_URL}/suppliers`);
    if (!res.ok) throw new Error('Failed to get suppliers');
    return res.json();
  },

  async createSupplier(data: Partial<Supplier>): Promise<Supplier> {
    const res = await fetch(`${BASE_URL}/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create supplier');
    return res.json();
  },

  async updateSupplier(id: string, data: Partial<Supplier>): Promise<Supplier> {
    const res = await fetch(`${BASE_URL}/suppliers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update supplier');
    return res.json();
  },

  async deleteSupplier(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/suppliers/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete supplier');
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) throw new Error('Failed to get products');
    return res.json();
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    const res = await fetch(`${BASE_URL}/invoices`);
    if (!res.ok) throw new Error('Failed to get invoices');
    return res.json();
  },

  async createInvoice(data: any): Promise<Invoice> {
    const res = await fetch(`${BASE_URL}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create invoice');
    return res.json();
  },

  async deleteInvoice(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/invoices/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete invoice');
  },

  // Purchases
  async getPurchases(): Promise<PurchaseBill[]> {
    const res = await fetch(`${BASE_URL}/purchases`);
    if (!res.ok) throw new Error('Failed to get purchases');
    return res.json();
  },

  async createPurchase(data: any): Promise<PurchaseBill> {
    const res = await fetch(`${BASE_URL}/purchases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create purchase');
    return res.json();
  },

  async deletePurchase(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/purchases/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete purchase');
  },

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    const res = await fetch(`${BASE_URL}/expenses`);
    if (!res.ok) throw new Error('Failed to get expenses');
    return res.json();
  },

  async createExpense(data: Partial<Expense>): Promise<Expense> {
    const res = await fetch(`${BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create expense');
    return res.json();
  },

  async deleteExpense(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/expenses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete expense');
  },

  // Payments
  async getPayments(): Promise<PaymentRecord[]> {
    const res = await fetch(`${BASE_URL}/payments`);
    if (!res.ok) throw new Error('Failed to get payments');
    return res.json();
  },

  async createPayment(data: Partial<PaymentRecord>): Promise<PaymentRecord> {
    const res = await fetch(`${BASE_URL}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to record payment');
    return res.json();
  },

  async deletePayment(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/payments/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete payment');
  },

  // Production
  async getProduction(): Promise<ProductionBatch[]> {
    const res = await fetch(`${BASE_URL}/production`);
    if (!res.ok) throw new Error('Failed to get production batches');
    return res.json();
  },

  async createProduction(data: any): Promise<ProductionBatch> {
    const res = await fetch(`${BASE_URL}/production`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to record production batch');
    return res.json();
  },

  async deleteProduction(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/production/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete production batch');
  },

  // BOM
  async getBoms(): Promise<BillOfMaterials[]> {
    const res = await fetch(`${BASE_URL}/boms`);
    if (!res.ok) throw new Error('Failed to get BOMs');
    return res.json();
  },

  async createBom(data: any): Promise<BillOfMaterials> {
    const res = await fetch(`${BASE_URL}/boms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create BOM');
    return res.json();
  },

  // Wastage
  async getWastage(): Promise<WastageRecord[]> {
    const res = await fetch(`${BASE_URL}/wastage`);
    if (!res.ok) throw new Error('Failed to get wastage records');
    return res.json();
  },

  async createWastage(data: any): Promise<WastageRecord> {
    const res = await fetch(`${BASE_URL}/wastage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to record wastage');
    return res.json();
  },

  async deleteWastage(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/wastage/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete wastage record');
  },

  // Returns
  async getReturns(): Promise<{ salesReturns: ReturnRecord[]; purchaseReturns: ReturnRecord[] }> {
    const res = await fetch(`${BASE_URL}/returns`);
    if (!res.ok) throw new Error('Failed to get returns');
    return res.json();
  },

  async createReturn(data: any): Promise<ReturnRecord> {
    const res = await fetch(`${BASE_URL}/returns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create return record');
    return res.json();
  },

  // PRD Section 12 & 13: Reset Audit, Verification Tests & Backups
  async getResetAudit(): Promise<ResetSummaryReport> {
    const res = await fetch(`${BASE_URL}/audit`);
    if (!res.ok) throw new Error('Failed to fetch reset audit');
    return res.json();
  },

  async verifyAuditTests(): Promise<{ totalTests: number; passed: number; failed: number; tests: VerificationTestItem[] }> {
    const res = await fetch(`${BASE_URL}/audit/verify`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to verify audit tests');
    return res.json();
  },

  async createBackup(label = 'manual'): Promise<{ success: boolean; filename: string; timestamp: string }> {
    const res = await fetch(`${BASE_URL}/backup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label }),
    });
    if (!res.ok) throw new Error('Failed to create backup');
    return res.json();
  },

  async getBackups(): Promise<BackupArchive[]> {
    const res = await fetch(`${BASE_URL}/backups`);
    if (!res.ok) throw new Error('Failed to get backups');
    return res.json();
  },

  async resetZeroData(preserveBank = false): Promise<any> {
    const res = await fetch(`${BASE_URL}/reset-zero`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preserveBank }),
    });
    if (!res.ok) throw new Error('Failed to reset zero data');
    return res.json();
  },
};
