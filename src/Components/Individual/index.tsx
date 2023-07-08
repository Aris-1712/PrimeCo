import { Delete, Edit } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Loader from "../Loader";
import ConfirmDialog from "../Trips/Components/ConfirmDialog";

const Individual = () => {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Entity Name", flex: 1 },
    { field: "type", headerName: "Entity Type", flex: 1 },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: (params: any) => {
        console.log(params);
        return (
          <>
            <Box
              onClick={() => {
                setFormData({
                  name: params?.row?.name,
                  type: params?.row?.type,
                  _id: params?.row?._id,
                });
                editMode.current = true;
                setModalOpen(true);
              }}
              sx={{ cursor: "pointer" }}
            >
              <Edit />
            </Box>
            <Box
              onClick={() => {
                setDeleteData({
                  name: params?.row?.name,
                  type: params?.row?.type,
                  _id: params?.row?._id,
                });
                setDeleteModal(true);
              }}
              sx={{ cursor: "pointer" }}
              ml={2}
            >
              <Delete />
            </Box>
          </>
        );
      },
    },
  ];

  const [rows, setRows] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    type: "",
  });
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<any>({});
  const editMode = useRef<any>(false);
  const getProducts = async () => {
    try {
      setLoading(true);
      let resp = await axios.get(
        "https://primeco-backend.onrender.com/individual/all",{headers:{"Authorization":localStorage.getItem('token')}}
      );
      setRows([...resp.data]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const close = () => {
    setFormData({ name: "", type: "" });
    editMode.current = false;
    setModalOpen(false);
  };

  const save = async () => {
    try {
      setLoading(true);
      let resp = await axios.post(
        editMode?.current
          ? "https://primeco-backend.onrender.com/individual/edit"
          : "https://primeco-backend.onrender.com/individual/new",
        {
          ...formData,
        },{headers:{"Authorization":localStorage.getItem('token')}}
      );
      setModalOpen(false);
      setFormData({ name: "", type: "" });
      editMode.current = false;
      getProducts();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const deleteHandler = async () => {
    try {
      setLoading(true);
      let resp = await axios.post(
        "https://primeco-backend.onrender.com/product/delete",
        {
          ...deleteData,
        },{headers:{"Authorization":localStorage.getItem('token')}}
      );
      setDeleteModal(false);
      setDeleteData({ name: "", type: "" });
      getProducts();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Box mb={4}>
        <Typography variant="h4">Entities</Typography>
      </Box>
      <Box mb={4}>
        <Button
          onClick={() => {
            setModalOpen(true);
          }}
          variant="outlined"
        >
          Add New Entity
        </Button>
      </Box>
      <Box width={"50%"}>
        <DataGrid
          sx={{ minHeight: 400 }}
          disableRowSelectionOnClick={true}
          slots={{ toolbar: GridToolbar }}
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
        />
      </Box>
      <Dialog fullWidth maxWidth={"sm"} open={modalOpen} onClose={close}>
        <DialogTitle>Add/Edit Entity</DialogTitle>
        <DialogContent>
          <Box my={2}>
            <Typography mb={1} variant="subtitle1">
              Entity Name
            </Typography>
            <TextField
              fullWidth
              value={formData?.name}
              onChange={(e: any) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </Box>
          <Box>
            <Typography mb={1} variant="subtitle1">
              Entity Type
            </Typography>
            <Autocomplete
              id="combo-box-demo"
              defaultValue={formData?.type || { id: "", label: "" }}
              options={[
                { id: "DRIVER", label: "DRIVER" },
                { id: "CUSTOMER", label: "CUSTOMER" },
              ]}
              fullWidth
              //   sx={{ width: 300 }}
              onChange={(e: any, val: any) => {
                setFormData({ ...formData, type: val?.id });
              }}
              renderInput={(params: any) => <TextField {...params} />}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button
            onClick={() => {
              save();
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        contentText={`Are you sure you want to delete ${deleteData?.name}`}
        title="Delete"
        open={deleteModal}
        onClose={() => {
          setDeleteModal(false);
        }}
        submitHanlder={() => {
          deleteHandler();
        }}
      />
    </>
  );
};

export default Individual;
