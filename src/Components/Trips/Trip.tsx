import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import "react-datepicker/dist/react-datepicker.css";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import ModalField from "./Components/Dialog";
import EditingGrid from "./EditingGrid";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import Loader from "../Loader";
import axios from "axios";
import { Delete, Save } from "@mui/icons-material";
import ConfirmDialog from "./Components/ConfirmDialog";

const Trip = () => {
  const params = useParams();
  const [formData, setformData] = useState<any>({
    driverId: { val: "" },
    deliveryDate: { val: moment(new Date()) },
  });
  const { state } = useLocation();
  const [masterData, setMasterData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [dnNo, setDnNo] = useState("");
  const [dnNos, setDnNos] = useState<any>([]);
  const [dnModal, setdnModal] = useState(false);
  const [drivers, setDrivers] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [customers, setCustomers] = useState<any>([]);
  const [deleteDn, setDeleteDn] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<any>();
  const navigate = useNavigate();
  const getDrivers = async () => {
    try {
      setLoading(true);
      let responseDrivers = await axios.get(
        "https://primeco-backend.onrender.com/individual/drivers"
      );
      let responseCustomers = await axios.get(
        "https://primeco-backend.onrender.com/individual/customers"
      );
      let responseProduct = await axios.get("https://primeco-backend.onrender.com/product");
      let driversArr: any[] = responseDrivers?.data?.map((item: any) => ({
        id: item?._id,
        label: item?.name,
      }));
      let customersArr: any[] = responseCustomers?.data?.map((item: any) => ({
        id: item?._id,
        label: item?.name,
      }));
      let productsArr: any[] = responseProduct?.data?.map((item: any) => ({
        id: item?._id,
        label: item?.name,
      }));
      setProducts([...productsArr]);
      setCustomers([...customersArr]);
      setDrivers([...driversArr]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getTripDetails = async () => {
    try {
      setLoading(true);
      let resp = await axios.get(
        `https://primeco-backend.onrender.com/inbound/trips/${params.id}`
      );
      let copyFormData: any = {};
      copyFormData.driverId = { val: resp.data?.[0]?.driverId };
      copyFormData.deliveryDate = {
        val: moment(new Date(resp.data?.[0]?.deliveryDate)),
      };
      let dnsArr: any = [];
      let tempRows: any = [];
      resp?.data?.forEach((item: any) => {
        let dnsExists = dnsArr?.find((e:any)=>e === item?.dnNo)
        if(!dnsExists){
          dnsArr.push(item?.dnNo);
        }
        tempRows.push({
          id: uuidv4(),
          customerId: item?.customerId,
          productId: item?.productId,
          qty: item?.qty,
          location: item?.location,
          remarks: item?.remarks,
          dnid: item?.dnNo,
        });
      });
      setDnNos([...dnsArr]);
      setMasterData([...tempRows]);
      setformData({ ...copyFormData });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDrivers();
    if (state?.edit) {
      getTripDetails();
    }
  }, []);

  // const getRowLength = (dnid: any) => {
  //   return masterData?.filter((item: any) => item?.dnid === dnid)?.length + 1;
  // };

  const addRowHandler = (dnid: any) => {
    let tempRows = [...masterData];
    tempRows.push({
      id: uuidv4(),
      customerId: "",
      productId: "",
      qty: 0,
      location: "",
      remarks: "",
      dnid,
    });
    setMasterData([...tempRows]);
  };
  const rowDeleteHandler = (rowId: any) => {
    let tempRows = masterData?.filter((item: any) => item?.id !== rowId);
    setMasterData([...tempRows]);
  };

  const updateRow = (updatedRow: any) => {
    let tempRows: any = masterData?.map((item: any) => {
      if (item?.id === updatedRow?.id) {
        return updatedRow;
      }
      return item;
    });
    setMasterData([...tempRows]);
  };

  const dnModalHandler = () => {
    setdnModal(!dnModal);
  };

  const deleteHandler = () => {
    let tempData = masterData?.filter((item: any) => item?.dnid !== deleteData);
    let tempDnos = dnNos?.filter((item: any) => item !== deleteData);
    setMasterData([...tempData]);
    setDnNos([...tempDnos]);
    setDeleteDn(false);
  };

  const save = async () => {
    try {
      setLoading(true);
      let payload: any = {
        tripId: params?.id,
        driverId: formData?.driverId?.val,
        dns: [],
      };
      masterData?.forEach((item: any) => {
        console.log(item)
        let dnObj = {
          dnNo: item?.dnid,
          deliveryDate: formData?.deliveryDate?.val,
          customerId: customers?.find(
            (cust: any) => cust?.id === item?.customerId || cust?.label === item?.customerId
          )?.id,
          productId: products?.find(
            (prod: any) => prod?.id === item?.productId || prod?.label === item?.productId
          )?.id,
          qty: item?.qty,
          location: item?.location,
          remarks: item?.remarks,
        };
        payload.dns.push(dnObj);
      });

      let resp = await axios.post(
        "https://primeco-backend.onrender.com/inbound/addDn",
        payload
      );
      navigate("/trips");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const autoCompleteRender = useCallback(() => {
    let value = drivers.find(
      (item: any) => item?.id === formData?.driverId?.val
    );
    return (
      <Autocomplete
        id="combo-box-demo"
        options={drivers}
        sx={{ width: 300 }}
        value={value || { id: "", label: "" }}
        onChange={(e, value: any) => {
          setformData({ ...formData, driverId: { val: value?.id } });
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    );
  }, [formData,drivers]);

  return (
    <>
      {loading && <Loader />}
      <Grid container spacing={2}>
        <Grid xs={12} md={12} lg={12} xl={12} item>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h4">
              {state?.edit ? `Edit Trip: ${params?.id}` : "Add Trip Details"}</Typography>
            <Button
              color="primary"
              startIcon={<Save />}
              disabled={!masterData?.length}
              onClick={() => {
                save();
              }}
            >
              Save Details
            </Button>
          </Box>
        </Grid>
        {!state?.edit && <Grid xs={12} md={12} lg={12} xl={12} item>
          <Alert severity="success">
            {`Your trip id genreated is ${params?.id}.`}
          </Alert>
        </Grid>}
        <Grid xs={12} md={12} lg={12} xl={12} item container spacing={2}>
          <Grid xs={12} md={12} lg={12} xl={12} item>
            <Typography variant="subtitle1">Select Driver:</Typography>
            {autoCompleteRender()}
          </Grid>
          <Grid xs={12} md={12} lg={12} xl={12} item>
            <Typography variant="subtitle1">Delivery Date:</Typography>
            <DatePicker
              format="DD/MM/YYYY"
              maxDate={!state?.edit && moment(new Date()).add(1, "d")}
              onError={(err: any) => {
                err &&
                  setformData({
                    ...formData,
                    deliveryDate: { ...formData?.deliveryDate, error: true },
                  });
              }}
              minDate={!state?.edit && moment(new Date())}
              value={moment(formData?.deliveryDate?.val)}
              onChange={(val: any) => {
                setformData({
                  ...formData,
                  deliveryDate: { val: val?.toDate() },
                });
              }}
            />
            {formData?.deliveryDate?.error && (
              <Typography variant="body2" color={"#A93A3A"}>
                Invalid Date
              </Typography>
            )}
          </Grid>
          <Grid xs={12} md={12} lg={12} xl={12} item>
            <Box mt={2}>
              <Button
                onClick={dnModalHandler}
                startIcon={<AddIcon />}
                variant="outlined"
              >
                Add DN
              </Button>
            </Box>
          </Grid>
          <Grid xs={12} md={12} lg={12} xl={12} item spacing={4}>
            {dnNos?.map((item: any) => (
              <Box my={2}>
                <Box display={"flex"} alignItems={"center"} mb={2}>
                  <Typography mr={2} variant="h6">
                    DN: {item}
                  </Typography>
                  <Button
                    color="primary"
                    startIcon={<Delete />}
                    onClick={() => {
                      setDeleteDn(true);
                      setDeleteData(item);
                    }}
                  >
                    Delete DN
                  </Button>
                </Box>
                <EditingGrid
                  products={products}
                  customers={customers}
                  updateRow={(updatedData: any) => updateRow(updatedData)}
                  rowDeleteHandler={(id: any) => {
                    rowDeleteHandler(id);
                  }}
                  addRowHandler={(id: any) => {
                    addRowHandler(id);
                  }}
                  rows={masterData?.filter((e: any) => e?.dnid === item)}
                  dnid={item}
                />
              </Box>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <ConfirmDialog
        contentText={`Are you sure you want to delete ${deleteData}`}
        title="Delete"
        open={deleteDn}
        onClose={() => {
          setDeleteDn(false);
        }}
        submitHanlder={() => {
          deleteHandler();
        }}
      />
      <ModalField
        open={dnModal}
        onClose={dnModalHandler}
        contentText="Please enter the DN Number"
        title="DN Number"
        onChange={(e: any) => {
          setDnNo(e.target.value);
        }}
        submitHanlder={() => {
          setDnNos([...dnNos, dnNo]);
          dnModalHandler();
        }}
      />
    </>
  );
};

export default Trip;
