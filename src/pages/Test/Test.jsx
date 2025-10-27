import React, { useEffect } from "react";
import { showLoadingAnimation } from "../../app/loadingAnimationController";
import { showAlertMessage } from "../../app/alertMessageController";
import animationData from "../../assets/Animations/searching.json";
import JsonAnimation from "../../components/Lottie/JsonAnimation";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../reducers/userSlice";
import Glassmophism from "../../components/Glassmophism/Glassmophism";
import background from "../../assets/background.jpg";
import { Box, Grid, Typography } from "@mui/material";

const Test = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setToken({ token: "test" }));
    console.log("test 01");
  }, []);

  //showLoadingAnimation({ message: "Loading something..." });

  // changeMessage({ message: "Loading something..." });
  // hideLoadingAnimation();

  // showAlertMessage({
  //     message: "Login successful",
  //     type: "success",
  //   });

  const test = async () => {
    console.log("test");

    //  const response = await StudentService.userLogin(user, pwd);

    //   showLoadingAnimation({ message: "Loading something..." });

    //     showAlertMessage({
    //     message: "Login successful",
    //     type: "success",
    //   });
  };

  return (
    <div>
      {/* <button  onClick={()=>{test()}} >Primary</button> */}
      <div>
        <JsonAnimation height={200} width={200} jsonAnimation={animationData} />
      </div>
      <Box
        sx={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Glassmophism />
      </Box>
    </div>
  );
};

export default Test;
