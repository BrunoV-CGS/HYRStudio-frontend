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
  Button,
  IconButton,
  Chip,
  Typography,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BackupIcon from "@mui/icons-material/Backup";
import useContent from "../hooks/useContent";
import useUserLoginStore from "../hooks/useUserLoginStore";
import Swal from "sweetalert2";

const columns = [
  {name: "Persona", uid: "persona"},
  {name: "Topic", uid: "topic"},
  {name: "Keywords", uid: "keywords"},
  {name: "Network", uid: "network"},
  {name: "Content", uid: "content"},
  {name: "Actions", uid: "actions"},
];

export default function ReviewedContent() {
  const {fetchReviewedContent, sendToMixpost} = useContent();
  const [content, setContent] = useState([]);
  const {getUserCompanies} = useUserLoginStore();
  const userCompanies = getUserCompanies();
 
  const fetchData = async () => {
    const externalData = await fetchReviewedContent();

    const filteredData = externalData.filter(
      (item) => item.persona === userCompanies.companyName
    );

    setContent(filteredData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendToMixpost = (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This content will be sent to Mixpost.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send it",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const payload = {
            content: row.content,
            network: row.network.toLowerCase(),
            reviewedPostId: row.id,
            imageUrl: row.imageUrl || null,
          };

          await sendToMixpost(payload);
          Swal.fire(
            "Sent",
            "The content was successfully sent to Mixpost.",
            "success"
          );
          setContent((prev) => prev.filter((item) => item.id !== row.id));
        } catch (error) {
          Swal.fire("Error", "Failed to send the content.", "error");
          console.error("Error sending to Mixpost:", error);
        }
      }
    });
  };

  const renderCell = (row, columnKey) => {
    switch (columnKey) {
      case "persona":
      case "topic":
        return <Typography variant='body2'>{row[columnKey]}</Typography>;

      case "content":
        return (
          <Typography
            variant='body2'
            sx={{maxHeight: "60px", overflow: "auto"}}
          >
            {row[columnKey]}
          </Typography>
        );
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div>
              <Tooltip title='Enviar a Mixpost'>
                <IconButton
                  color='primary'
                  onClick={() => handleSendToMixpost(row)}
                >
                  <BackupIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Eliminar'>
                <IconButton
                  color='error'
                  onClick={() => console.log("Eliminar", row)}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            </div>
            <Button
              variant='outlined'
              size='small'
              onClick={() => {
                if (row.imageUrl) {
                  window.open(row.imageUrl, "_blank");
                } else {
                  alert("Post without image");
                }
              }}
            >
              See Image
            </Button>
          </div>
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
    </TableContainer>
  );
}
