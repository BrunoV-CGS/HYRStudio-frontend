import {Modal, Box} from "@mui/material";

import UpdateBaseForm from "./UpdateBaseForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto",
};

export default function UpdateBaseModal({open, handleClose}) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <UpdateBaseForm onClose={handleClose } />
      </Box>
    </Modal>
  );
}
