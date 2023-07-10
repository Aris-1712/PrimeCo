import { Box, Typography } from "@mui/material";
import Barchart from "./BarChart";
import { LineChart } from "./LineChart";

const Dashboard = () => {
  return (
    <>
    <Box mb={4}>
      <Typography variant="h4">Dashboard</Typography>
    </Box>
    <Box display={"flex"} justifyContent={"space-between"}>
    <Box className="box-shadow" sx={{height:300}} py={1} width={"49%"} display={"flex"} justifyContent={"center"}>
        <Barchart />
    </Box>
    <Box className="box-shadow" sx={{height:300}} py={1} width={"49%"} display={"flex"} justifyContent={"center"}>
        <LineChart />
    </Box>
    </Box>
    </>
  );
};
export default Dashboard;
