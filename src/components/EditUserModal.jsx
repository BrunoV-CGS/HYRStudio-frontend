import React, {useEffect} from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Stack,
  Autocomplete,
} from "@mui/material";
import {useForm, Controller} from "react-hook-form";
import useUsers from "../hooks/useUsers";

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

export default function EditUserModal({
  open,
  handleClose,
  rowData,
  fetchData,
  availableCompanies,
}) {
  const {updateUser} = useUsers();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: {isSubmitting},
  } = useForm({
    defaultValues: {
      id: "",
      email: "",
      name: "",
      role: "",
      allowed: true,
      companies: [],
    },
  });

  useEffect(() => {
    if (rowData) {
      reset({
        ...rowData,
        companies: rowData.companies ?? [],
      });
    }
  }, [rowData, reset]);

  const onSubmit = async (data) => {
    const {email, ...userData} = data;
    const payload = {
      ...userData,
      companies: (data.companies ?? []).map((c) => ({
        companyId: c.companyId || c.id, // admite ambos formatos
      })),
    };
    handleClose();
    await updateUser(email, payload);
    await fetchData();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant='h6' gutterBottom>
          Edit User
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label='Email'
            fullWidth
            margin='normal'
            disabled
            {...register("email")}
          />

          <TextField
            label='Name'
            fullWidth
            margin='normal'
            {...register("name", {required: "Required"})}
          />

          <Controller
            name='role'
            control={control}
            render={({field}) => (
              <FormControl fullWidth margin='normal'>
                <InputLabel id='role-label'>Role</InputLabel>
                <Select
                  {...field}
                  labelId='role-label'
                  label='Role'
                  defaultValue='creator'
                >
                  <MenuItem value='admin'>Admin</MenuItem>
                  <MenuItem value='creator'>Creator</MenuItem>
                  <MenuItem value='viewer'>Viewer</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name='allowed'
            control={control}
            render={({field: {value, onChange}}) => (
              <FormControlLabel
                sx={{mt: 1}}
                control={
                  <Switch
                    checked={value}
                    onChange={(_, checked) => onChange(checked)}
                    color='primary'
                  />
                }
                label='Allowed'
              />
            )}
          />

          <Typography variant='subtitle1' sx={{mt: 2}}>
            Companies
          </Typography>
          <Controller
            name='companies'
            control={control}
            render={({field: {value, onChange}}) => (
              <Autocomplete
                multiple
                options={availableCompanies}
                isOptionEqualToValue={(opt, val) =>
                  (opt.id || opt.companyId) === (val.id || val.companyId)
                }
                getOptionLabel={(opt) =>
                  opt.name || opt.companyName || opt.id || "Unknown"
                }
                value={value}
                onChange={(_, newValue) => onChange(newValue)}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      label={option.name || option.companyName || option.id}
                      {...getTagProps({index})}
                      key={option.id || option.companyId || index}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    placeholder='Select companies...'
                    margin='normal'
                  />
                )}
              />
            )}
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
