import { Skeleton, TableCell, TableRow } from '@mui/material';

/** Placeholder rows shown inside a <TableBody> while data is loading. */
export default function TableSkeleton({ rows = 5, columns = 4 }) {
  return Array.from({ length: rows }, (_, r) => (
    <TableRow key={r} aria-hidden="true">
      {Array.from({ length: columns }, (__, c) => (
        <TableCell key={c}>
          <Skeleton variant="text" height={28} />
        </TableCell>
      ))}
    </TableRow>
  ));
}
