import {Modal, Box, Typography, TextField, Button, Stack} from "@mui/material";
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

export default function CreateCompanyModal({open, handleClose, fetchData}) {
  const {createCompany} = useCompanies();

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

  const onSubmit = async (data) => {
    handleClose();
    await createCompany(data);
    reset();
    await fetchData();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant='h6' gutterBottom>
          Create Company
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
              Create
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
