import React, {useState, useEffect} from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import useContent from "../hooks/useContent";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto",
};

export default function EditContentModal({
  open,
  handleClose,
  rowData,
  fetchData,
}) {
  const [formData, setFormData] = useState({
    persona: "",
    topic: "",
    keywords: [],
    network: "",
    industry: "",
    limit: "",
    content: "",
  });
  const {reviewPost} = useContent();

  useEffect(() => {
    if (rowData) {
      setFormData(rowData);
    }
  }, [rowData]);

  const handleChange = (field) => (event) => {
    setFormData({...formData, [field]: event.target.value});
  };

  const handleDeleteKeyword = (kw) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((k) => k !== kw),
    });
  };

  const handleSave = async () => {
    const dataToSend = {
      ...formData,
      postId: rowData.id,
    };
    handleClose();
    await reviewPost(dataToSend);
    await fetchData();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant='h6' gutterBottom>
          Edit Content
        </Typography>
        <div className='flex items-center gap-2 mb-2'>
          {" "}
          <TextField
            label='Persona'
            fullWidth
            margin='normal'
            value={formData.persona}
            onChange={handleChange("persona")}
          />
          <TextField
            label='Topic'
            fullWidth
            margin='normal'
            value={formData.topic}
            onChange={handleChange("topic")}
          />{" "}
        </div>

        <Typography variant='h7' gutterBottom>
          Keywords
        </Typography>
        <Stack direction='row' spacing={1} flexWrap='wrap' mb={2} mt={1}>
          {formData.keywords.map((kw) => (
            <Chip
              key={kw}
              label={kw}
              onDelete={() => handleDeleteKeyword(kw)}
            />
          ))}
        </Stack>

        <div className='flex items-center gap-2 mb-2'>
          <TextField
            label='Network'
            fullWidth
            margin='normal'
            value={formData.network}
            onChange={handleChange("network")}
          />
          <TextField
            label='Industry'
            fullWidth
            margin='normal'
            value={formData.industry}
            onChange={handleChange("industry")}
          />
          <TextField
            label='Limit'
            type='number'
            fullWidth
            margin='normal'
            value={formData.limit}
            onChange={handleChange("limit")}
          />
        </div>
        <TextField
          label='Content'
          fullWidth
          margin='normal'
          multiline
          rows={6}
          value={formData.content}
          onChange={handleChange("content")}
        />
        <Stack direction='row' spacing={2} mt={2}>
          <Button variant='contained' color='primary' onClick={handleSave}>
            Reviewed
          </Button>
          <Button variant='outlined' onClick={handleClose}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
