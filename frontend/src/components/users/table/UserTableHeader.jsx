import {
  TableHead,
  TableRow,
  TableCell
} from '@mui/material';

function UserTableHeader({ orderBy, orderDirection, onRequestSort }) {
  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: '#FFF5F5' }}>
        <TableCell sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>
          ID
        </TableCell>
        <TableCell sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>
          Nome
        </TableCell>
        <TableCell sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>
          Email
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>
          Função
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 600, color: '#000', borderBottom: '2px solid #E2D9D9' }}>
          Ações
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

export default UserTableHeader; 