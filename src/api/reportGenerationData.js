import { getReportApi } from './apiConfig';

export const jasperReports = [
  {
    value: 'activity',
    label: 'Activity',
    description: 'Activity for an organization within a selected date range.',
    endpoint: 'activity',
    fields: [
      { name: 'fromDate', label: 'From date', type: 'date', required: true },
      { name: 'toDate', label: 'To date', type: 'date', required: true },
      { name: 'orgaCode', label: 'Organization code', type: 'text', required: true },
    ],
  },
  {
    value: 'ticket',
    label: 'Ticket',
    description: 'Ticket details for a transaction and date.',
    endpoint: 'ticket',
    fields: [
      { name: 'transId', label: 'Transaction ID', type: 'text', required: true },
      { name: 'transDate', label: 'Transaction date', type: 'date', required: true },
    ],
  },
  {
    value: 'deposit-liability-ledger',
    label: 'Deposit Liability Ledger',
    description: 'Deposit liability ledger entries for an institution and general ledger code.',
    endpoint: 'depositLiabilityLedger',
    fields: [
      { name: 'institution', label: 'Institution', type: 'text', required: true },
      { name: 'glCode', label: 'GL code', type: 'text', required: true },
      { name: 'startDate', label: 'Start date', type: 'date', required: true },
      { name: 'endDate', label: 'End date', type: 'date', required: true },
    ],
  },
  {
    value: 'summary-of-demand-deposit-transactions',
    label: 'Summary of Demand Deposit Transactions',
    description: 'Demand deposit transactions summarized by source and deposit type.',
    endpoint: 'demandDepositSummary',
    fields: [
      { name: 'startDate', label: 'Start date', type: 'date', required: true },
      { name: 'endDate', label: 'End date', type: 'date', required: true },
      { name: 'source', label: 'Source', type: 'text' },
      { name: 'ddaType', label: 'DDA type', type: 'text' },
    ],
  },
  {
    value: 'financial-accounting-department',
    label: 'Financial Accounting Department',
    description: 'Financial Accounting Department report for an institution and date.',
    endpoint: 'financialAccountingDepartment',
    fields: [
      { name: 'institutionName', label: 'Institution name', type: 'text', required: true },
      { name: 'dateRequested', label: 'Date requested', type: 'date', required: true },
      { name: 'reportDate', label: 'Report date', type: 'text' },
      { name: 'letterDate', label: 'Letter date', type: 'text' },
      { name: 'receiptDate', label: 'Receipt date', type: 'text' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'designation', label: 'Designation', type: 'text' },
      { name: 'requestReference', label: 'Request reference', type: 'text' },
    ],
  },
  {
    value: 'credit-advice',
    label: 'Credit Advice',
    description: 'Financial Accounting Department credit advice.',
    endpoint: 'creditAdvice',
    fields: [
      { name: 'transactionId', label: 'Transaction ID', type: 'text', required: true },
      { name: 'institutionName', label: 'Institution name', type: 'text', required: true },
    ],
  },
  {
    value: 'debit-advice',
    label: 'Debit Advice',
    description: 'Financial Accounting Department debit advice.',
    endpoint: 'debitAdvice',
    fields: [
      { name: 'transactionId', label: 'Transaction ID', type: 'text', required: true },
      { name: 'institutionName', label: 'Institution name', type: 'text', required: true },
    ],
  },
  {
    value: 'detailed-schedule-clearing-accounts',
    label: 'Detailed Schedule of Clearing Accounts',
    description: 'Clearing account entries for a GL code and selected date range.',
    endpoint: 'clearingAccounts',
    fields: [
      { name: 'startDate', label: 'Start date', type: 'date', required: true },
      { name: 'endDate', label: 'End date', type: 'date', required: true },
      { name: 'glCode', label: 'GL code', type: 'text', required: true },
    ],
  },
  {
    value: 'deposit-liabilities-transaction-summary',
    label: 'Deposit Liabilities Transaction Summary',
    description: 'Deposit liability transactions summarized by institution and GL code.',
    endpoint: 'depositLiabilitiesSummary',
    fields: [
      { name: 'institution', label: 'Institution', type: 'text', required: true },
      { name: 'glCode', label: 'GL code', type: 'text', required: true },
      { name: 'startDate', label: 'Start date', type: 'date', required: true },
      { name: 'endDate', label: 'End date', type: 'date', required: true },
    ],
  },
];

export const requestReportGeneration = async (reportValue, params) => {
  const report = jasperReports.find((item) => item.value === reportValue);
  if (!report) throw new Error(`Unknown report: ${reportValue}`);

  const { api, endpoint } = getReportApi(report.endpoint);
  const query = Object.fromEntries(Object.entries(params).filter(([, value]) => String(value).trim()));
  const response = await api.get(endpoint, {
    params: query,
    responseType: 'blob',
    headers: { Accept: 'application/pdf, application/json' },
  });
  if (
    !response.data.type.toLowerCase().startsWith('application/pdf') ||
    await response.data.slice(0, 5).text() !== '%PDF-'
  ) {
    throw new Error('The server did not return a valid PDF report.');
  }
  return response.data;
};

export const reportErrorMessage = async (error) => {
  const status = error?.response?.status;
  const data = error?.response?.data;
  let message = error?.message || 'The report request failed. Please try again.';
  if (data instanceof Blob) {
    const text = await data.text();
    if (text) {
      try {
        const parsed = JSON.parse(text);
        message = typeof parsed?.message === 'string'
          ? parsed.message
          : typeof parsed?.error === 'string' ? parsed.error : text;
      } catch (parseError) {
        if (!(parseError instanceof SyntaxError)) throw parseError;
        message = text;
      }
    }
  }
  return status ? `HTTP ${status}: ${message}` : message;
};
