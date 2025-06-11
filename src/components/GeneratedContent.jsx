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
} from "@mui/material";
import Swal from "sweetalert2";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import useContent from "../hooks/useContent";
import EditContentModal from "./EditContentModal";
import useUserLoginStore from "../hooks/useUserLoginStore";

const columns = [
  {name: "Persona", uid: "persona"},
  {name: "Topic", uid: "topic"},
  {name: "Keywords", uid: "keywords"},
  {name: "Network", uid: "network"},
  {name: "Industry", uid: "industry"},
  {name: "Language", uid: "language"},
  {name: "Actions", uid: "actions"},
];

export default function GeneratedContent() {
  const {fetchGeneratedContent, deleteGeneratedPost} = useContent();
  const [content, setContent] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const {getUserCompanies} = useUserLoginStore();
  const userCompanies = getUserCompanies();

  const fetchData = async () => {
    const externalData = await fetchGeneratedContent();

    const filteredData = externalData.filter(
      (item) =>
        item.persona === userCompanies.companyName && item.reviewed === false
    );

    setContent(filteredData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (row) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleDeletePost = async (row) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this post?",
      text: "This action cannot be undone",
      icon: "warning",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes, delete it",
      denyButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      const success = await deleteGeneratedPost(row.id);
      if (success) {
        await fetchData();
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  const handleSave = (updatedRow) => {
    setContent((prev) =>
      prev.map((item) => (item.id === updatedRow.id ? updatedRow : item))
    );
  };

  const renderCell = (row, columnKey) => {
    switch (columnKey) {
      case "persona":
      case "topic":
      case "industry":
      case "language":
        return <Typography variant='body2'>{row[columnKey]}</Typography>;

      case "keywords":
        return (
          <>
            {row.keywords.map((kw) => (
              <Chip
                key={kw}
                label={kw}
                size='small'
                style={{marginRight: 4, marginBottom: 2}}
              />
            ))}
          </>
        );

      case "network":
        return <Chip label={row.network} color='primary' size='small' />;

      case "actions":
        return (
          <>
            <Tooltip title='Edit'>
              <IconButton color='primary' onClick={() => handleEdit(row)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton color='error' onClick={() => handleDeletePost(row)}>
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
    <TableContainer component={Paper}>
      <Table aria-label='Content Table'>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.uid}
                align='center'
                sx={col.uid === "actions" ? {width: 200} : {}}
              >
                {col.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {content.length > 0 ? (
            content.map((row) => (
              <TableRow key={row.id} hover>
                {columns.map((col) => (
                  <TableCell key={col.uid} align='center'>
                    {renderCell(row, col.uid)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align='center'>
                No generated content for this company
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <EditContentModal
        open={modalOpen}
        handleClose={handleModalClose}
        rowData={selectedRow}
        onSave={handleSave}
        fetchData={fetchData}
      />
    </TableContainer>
  );
}
