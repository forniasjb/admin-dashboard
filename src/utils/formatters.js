/** Returns a local YYYY-MM-DD string for "n" days ago (avoids UTC timezone shifts). */
export const isoDaysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const pad = (v) => String(v).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** "2026-11-05" -> "Nov 5, 2026" */
export const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

export const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value);

/** Maps a status label to an MUI Chip color. */
export const statusColor = (status) => {
  switch (status) {
    case 'Completed':
    case 'Success':
    case 'Active':
      return 'success';
    case 'Pending':
    case 'Invited':
      return 'warning';
    case 'Failed':
    case 'Error':
    case 'Suspended':
      return 'error';
    default:
      return 'default';
  }
};
