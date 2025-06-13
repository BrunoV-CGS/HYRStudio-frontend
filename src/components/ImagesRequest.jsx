import {useEffect, useState} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Button,
} from "@mui/material";
import useContent from "../hooks/useContent";
import useUserLoginStore from "../hooks/useUserLoginStore";

const columns = [
  {name: "Topic", uid: "topic"},
  {name: "Keywords", uid: "keywords"},
  {name: "Network", uid: "network"},
  {name: "Content", uid: "content"},
  {name: "Actions", uid: "actions"},
];

export default function ImagesRequest() {
  const {fetchReviewedContent, fetchGeneratedContent} = useContent();
  const [content, setContent] = useState([]);
  const {getUserCompanies} = useUserLoginStore();
  const userCompanies = getUserCompanies();
  const {handleGoogleGenerateImage} = useContent();

  const fetchData = async () => {
    const [reviewed, generated] = await Promise.all([
      fetchReviewedContent(),
      fetchGeneratedContent(),
    ]);

    const companyName = userCompanies.companyName;

    const reviewedFiltered = reviewed.filter(
      (item) =>
        item.persona === companyName &&
        item.posted === false &&
        typeof item.reviewed === "boolean"
    );

    const reviewedIds = new Set(reviewedFiltered.map((item) => item.id));

    const generatedFiltered = generated
      .filter(
        (item) =>
          item.persona === companyName &&
          !reviewedIds.has(item.id) &&
          item.posted === false
      )
      .map((item) => ({...item, type: "generated"}));

    const merged = [...reviewedFiltered, ...generatedFiltered];
    setContent(merged);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateImage = (row) => {
    handleGoogleGenerateImage(row);
  };

  const renderCell = (row, columnKey) => {
    switch (columnKey) {
      case "topic":
        return (
          <Typography
            variant='body2'
            sx={{height: "60px", width: "170px", overflow: "auto"}}
          >
            {row[columnKey]}
          </Typography>
        );

      case "content":
        return (
          <Typography
            variant='body2'
            sx={{maxHeight: "60px", width: "350px", overflow: "auto"}}
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
                sx={{maxHeight: "60px", width: "90px", overflow: "auto"}}
              />
            ))}
          </>
        );

      case "network":
        return <Chip label={row.network} color='primary' size='small' />;

      case "actions":
        return (
          <div className='flex flex-col gap-1'>
            <Button
              variant='contained'
              size='small'
              sx={{minHeight: "unset", paddingY: "4px", fontSize: "0.65rem"}}
              onClick={() => handleGenerateImage(row)}
            >
              Generate Image
            </Button>
            <Button
              variant='contained'
              size='small'
              color='secondary'
              sx={{minHeight: "unset", paddingY: "4px", fontSize: "0.65rem"}}
              onClick={() => handleGenerateImage(row)}
            >
              Re-Generate Image
            </Button>
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
    <TableContainer component={Paper} sx={{maxHeight: 600, maxWidth: "100%", overflowY: "auto"}}>
      <Table stickyHeader aria-label='Images Request Table'>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.uid}
                align='center'
                sx={
                  col.uid === "actions"
                    ? {width: 170}
                    : col.uid === "topic"
                      ? {width: 170}
                    : col.uid === "keywords"
                      ? {width: 220}
                    : col.uid === "network"
                      ? {width: 50}
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
              <TableRow key={row.id} hover sx={{height: 70}}>
                {columns.map((col) => (
                  <TableCell
                    key={col.uid}
                    align='center'
                    sx={{maxHeight: 70, overflowY: "auto"}}
                  >
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
