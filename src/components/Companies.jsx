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
  Typography,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import useCompanies from "../hooks/useCompanies";
import EditCompanyModal from "./EditCompanyModal";
import CreateCompanyModal from "./CreateCompanyModal";

const columns = [
  {name: "Company Name", uid: "name"},
  {name: "Mixpost ID", uid: "id"},
  {name: "Actions", uid: "actions"},
];

export default function Companies() {
  const {fetchCompanies} = useCompanies();

  const [companies, setCompanies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchData = async () => {
    const data = await fetchCompanies();
    setCompanies(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (row) => {
    setSelectedRow(row);
    setIsCreating(false);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setIsCreating(true);
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
        return <Typography variant='body2'>{row.name}</Typography>;
      case "id":
        return <Typography variant='body2'>{row.id}</Typography>;
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
        <h2 className='text-left mb-4 text-2xl/9 font-bold tracking-tight text-gray-900'>
          Companies
        </h2>
        <button
          className='rounded-md bg-indigo-600 h-10 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          onClick={handleCreate}
        >
          Create Company
        </button>
      </Stack>

      <TableContainer component={Paper}>
        <Table aria-label='Companies Table'>
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
            {companies.length > 0 ? (
              companies.map((company) => (
                <TableRow key={company.id} hover>
                  {columns.map((col) => (
                    <TableCell key={col.uid} align='center'>
                      {renderCell(company, col.uid)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  No companies found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!isCreating && selectedRow && (
        <EditCompanyModal
          open={modalOpen}
          handleClose={handleModalClose}
          rowData={selectedRow}
          fetchData={fetchData}
        />
      )}

      {isCreating && (
        <CreateCompanyModal
          open={modalOpen}
          handleClose={handleModalClose}
          fetchData={fetchData}
        />
      )}
    </>
  );
}
