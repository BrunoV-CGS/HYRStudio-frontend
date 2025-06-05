import HYR_Studio_logo from "../assets/HYR_Studio_logo.png";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import {useForm, Controller} from "react-hook-form";
import useUserLoginStore from "../hooks/useUserLoginStore";
import {useNavigate} from "react-router-dom";

export function CompanySelection() {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      companyId: "",
    },
  });

  const navigate = useNavigate();
  const {getCompanies, setUserCompanies} = useUserLoginStore();
  const userCompanies = getCompanies();

  const submitForm = (data) => {
    const selectedCompany = userCompanies.find(
      (c) => c.companyId === data.companyId
    );
    if (selectedCompany) {
      setUserCompanies(selectedCompany);
      navigate(`/dashboard/${selectedCompany.companyId}`);
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit(submitForm)}
      sx={{maxWidth: 400, mx: "auto", my: 2}}
    >
      <div className='sm:mx-auto mt-30 sm:w-full sm:max-w-sm'>
        <img
          className='mx-auto h-auto w-full'
          src={HYR_Studio_logo}
          alt='Content Catalyst Logo'
        />
        <h2 className='mt-10 mb-12 text-center text-2xl/9 font-bold tracking-tight text-gray-900'>
          Choose a Company
        </h2>
      </div>

      <FormControl fullWidth margin='normal'>
        <InputLabel id='company-select-label'>Company</InputLabel>
        <Controller
          name='companyId'
          control={control}
          rules={{required: "Este campo es obligatorio"}}
          render={({field}) => (
            <Select
              {...field}
              labelId='company-select-label'
              label='Company'
              error={!!errors.companyId}
            >
              {userCompanies.map((company) => (
                <MenuItem key={company.companyId} value={company.companyId}>
                  {company.companyName}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.companyId && (
          <Typography color='error' variant='caption'>
            {errors.companyId.message}
          </Typography>
        )}
      </FormControl>

      <button
        type='submit'
        className='flex w-full mt-7 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        Select
      </button>
    </Box>
  );
}
