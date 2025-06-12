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
import useBlogs from "../hooks/useBlogs";
import Swal from "sweetalert2";

const columns = [
  {name: "Topic", uid: "topic"},
  {name: "Keywords", uid: "keywords"},
  {name: "Neuron", uid: "neuron"},
  {name: "Content", uid: "content"},
  {name: "Actions", uid: "actions"},
];

export default function NeuronWriter() {
  const {fetchReviewedContent, deleteReviewedPost} = useContent();
  const [content, setContent] = useState([]);
  const {getUserCompanies} = useUserLoginStore();
  const {createBlogPost} = useBlogs();
  const userCompanies = getUserCompanies();

  const fetchData = async () => {
    const externalData = await fetchReviewedContent();
    console.log(externalData);

    const filteredData = externalData.filter(
      (item) =>
        item.persona === userCompanies.companyName &&
        item.reviewed === true &&
        item.posted === false &&
        item.network === "blog" &&
        item.neuron_analyzed === false
    );
    setContent(filteredData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendToMixpost = (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This content will be sent to the Website.",
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
            reviewedPostId: row.id,
            topic: row.topic,
            content: row.content,
            imageUrl: row.imageUrl ?? "",
            industry: row.industry ?? "",
            keywords: row.keywords ?? [],
            persona: row.persona ?? "",
          };

          await createBlogPost(payload);
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
      const success = await deleteReviewedPost(row.id);
      if (success) {
        await fetchData();
      }
    }
  };

  const renderCell = (row, columnKey) => {
    switch (columnKey) {
      case "topic":
        return (
          <Typography variant='body2' sx={{height: "90px", overflow: "auto"}}>
            {row[columnKey]}
          </Typography>
        );

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
      case "neuron":
        return (
          <div className='w-30'>
            <button
              onClick={() => {
                if (row.neuron_url) {
                  window.open(row.neuron_url, "_blank");
                } else {
                  alert("Post not linked to Neuron Writer");
                }
              }}
              className='flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              See in NR
            </button>
          </div>
        );

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
              <Tooltip title='Upload'>
                <IconButton
                  color='primary'
                  onClick={() => handleSendToMixpost(row)}
                >
                  <BackupIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Eliminar'>
                <IconButton color='error' onClick={() => handleDeletePost(row)}>
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
                sx={
                  col.uid === "actions"
                    ? {width: 200}
                    : col.uid === "topic"
                      ? {width: 350}
                      : {}
                }
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
                No reviewed content to upload to blog
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
