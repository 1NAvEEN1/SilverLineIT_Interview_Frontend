import React from "react";
import animationData from "../../assets/Animations/searching.json";
import JsonAnimation from "../../components/Lottie/JsonAnimation";
import Glassmophism from "../../components/Glassmophism/Glassmophism";
import background from "../../assets/background.jpg";
import { Box, Grid, Typography } from "@mui/material";

const Test = () => {

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
