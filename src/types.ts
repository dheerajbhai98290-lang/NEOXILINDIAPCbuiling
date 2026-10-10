export interface CompanySettings {
  companyName: string;
  tagline: string;
  gstin: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  stateCode: string;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  purchasePrefix: string;
  nextPurchaseNumber: number;
  defaultInvoiceSize: 'A5_LANDSCAPE' | 'A5_PORTRAIT' | 'A4_PORTRAIT' | 'A4_LANDSCAPE' | 'CUSTOM';
  termsAndConditions: string;
}

export interface BankDetails {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  upiId: string;
  paymentQrImage: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  openingBalance: number;
  currentBalance: number;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  openingBalance: number;
  currentBalance: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: 'Finished Goods' | 'Raw Material' | 'Packaging Material' | 'General';
  unit: string; // Pcs, Kg, Ltr, Box, Meter, Ton
  hsnCode: string;
  purchasePrice: number;
  salePrice: number;
  taxRate: number; // 0, 5, 12, 18, 28
  openingStock: number;
  currentStock: number;
  minStockAlert: number;
  createdAt: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  rate: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  customerGstin: string;
  customerPhone: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  roundOff: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid';
  paperSize: 'A5_LANDSCAPE' | 'A5_PORTRAIT' | 'A4_PORTRAIT' | 'A4_LANDSCAPE' | 'CUSTOM';
  notes: string;
  createdAt: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  rate: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface PurchaseBill {
  id: string;
  billNumber: string;
  date: string;
  supplierId: string;
  supplierName: string;
  supplierGstin: string;
  items: PurchaseItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid';
  notes: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  paymentMode: 'Cash' | 'Bank' | 'UPI';
  date: string;
  recipient: string;
  notes: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  type: 'Receipt' | 'Payment'; // Receipt = from customer, Payment = to supplier
  partyId: string;
  partyName: string;
  amount: number;
  paymentMode: 'Cash' | 'Bank' | 'UPI';
  referenceNo: string;
  date: string;
  notes: string;
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'PRODUCTION' | 'WASTAGE';
  quantity: number;
  referenceId: string;
  referenceType: 'Invoice' | 'Purchase' | 'Production' | 'Wastage' | 'Manual';
  date: string;
  notes: string;
}

export interface BOMItem {
  rawMaterialId: string;
  rawMaterialName: string;
  quantity: number;
  unit: string;
}

export interface BillOfMaterials {
  id: string;
  finishedProductId: string;
  finishedProductName: string;
  outputQuantity: number;
  outputUnit: string;
  items: BOMItem[];
  notes: string;
  createdAt: string;
}

export interface ProductionBatch {
  id: string;
  batchNumber: string;
  finishedProductId: string;
  finishedProductName: string;
  quantityProduced: number;
  unit: string;
  date: string;
  status: 'Completed' | 'In Progress';
  materialsConsumed: {
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
  }[];
  notes: string;
  createdAt: string;
}

export interface WastageRecord {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  reason: string;
  date: string;
  createdAt: string;
}

export interface ReturnRecord {
  id: string;
  type: 'Credit Note' | 'Debit Note'; // Credit Note = Sales Return, Debit Note = Purchase Return
  referenceNumber: string;
  partyId: string;
  partyName: string;
  amount: number;
  reason: string;
  date: string;
  createdAt: string;
}

export interface DashboardStats {
  todaySales: number;
  todayPurchases: number;
  todayExpenses: number;
  monthlySales: number;
  totalRevenue: number;
  totalPurchases: number;
  totalExpenses: number;
  customerOutstanding: number;
  supplierOutstanding: number;
  cashBalance: number;
  bankBalance: number;
  finishedGoodsStock: number;
  rawMaterialStock: number;
  productionQuantity: number;
  wastageQuantity: number;
  wastageCost: number;
  salesTargetAchievement: string; // "Not configured"
  netProfit: number;
  activeCustomersCount: number;
  activeSuppliersCount: number;
  activeProductsCount: number;
}

export interface ResetSummaryReport {
  timestamp: string;
  environment: string;
  targetDatabase: string;
  backupCreated: boolean;
  backupFilename: string;
  demoCustomersRemoved: number;
  demoCustomersList: string[];
  demoSuppliersRemoved: number;
  demoProductsRemoved: number;
  demoInvoicesRemoved: number;
  demoPurchasesRemoved: number;
  demoExpensesRemoved: number;
  demoPaymentsRemoved: number;
  demoInventoryMovementsRemoved: number;
  demoProductionWastageRemoved: number;
  demoOtherRecordsRemoved: number;
  sampleBankDetailsRemoved: boolean;
  hardcodedDashboardFiguresEliminated: boolean;
  demoGeneratorsDisabled: boolean;
  emptyDatabaseVerified: boolean;
  windowsAndAndroidVerifiedAgainstSameDatabase: boolean;
  counts: {
    customers: number;
    suppliers: number;
    products: number;
    invoices: number;
    purchases: number;
    expenses: number;
    payments: number;
    productionBatches: number;
    wastageRecords: number;
    boms: number;
    salesReturns: number;
    purchaseReturns: number;
    salesTargets: number;
    openingStockTotal: number;
    cashBalance: number;
    bankBalance: number;
  };
}

export interface VerificationTestItem {
  id: number;
  title: string;
  description: string;
  status: 'PASS' | 'FAIL' | 'NOT TESTED';
  detail: string;
}

export interface BackupArchive {
  filename: string;
  timestamp: string;
  sizeBytes: number;
  recordCount: number;
}
