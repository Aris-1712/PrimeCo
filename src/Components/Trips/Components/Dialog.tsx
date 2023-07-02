import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

const ModalField = (props:any) => {
    const {open, onClose, contentText,title, onChange, submitHanlder} = props
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {contentText}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
        //   label="Email Address"
          type="text"
          fullWidth
          variant="standard"
          onChange={onChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={submitHanlder}>Okay</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalField;
