import axios from 'axios';

const required = (name, value) => {
  if (!value?.trim()) throw new Error(`Missing API configuration: ${name}`);
  return value;
};

export const reportEndpoints = {
  activity: import.meta.env.VITE_REPORT_ACTIVITY_ENDPOINT,
  ticket: import.meta.env.VITE_REPORT_TICKET_ENDPOINT,
  depositLiabilityLedger: import.meta.env.VITE_REPORT_DEPOSIT_LIABILITY_LEDGER_ENDPOINT,
  demandDepositSummary: import.meta.env.VITE_REPORT_DEMAND_DEPOSIT_SUMMARY_ENDPOINT,
  financialAccountingDepartment: import.meta.env.VITE_REPORT_FINANCIAL_ACCOUNTING_DEPARTMENT_ENDPOINT,
  creditAdvice: import.meta.env.VITE_REPORT_CREDIT_ADVICE_ENDPOINT,
  debitAdvice: import.meta.env.VITE_REPORT_DEBIT_ADVICE_ENDPOINT,
  clearingAccounts: import.meta.env.VITE_REPORT_CLEARING_ACCOUNTS_ENDPOINT,
  depositLiabilitiesSummary: import.meta.env.VITE_REPORT_DEPOSIT_LIABILITIES_SUMMARY_ENDPOINT,
};

export const getReportApi = (endpointKey) => {
  const baseURL = required('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL);
  const endpoint = required(`report endpoint (${endpointKey})`, reportEndpoints[endpointKey]);
  return { api: axios.create({ baseURL }), endpoint };
};
