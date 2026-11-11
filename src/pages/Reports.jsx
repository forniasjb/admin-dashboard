import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import GroupsIcon from '@mui/icons-material/Groups';
import PublicIcon from '@mui/icons-material/Public';
import InsightsIcon from '@mui/icons-material/Insights';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import SearchField from '../components/common/SearchField';
import EmptyState from '../components/common/EmptyState';
import TableSkeleton from '../components/common/TableSkeleton';
import { REPORT_CATEGORIES, reportTemplates, reports as initialReports } from '../api/reportsData';
import { formatDate, isoDaysAgo, statusColor } from '../utils/formatters';
import { downloadCsv, toCsv } from '../utils/csv';
import useDocumentTitle from '../utils/useDocumentTitle';
import useSimulatedLoading from '../utils/useSimulatedLoading';

const CARD_ICONS = {
  sales: <PointOfSaleIcon />,
  users: <GroupsIcon />,
  traffic: <PublicIcon />,
  forecast: <InsightsIcon />,
};

const EMPTY_FILTERS = { from: '', to: '', category: 'All', search: '' };

const CSV_COLUMNS = [
  { label: 'Report ID', value: (r) => r.id },
  { label: 'Report Name', value: (r) => r.name },
  { label: 'Category', value: (r) => r.category },
  { label: 'Date Created', value: (r) => r.dateCreated },
  { label: 'Status', value: (r) => r.status },
];

export default function Reports() {
  useDocumentTitle('Reports');
  const loading = useSimulatedLoading();
  const tableRef = useRef(null);

  const [reports, setReports] = useState(initialReports);
  const [draft, setDraft] = useState(EMPTY_FILTERS); // values currently typed in the filter bar
  const [filters, setFilters] = useState(EMPTY_FILTERS); // values applied after "Apply Filter"
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState('');

  // ---- Summary numbers (computed from the full, unfiltered list) ----
  const summary = useMemo(() => {
    const monthPrefix = isoDaysAgo(0).slice(0, 7); // YYYY-MM
    return {
      total: reports.length,
      thisMonth: reports.filter((r) => r.dateCreated.startsWith(monthPrefix)).length,
      pending: reports.filter((r) => r.status === 'Pending').length,
    };
  }, [reports]);

  // ---- Filtering ----
  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return reports.filter((r) => {
      if (filters.category !== 'All' && r.category !== filters.category) return false;
      if (filters.from && r.dateCreated < filters.from) return false;
      if (filters.to && r.dateCreated > filters.to) return false;
      if (q && !`${r.id} ${r.name}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [reports, filters]);

  const visibleRows = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleDraftChange = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }));

  const applyFilters = (next = draft) => {
    setFilters(next);
    setPage(0);
  };

  const resetFilters = () => {
    setDraft(EMPTY_FILTERS);
    applyFilters(EMPTY_FILTERS);
  };

  // Clicking a report card filters the table by that card's category.
  const handleViewCategory = (category) => {
    const next = { ...EMPTY_FILTERS, category };
    setDraft(next);
    applyFilters(next);
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const confirmDelete = () => {
    setReports((list) => list.filter((r) => r.id !== deleting.id));
    setToast(`${deleting.id} deleted`);
    setDeleting(null);
    setPage(0);
  };

  // PDF export via the browser's print dialog ("Save as PDF"); .no-print hides the chrome.
  const handleDownloadPdf = () => window.print();

  // CSV export of the rows that match the applied filters.
  const handleExportCsv = () => {
    downloadCsv(`reports-${isoDaysAgo(0)}.csv`, toCsv(CSV_COLUMNS, filtered));
    setToast(`Exported ${filtered.length} report${filtered.length === 1 ? '' : 's'} to CSV`);
  };

  const filtersActive = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Generate, review and download your business reports."
        actions={
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={handleExportCsv}
              disabled={loading || filtered.length === 0}
            >
              Export CSV
            </Button>
            <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownloadPdf}>
              Download PDF
            </Button>
          </Box>
        }
      />

      {/* Filter bar */}
      <Card className="no-print" sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="From"
                value={draft.from}
                onChange={handleDraftChange('from')}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: draft.to || undefined }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="To"
                value={draft.to}
                onChange={handleDraftChange('to')}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: draft.from || undefined }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Category"
                value={draft.category}
                onChange={handleDraftChange('category')}
              >
                {REPORT_CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <SearchField
                fullWidth
                size="small"
                label="Search"
                placeholder="Report ID or name"
                value={draft.search}
                onChange={handleDraftChange('search')}
                onClear={() => {
                  const next = { ...draft, search: '' };
                  setDraft(next);
                  if (filters.search) applyFilters({ ...filters, search: '' });
                }}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              />
            </Grid>
            <Grid item xs={12} lg={3} sx={{ display: 'flex', gap: 1, justifyContent: { lg: 'flex-end' } }}>
              <Button variant="contained" startIcon={<FilterAltIcon />} onClick={() => applyFilters()}>
                Apply Filter
              </Button>
              <Button variant="outlined" onClick={resetFilters}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatCard title="Total Reports" value={summary.total} color="primary" icon={<DescriptionIcon />} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Generated This Month" value={summary.thisMonth} color="success" icon={<EventAvailableIcon />} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Pending Reports" value={summary.pending} color="warning" icon={<PendingActionsIcon />} />
        </Grid>
      </Grid>

      {/* Reports table */}
      <Card ref={tableRef} sx={{ mb: 4, scrollMarginTop: 80 }}>
        <Box sx={{ p: 2.5, pb: 1.5 }}>
          <Typography variant="h6">All Reports</Typography>
        </Box>
        <TableContainer sx={{ overflowX: 'auto', maxHeight: 520 }}>
          <Table stickyHeader sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell>Report ID</TableCell>
                <TableCell>Report Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right" className="no-print">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && <TableSkeleton rows={rowsPerPage} columns={6} />}
              {!loading &&
                visibleRows.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{r.id}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(r.dateCreated)}</TableCell>
                  <TableCell>
                    <Chip size="small" label={r.status} color={statusColor(r.status)} />
                  </TableCell>
                  <TableCell align="right" className="no-print" sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="View">
                      <IconButton size="small" aria-label={`View ${r.id}`} onClick={() => setViewing(r)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={r.status === 'Completed' ? 'Download' : 'Available when completed'}>
                      <span>
                        <IconButton
                          size="small"
                          aria-label={`Download ${r.id}`}
                          disabled={r.status !== 'Completed'}
                          onClick={() => setToast(`Downloading ${r.id}…`)}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" aria-label={`Delete ${r.id}`} onClick={() => setDeleting(r)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ borderBottom: 0 }}>
                    <EmptyState
                      title="No reports found"
                      description={filtersActive ? 'No reports match your filters.' : 'There are no reports yet.'}
                      actionLabel={filtersActive ? 'Clear filters' : undefined}
                      onAction={resetFilters}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          className="no-print"
          count={loading ? 0 : filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>

      {/* Report card grid (alternative view) */}
      <Typography variant="h6" sx={{ mb: 2 }} className="no-print">
        Quick Reports
      </Typography>
      <Grid container spacing={3} className="no-print">
        {reportTemplates.map((t) => (
          <Grid item xs={12} sm={6} lg={3} key={t.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'box-shadow .2s', '&:hover': { boxShadow: 6 } }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3,
                    color: `${t.color}.main`,
                    bgcolor: (theme) => `${theme.palette[t.color].main}1A`,
                  }}
                >
                  {CARD_ICONS[t.icon]}
                </Box>
                <Typography variant="subtitle1" gutterBottom>
                  {t.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button size="small" variant="outlined" onClick={() => handleViewCategory(t.category)}>
                  View Report
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* View dialog */}
      <Dialog open={Boolean(viewing)} onClose={() => setViewing(null)} fullWidth maxWidth="xs">
        <DialogTitle>{viewing?.name}</DialogTitle>
        <DialogContent dividers>
          {viewing && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 1.5 }}>
              <Typography color="text.secondary">Report ID</Typography>
              <Typography fontWeight={600}>{viewing.id}</Typography>
              <Typography color="text.secondary">Category</Typography>
              <Typography>{viewing.category}</Typography>
              <Typography color="text.secondary">Created</Typography>
              <Typography>{formatDate(viewing.dateCreated)}</Typography>
              <Typography color="text.secondary">Status</Typography>
              <Box>
                <Chip size="small" label={viewing.status} color={statusColor(viewing.status)} />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewing(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={Boolean(deleting)} onClose={() => setDeleting(null)}>
        <DialogTitle>Delete report?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleting?.id} — {deleting?.name} will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')}>
        <Alert severity="info" variant="filled" onClose={() => setToast('')}>
          {toast}
        </Alert>
      </Snackbar>
    </>
  );
}
