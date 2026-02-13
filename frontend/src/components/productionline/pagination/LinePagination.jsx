import TablePagination from '@mui/material/TablePagination';

function LinePagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  isMobile
}) {
  return (
    <TablePagination
      component="div"
      count={totalCount}
      page={page - 1}
      onPageChange={onPageChange}
      rowsPerPage={pageSize}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={[10, 20, 50, 100]}
      labelRowsPerPage={isMobile ? '' : 'Itens por página:'}
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
      sx={{
        background: '#fff',
        borderRadius: 2,
        boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)',
        minWidth: isMobile ? 120 : 420,
        width: isMobile ? '100%' : 'auto',
        '.MuiTablePagination-toolbar': {
          pl: isMobile ? 0.5 : 1,
          pr: isMobile ? 0.5 : 1,
          minHeight: isMobile ? 32 : 40,
          alignItems: 'center',
          gap: isMobile ? 0.5 : 1,
          justifyContent: 'center',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        },
        '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
          margin: 0,
          fontSize: isMobile ? 12 : 15,
        },
        '.MuiTablePagination-actions': {
          marginRight: 0
        },
        '.MuiInputBase-root': {
          fontSize: isMobile ? 12 : 15,
        },
        '.MuiTablePagination-select': {
          padding: isMobile ? '4px 8px' : undefined,
        },
        '.MuiTablePagination-spacer': {
          display: isMobile ? 'none' : undefined,
        },
      }}
      SelectProps={{
        MenuProps: {
          PaperProps: {
            sx: {
              fontSize: isMobile ? 12 : 15,
            }
          }
        }
      }}
    />
  );
}

export default LinePagination; 