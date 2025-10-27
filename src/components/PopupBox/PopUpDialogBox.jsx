import React from "react";
import { Box, Button, Dialog, Typography } from "@mui/material";

function PopUpDialogBox({ show, setShow, message }) {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    setShow(false);
  };

  React.useEffect(() => {
    setOpen(show);
  }, [show]);

  return (
    <Dialog //confirmation modal
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      slotProps={{
        backdrop: {
          sx: {
            background: "rgba(0,0,0,0.4)",
          },
        },
      }}
    >
      <Box
        sx={{
          minWidth: "100%",
          width: { sm: 548, xs: 324 },
          height: { sm: 315, xs: 272 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          component={"img"}
          //  src={bookNowConfirmationIcon}
          sx={{
            width: { sm: 130, xs: 100 },
            height: { sm: 130, xs: 100 },
          }}
        />
        <Typography
          sx={{
            fontFamily: "Arial",
            fontSize: { sm: "25px", xs: "20px" },
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Do You Want to Confirm ?
        </Typography>
        <Box
          sx={{
            width: "100%",
            px: { md: 6, sm: 3, xs: 1 },
          }}
        >
          <Typography
            sx={{
              fontFamily: "Arial",
              fontSize: { xs: "10px" },
              fontWeight: 400,
              textAlign: "center",
              color: "#757575",
            }}
          >
            Lorem Ipsum Generator
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: { sm: 5, xs: 2 },
            mt: 2,
          }}
        >
          <Button
            sx={{
              width: { sm: 82, xs: 65 },
              height: { sm: 27, xs: 19 },
              border: "1px solid #0582CA",
              borderRadius: "5px",
            }}
            onClick={handleClose}
          >
            <Typography
              sx={{
                fontFamily: "Arial",
                fontSize: { sm: 13, xs: 10 },
                fontWeight: 400,
                color: "#000000",
              }}
            >
              No
            </Typography>
          </Button>
          <Button
            sx={{
              width: { sm: 82, xs: 65 },
              height: { sm: 27, xs: 19 },
              // border: '1px solid #0582CA',
              borderRadius: "5px",
              background: "#0582CA",
              "&:hover": {
                background: "#0582CA",
                color: "#FFFFFF",
              },
            }}
            //  onClick={handleYes}
          >
            <Typography
              sx={{
                fontFamily: "Arial",
                fontSize: { sm: 13, xs: 10 },
                fontWeight: 400,
                color: "#FFFFFF",
              }}
            >
              yes
            </Typography>
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default PopUpDialogBox;
