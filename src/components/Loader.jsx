import CircularProgress from "@mui/joy/CircularProgress";
import useLoader from "../hooks/useLoader"; // asegurate que el path es correcto

export default function Loader() {
  const {isLoading} = useLoader();

  if (!isLoading) return null;

  return (
    <div className='flex fixed top-0 left-0 z-50 items-center justify-center w-screen h-screen bg-gray-800 opacity-40'>
      <CircularProgress variant='solid' size='lg' />
    </div>
  );
}
