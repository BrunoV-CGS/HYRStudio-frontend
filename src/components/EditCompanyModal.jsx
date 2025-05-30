import {Modal, Box, Typography, TextField, Button, Stack} from "@mui/material";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import useCompanies from "../hooks/useCompanies";

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

export default function EditCompanyModal({
  open,
  handleClose,
  fetchData,
  rowData,
}) {
  const {updateCompany} = useCompanies();

  const {
    register,
    handleSubmit,
    reset,
    formState: {isSubmitting},
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (rowData) {
      reset({name: rowData.name});
    }
  }, [rowData, reset]);

  const onSubmit = async (data) => {
    const payload = {
      id: rowData.id,
      name: data.name,
    };

    await updateCompany(payload);
    handleClose();
    reset();
    await fetchData();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant='h6' gutterBottom>
          Edit Company
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label='Mixpost ID'
            fullWidth
            margin='normal'
            {...register("id", {required: "Company name is required"})}
          />
          <TextField
            label='Company Name'
            fullWidth
            margin='normal'
            {...register("name", {required: "Company name is required"})}
          />

          <Stack direction='row' spacing={2} mt={3}>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={isSubmitting}
            >
              Save
            </Button>
            <Button variant='outlined' onClick={handleClose}>
              Cancel
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
