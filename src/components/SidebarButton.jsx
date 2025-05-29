// components/SidebarButton.jsx
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import UpdateIcon from "@mui/icons-material/Update";

export default function SidebarButton({handleOpenModal, mini}) {
  return (
    <Box p={2}>
      <button
        className='flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        onClick={handleOpenModal}
      >
      <UpdateIcon/>  {mini ? null : "Update Base"}
      </button>
    </Box>
  );
}

SidebarButton.propTypes = {
  handleOpenModal: PropTypes.func.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  mini: PropTypes.bool, // ← lo inyecta DashboardLayout
};
