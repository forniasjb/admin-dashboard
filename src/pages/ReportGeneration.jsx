import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Alert, AlertTitle, Box, Button, Card, CardContent, CardHeader, CircularProgress, Divider, MenuItem, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { jasperReports, reportErrorMessage, requestReportGeneration } from "../api/reportGenerationData";
import PageHeader from "../components/common/PageHeader";
import { useUnsavedChanges } from "../utils/unsavedChanges";
import useDocumentTitle from "../utils/useDocumentTitle";

const validate = (report, values) => {
    const errors = {};
    report.fields.forEach((f) => {
        if (f.required && !String(values[f.name] ?? "").trim()) errors[f.name] = `${f.label} is required`;
    });
    [
        ["fromDate", "toDate"],
        ["startDate", "endDate"],
    ].forEach(([start, end]) => {
        if (!errors[start] && !errors[end] && values[start] && values[end] && values[start] > values[end]) {
            errors[end] = "End date must be on or after the start date";
        }
    });
    return errors;
};

export default function ReportGeneration() {
    useDocumentTitle("Report Generation");

    const [selectedReport, setSelectedReport] = useState("");
    const [values, setValues] = useState({});
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [result, setResult] = useState(null);
    const [pdfUrl, setPdfUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const requestId = useRef(0); // lets Reset / report change ignore a response that is still in flight

    const selected = jasperReports.find((r) => r.value === selectedReport);
    const errors = selected ? validate(selected, values) : {};
    const showError = (name) => (submitted || touched[name]) && errors[name];

    const hasInput = Boolean(selectedReport) || Object.values(values).some((v) => String(v).trim() !== "");
    useUnsavedChanges(hasInput && status !== "success");

    useEffect(() => {
        if (!result) return undefined;
        const url = URL.createObjectURL(result);
        setPdfUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [result]);

    const clearOutput = () => {
        requestId.current += 1;
        setStatus("idle");
        setResult(null);
        setPdfUrl("");
        setErrorMessage("");
    };

    const handleReportChange = (e) => {
        setSelectedReport(e.target.value);
        setValues({});
        setTouched({});
        setSubmitted(false);
        clearOutput();
    };

    const handleValueChange = (name) => (e) => {
        setValues((v) => ({ ...v, [name]: e.target.value }));
        if (status !== "idle") clearOutput();
    };

    const handleReset = () => {
        setSelectedReport("");
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
        setStatus("loading");
        setResult(null);
        setPdfUrl("");
        setErrorMessage("");
        try {
            const response = await requestReportGeneration(selected.value, values);
            if (id !== requestId.current) return;
            setResult(response);
            setStatus("success");
        } catch (error) {
            if (id !== requestId.current) return;
            const message = await reportErrorMessage(error);
            if (id !== requestId.current) return;
            setErrorMessage(message);
            setStatus("error");
        }
    };

    const loading = status === "loading";

    return (
        <>
            <PageHeader title="Report Generation" subtitle="Select a Jasper report to generate." />

            <Box sx={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 3 }}>
                <Card>
                    <CardHeader title="Report Options" titleTypographyProps={{ variant: "h6" }} />
                    <Divider />
                    <CardContent>
                        <Box component="form" noValidate onSubmit={handleGenerate} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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
                                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "action.hover" }}>
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
                                    type={f.type === "select" ? undefined : f.type}
                                    select={f.type === "select"}
                                    label={f.label}
                                    placeholder={f.placeholder}
                                    value={values[f.name] ?? ""}
                                    onChange={handleValueChange(f.name)}
                                    onBlur={() => setTouched((t) => ({ ...t, [f.name]: true }))}
                                    error={Boolean(showError(f.name))}
                                    helperText={showError(f.name) || " "}
                                    disabled={loading}
                                    InputLabelProps={f.type === "date" ? { shrink: true } : undefined}
                                >
                                    {f.options?.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ))}

                            <Box sx={{ display: "flex", gap: 1.5 }}>
                                <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <PictureAsPdfIcon />} disabled={!selected || loading}>
                                    {loading ? "Generating…" : "Generate"}
                                </Button>
                                <Button variant="outlined" onClick={handleReset} disabled={!hasInput && status === "idle"}>
                                    Reset
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {status === "success" && pdfUrl && (
                    <Alert severity="success">
                        <AlertTitle>{selected?.label} is ready</AlertTitle>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            <Button href={pdfUrl} target="_blank" rel="noopener noreferrer" size="small">
                                Open PDF
                            </Button>
                            <Button href={pdfUrl} download={`${selectedReport}.pdf`} size="small">
                                Download PDF
                            </Button>
                        </Box>
                    </Alert>
                )}

                {status === "error" && (
                    <Alert
                        severity="error"
                        action={
                            <Button color="inherit" size="small" onClick={handleGenerate}>
                                Retry
                            </Button>
                        }
                    >
                        <AlertTitle>Could not generate the report</AlertTitle>
                        {errorMessage}
                    </Alert>
                )}
            </Box>
        </>
    );
}
