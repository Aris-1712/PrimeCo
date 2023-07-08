import { Box, Button, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Loader from "../Loader";

const columns: GridColDef[] = [
  { field: "sn", headerName: "S.N", width: 50 },
  {
    field: "tripId",
    headerName: "TRIP ID",
    flex: 1,
    renderCell: (params: any) => {
      return (
        <Link to={`/trips/${params?.value}`} state={{ edit: true }}>
          {params?.value}
        </Link>
      );
    },
  },
  { field: "dnNo", headerName: "DN No.", flex: 1 },
  { field: "deliveryDate", headerName: "Delivery Date", flex: 1 },
  { field: "driverId", headerName: "Driver", flex: 1 },
  {
    field: "customerId",
    headerName: "Customer",

    flex: 1,
  },
  {
    field: "productId",
    headerName: "Product",

    flex: 1,
  },
  { field: "qty", headerName: "Quantity", flex: 1 },
  {
    field: "location",
    headerName: "Location",

    flex: 1,
  },
  { field: "remarks", headerName: "Remarks", flex: 1 },
];

const Trips = () => {
  const [rows, setRows] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [customers, setCustomers] = useState<any>([]);
  const navigate = useNavigate();

  const getDrivers = async () => {
    try {
      setLoading(true);
      let responseDrivers = await axios.get(
        "https://primeco-backend.onrender.com/individual/drivers",{headers:{"Authorization":localStorage.getItem('token')}}
      );
      let responseCustomers = await axios.get(
        "https://primeco-backend.onrender.com/individual/customers",{headers:{"Authorization":localStorage.getItem('token')}}
      );
      let responseProduct = await axios.get(
        "https://primeco-backend.onrender.com/product",{headers:{"Authorization":localStorage.getItem('token')}}
      );
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
      getAllTrip(customersArr, productsArr, driversArr);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const newTripHanlder = async () => {
    try {
      const response = await axios.get(
        "https://primeco-backend.onrender.com/inbound/tripId",{headers:{"Authorization":localStorage.getItem('token')}}
      );
      navigate(`/trips/${response?.data?.tripid}`);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTrip = async (custArr: any, proArr: any, driveArr: any) => {
    try {
      let result = await axios.get(
        "https://primeco-backend.onrender.com/inbound/trips",{headers:{"Authorization":localStorage.getItem('token')}}
      );
      setRows(
        result?.data?.map((item: any, ind: any) => ({
          ...item,
          sn: ind + 1,
          id: uuidv4(),
          deliveryDate: new Date(item?.deliveryDate).toDateString(),
          productId: proArr?.find((e: any) => e?.id === item?.productId)?.label,
          customerId: custArr?.find((e: any) => e?.id === item?.customerId)
            ?.label,
          driverId: driveArr?.find((e: any) => e?.id === item?.driverId)?.label,
        }))
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDrivers();
  }, []);

  return (
    <>
      {loading && <Loader />}
      <Grid wrap="wrap" container spacing={2}>
        <Grid xs={12} md={12} lg={12} xl={12} item>
          <Typography variant="h4">Trips</Typography>
        </Grid>
        <Grid xs={12} md={12} lg={12} xl={12} item>
          <Button onClick={newTripHanlder} variant="outlined">
            Create New Trip
          </Button>
        </Grid>
        <Grid xs={12} md={12} lg={12} xl={12} item>
          <Box my={2}>
            <Typography mb={2} variant="h6">
              All Trip Details:{" "}
            </Typography>
            <DataGrid
              sx={{ minHeight: 400 }}
              slots={{ toolbar: GridToolbar }}
              rows={rows}
              columns={columns}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Trips;
