// Jasper Report options available on the Report Generation page.
// Static for now; replace with an API call when the backend is integrated.
// "fields" describes the parameter form shown for each report.
export const jasperReports = [
  {
    value: 'activity-report',
    label: 'Activity Report',
    description: 'Summary of user and system activity for a selected period.',
    fields: [
      { name: 'from', label: 'From', type: 'date', required: true },
      { name: 'to', label: 'To', type: 'date', required: true },
    ],
  },
  {
    value: 'ticket',
    label: 'Ticket',
    description: 'Details of a support ticket, including its status and history.',
    fields: [{ name: 'ticketNumber', label: 'Ticket number', type: 'text', required: true, placeholder: 'e.g. TCK-1001' }],
  },
];

// Placeholder for the real Jasper call. It resolves after a short delay; when the backend
// exists, replace the body with the API request (and let it reject on failure).
export const requestReportGeneration = (reportValue, params) =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ reportValue, params, generatedAt: new Date().toISOString() }), 1200);
  });
