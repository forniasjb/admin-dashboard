import { useRef, useState } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PageHeader from '../components/common/PageHeader';
import { jasperReports, requestReportGeneration } from '../api/reportGenerationData';
import useDocumentTitle from '../utils/useDocumentTitle';
import { useUnsavedChanges } from '../utils/unsavedChanges';

const validate = (report, values) => {
  const errors = {};
  report.fields.forEach((f) => {
    if (f.required && !String(values[f.name] ?? '').trim()) errors[f.name] = `${f.label} is required`;
  });
  if (!errors.from && !errors.to && values.from && values.to && values.from > values.to) {
    errors.to = 'To date must be on or after the From date';
  }
  return errors;
};

export default function ReportGeneration() {
  useDocumentTitle('Report Generation');

  const [selectedReport, setSelectedReport] = useState('');
  const [values, setValues] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const requestId = useRef(0); // lets Reset / report change ignore a response that is still in flight

  const selected = jasperReports.find((r) => r.value === selectedReport);
  const errors = selected ? validate(selected, values) : {};
  const showError = (name) => (submitted || touched[name]) && errors[name];

  const hasInput = Boolean(selectedReport) || Object.values(values).some((v) => String(v).trim() !== '');
  useUnsavedChanges(hasInput && status !== 'success');

  const clearOutput = () => {
    requestId.current += 1;
    setStatus('idle');
    setResult(null);
  };

  const handleReportChange = (e) => {
    setSelectedReport(e.target.value);
    setValues({});
    setTouched({});
    setSubmitted(false);
    clearOutput();
  };

  const handleValueChange = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  const handleReset = () => {
    setSelectedReport('');
    setValues({});
    setTouched({});
    setSubmitted(false);
    clearOutput();
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!selected || Object.keys(errors).length > 0) return;

    const id = ++requestId.current;
    setStatus('loading');
    setResult(null);
    try {
      const response = await requestReportGeneration(selected.value, values);
      if (id !== requestId.current) return;
      setResult(response);
      setStatus('success');
    } catch {
      if (id !== requestId.current) return;
      setStatus('error');
    }
  };

  const loading = status === 'loading';

  return (
    <>
      <PageHeader title="Report Generation" subtitle="Select a Jasper report to generate." />

      <Box sx={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Card>
          <CardHeader title="Report Options" titleTypographyProps={{ variant: 'h6' }} />
          <Divider />
          <CardContent>
            <Box component="form" noValidate onSubmit={handleGenerate} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                select
                fullWidth
                label="Jasper Report"
                value={selectedReport}
                onChange={handleReportChange}
                disabled={loading}
                helperText="Choose the report you want to generate"
              >
                {jasperReports.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </TextField>

              {selected && (
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                  <Typography variant="subtitle1">{selected.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selected.description}
                  </Typography>
                </Box>
              )}

              {selected?.fields.map((f) => (
                <TextField
                  key={f.name}
                  fullWidth
                  required={f.required}
                  type={f.type}
                  label={f.label}
                  placeholder={f.placeholder}
                  value={values[f.name] ?? ''}
                  onChange={handleValueChange(f.name)}
                  onBlur={() => setTouched((t) => ({ ...t, [f.name]: true }))}
                  error={Boolean(showError(f.name))}
                  helperText={showError(f.name) || ' '}
                  disabled={loading}
                  InputLabelProps={f.type === 'date' ? { shrink: true } : undefined}
                />
              ))}

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <PictureAsPdfIcon />}
                  disabled={!selected || loading}
                >
                  {loading ? 'Generating…' : 'Generate'}
                </Button>
                <Button variant="outlined" onClick={handleReset} disabled={!hasInput && status === 'idle'}>
                  Reset
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {status === 'success' && result && (
          <Alert severity="success">
            <AlertTitle>{selected?.label} is ready</AlertTitle>
            Generated on {new Date(result.generatedAt).toLocaleString()}. Preview and download will be available once the backend is
            connected.
          </Alert>
        )}

        {status === 'error' && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={handleGenerate}>
                Retry
              </Button>
            }
          >
            <AlertTitle>Could not generate the report</AlertTitle>
            Something went wrong. Please try again.
          </Alert>
        )}
      </Box>
    </>
  );
}
