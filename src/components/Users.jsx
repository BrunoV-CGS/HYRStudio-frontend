import {useEffect, useState} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Chip,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import useUsers from "../hooks/useUsers";
import useCompanies from "../hooks/useCompanies";
import EditUserModal from "./EditUserModal";
import CreateUserModal from "./CreateUserModal"; // 👈 nuevo componente

const columns = [
  {name: "Name", uid: "name"},
  {name: "Email", uid: "email"},
  {name: "Role", uid: "role"},
  {name: "Companies", uid: "companies"},
  {name: "Actions", uid: "actions"},
];

export default function Users() {
  const {fetchUsers} = useUsers();
  const {fetchCompanies} = useCompanies();

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isCreating, setIsCreating] = useState(false); // 👈 distingue entre create y edit

  const fetchData = async () => {
    const userData = await fetchUsers();
    const companyData = await fetchCompanies();
    setUsers(userData);
    setCompanies(companyData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (row) => {
    setSelectedRow(row);
    setIsCreating(false); // modo edición
    setModalOpen(true);
  };

  const handleCreate = () => {
    setIsCreating(true); // modo creación
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
    setIsCreating(false);
  };

  const renderCell = (row, columnKey) => {
    switch (columnKey) {
      case "name":
      case "email":
      case "role":
        return <Typography variant='body2'>{row[columnKey]}</Typography>;

      case "companies":
        return (
          <>
            {row.companies?.map((c, idx) => (
              <Chip
                key={idx}
                label={c.companyName || c.companyId}
                size='small'
                style={{marginRight: 4, marginBottom: 2}}
              />
            ))}
          </>
        );
      case "actions":
        return (
          <>
            <Tooltip title='Edit'>
              <IconButton color='primary' onClick={() => handleEdit(row)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton
                color='error'
                onClick={() => console.log("Eliminar", row)}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Stack direction='row' justifyContent='space-between' sx={{mb: 2}}>
        <Typography variant='h6'>Users</Typography>
        <button
          className='rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          onClick={handleCreate}
        >
          Create User
        </button>
      </Stack>

      <TableContainer component={Paper}>
        <Table aria-label='Users Table'>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.uid} align='center'>
                  {col.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id} hover>
                  {columns.map((col) => (
                    <TableCell key={col.uid} align='center'>
                      {renderCell(user, col.uid)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de edición */}
      {!isCreating && selectedRow && (
        <EditUserModal
          open={modalOpen}
          handleClose={handleModalClose}
          rowData={selectedRow}
          fetchData={fetchData}
          availableCompanies={companies}
        />
      )}

      {/* Modal de creación */}
      {isCreating && (
        <CreateUserModal
          open={modalOpen}
          handleClose={handleModalClose}
          fetchData={fetchData}
          availableCompanies={companies}
        />
      )}
    </>
  );
}
