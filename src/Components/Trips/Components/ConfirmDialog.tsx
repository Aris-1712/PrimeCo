import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

const ConfirmDialog = (props: any) => {
  const { open, onClose, contentText, title, submitHanlder } = props;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{contentText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={submitHanlder}>Okay</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
