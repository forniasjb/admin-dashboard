import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { users as initialUsers } from "../api/usersData";
import EmptyState from "../components/common/EmptyState";
import PageHeader from "../components/common/PageHeader";
import SearchField from "../components/common/SearchField";
import TableSkeleton from "../components/common/TableSkeleton";
import UserFormDialog from "../components/users/UserFormDialog";
import { statusColor } from "../utils/formatters";
import useDocumentTitle from "../utils/useDocumentTitle";
import useSimulatedLoading from "../utils/useSimulatedLoading";

const initials = (name) =>
    name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("");

export default function Users() {
    useDocumentTitle("Users");
    const loading = useSimulatedLoading();
    const [users, setUsers] = useState(initialUsers); // local state only; replace with API calls later
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [formUser, setFormUser] = useState(null); // null = closed, 'new' = add dialog, user object = edit dialog
    const [deleting, setDeleting] = useState(null);
    const [toast, setToast] = useState("");

    const rows = useMemo(() => {
        const q = query.trim().toLowerCase();
        return users.filter((u) => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q));
    }, [users, query]);

    const updateQuery = (value) => {
        setQuery(value);
        setPage(0); // back to the first page whenever the search changes
    };

    // Keeps the page valid after a delete removes the last row of the last page.
    const lastPage = Math.max(0, Math.ceil(rows.length / rowsPerPage) - 1);
    const safePage = Math.min(page, lastPage);
    const visibleRows = rows.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);

    const isEditing = formUser && formUser !== "new";
    // Emails already taken by other users (the edited user's own email stays allowed).
    const existingEmails = users.filter((u) => u.id !== formUser?.id).map((u) => u.email.toLowerCase());

    const handleSave = (data) => {
        if (isEditing) {
            setUsers((list) => list.map((u) => (u.id === formUser.id ? { ...u, ...data } : u)));
            setToast(`${data.name} updated`);
        } else {
            const id = users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
            setUsers((list) => [...list, { ...data, id }]);
            setToast(`${data.name} added`);
        }
        setFormUser(null);
    };

    const confirmDelete = () => {
        setUsers((list) => list.filter((u) => u.id !== deleting.id));
        setToast(`${deleting.name} deleted`);
        setDeleting(null);
    };

    return (
        <>
            <PageHeader
                title="Users"
                subtitle="Manage the people who have access to your workspace."
                actions={
                    <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setFormUser("new")}>
                        Add User
                    </Button>
                }
            />

            <Card>
                <Box sx={{ p: 2.5 }}>
                    <SearchField
                        size="small"
                        placeholder="Search users…"
                        value={query}
                        onChange={(e) => updateQuery(e.target.value)}
                        onClear={() => updateQuery("")}
                        sx={{ width: { xs: "100%", sm: 320 } }}
                    />
                </Box>
                <TableContainer sx={{ overflowX: "auto", maxHeight: 520 }}>
                    <Table stickyHeader sx={{ minWidth: 680 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading && <TableSkeleton rows={rowsPerPage} columns={5} />}
                            {!loading &&
                                visibleRows.map((u) => (
                                    <TableRow key={u.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Avatar sx={{ width: 34, height: 34, fontSize: 14, bgcolor: "primary.main" }}>{initials(u.name)}</Avatar>
                                                <Typography fontWeight={600} noWrap>
                                                    {u.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>{u.role}</TableCell>
                                        <TableCell>
                                            <Chip size="small" label={u.status} color={statusColor(u.status)} />
                                        </TableCell>
                                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                                            <Tooltip title="Edit">
                                                <IconButton size="small" aria-label={`Edit ${u.name}`} onClick={() => setFormUser(u)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error" aria-label={`Delete ${u.name}`} onClick={() => setDeleting(u)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            {!loading && rows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ borderBottom: 0 }}>
                                        <EmptyState
                                            title="No users found"
                                            description={query ? `Nothing matches "${query}".` : "There are no users yet."}
                                            actionLabel={query ? "Clear search" : undefined}
                                            onAction={() => updateQuery("")}
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={loading ? 0 : rows.length}
                    page={safePage}
                    onPageChange={(_, p) => setPage(p)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(Number.parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Card>

            {formUser && (
                <UserFormDialog key={isEditing ? formUser.id : "new"} user={isEditing ? formUser : undefined} existingEmails={existingEmails} onSave={handleSave} onClose={() => setFormUser(null)} />
            )}

            <Dialog open={Boolean(deleting)} onClose={() => setDeleting(null)}>
                <DialogTitle>Delete user?</DialogTitle>
                <DialogContent>
                    <DialogContentText>{deleting?.name} will lose access to the workspace.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleting(null)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={confirmDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar key={toast} open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast("")}>
                <Alert severity="success" variant="filled" onClose={() => setToast("")}>
                    {toast}
                </Alert>
            </Snackbar>
        </>
    );
}
