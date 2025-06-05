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
  {name: "Persona", uid: "persona"},
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

    const reviewedFiltered = reviewed
      .filter((item) => item.persona === companyName)
      .map((item) => ({...item, type: "reviewed"}));

    const reviewedIds = new Set(reviewedFiltered.map((item) => item.id));

    const generatedFiltered = generated
      .filter(
        (item) => item.persona === companyName && !reviewedIds.has(item.id)
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
      case "persona":
      case "topic":
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
              <Chip key={kw} label={kw} size='small' sx={{mr: 0.5, mb: 0.5}} />
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <TableContainer component={Paper} sx={{maxHeight: 600, overflowY: "auto"}}>
      <Table stickyHeader aria-label='Images Request Table'>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.uid}
                align='center'
                sx={
                  col.uid === "actions"
                    ? {width: 150}
                    : col.uid === "topic"
                      ? {width: 200}
                      : col.uid === "content"
                        ? {width: 350}
                        : col.uid === "keywords"
                          ? {width: 150}
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
