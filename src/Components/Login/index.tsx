import React, { useState } from "react";
import "./Login.css";
import { Box, Button, TextField, Typography } from "@mui/material";
import Logo from "../asset/primelogo.jpeg";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {

    const [formData, setformData] = useState<any>({email:"",password:""});
    const navigate = useNavigate();
   const loginHandler = async() => {
    try{
    let res:any = await axios.post("https://primeco-backend.onrender.com/auth/signin",formData);
    res.headers.get("x-auth-token") && localStorage.setItem("token",res.headers.get("x-auth-token"));
    navigate("/dashboard")
    }catch(err:any){
        console.log(err)
        toast?.error(err?.response?.data?.error || err?.response?.data?.message?.[0] || err?.message ||"Something went wrong")
    }
   }

   const changeHandler = (e:any,type:string) => {
    setformData({...formData,[type]:e.target.value})
   }

  return (
    <>
      <div className="login-bg"></div>
      <Box
        height={"100vh"}
        width={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <div className="login">
          <Box display={"flex"} justifyContent={"center"} my={2}>
            <img src={Logo} width={300} />
          </Box>
          <Box width={"100%"} mb={4} mt={6}>
            <TextField
              fullWidth
              required
              value={formData?.email}
              onChange={(e)=>{changeHandler(e,"email")}}
              id="outlined-required"
              label="Email Address"
              variant="standard"
            />
          </Box>
          <Box width={"100%"} my={4}>
            <TextField
              fullWidth
              onChange={(e)=>{changeHandler(e,"password")}}
              value={formData?.password}
              required
              id="outlined-required"
              label="Password"
              variant="standard"
              type="password"
            />
          </Box>
          <Box mt={6} mb={2}>
            <Button onClick={loginHandler} sx={{ padding: 2 }} fullWidth variant="contained">
              Login
            </Button>
          </Box>
        </div>
      </Box>
    </>
  );
};

export default Login;
