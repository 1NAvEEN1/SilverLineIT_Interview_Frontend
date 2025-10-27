import React from 'react'
import { Grid ,Box, Button, Dialog, Typography } from '@mui/material'
import bookNowConfirmationIcon from '../../assets/images/Apple.png'
import JsonAnimation from '../Lottie/JsonAnimation';

// {showModal && (
//     <PopupAlert show={showModal} setShow={setShowModal} message={message} animation={animation} />
//   )}


function PopupAlert({show,setShow,message , animation}) {
    const [open, setOpen] = React.useState(false);

 
    const handleClose = () => {
      setOpen(false) 
      setShow(false)
    };
  
    React.useEffect(() => {
     
        setOpen(show);
  
    }, [show]);
  
  

  return (
    <Dialog  //confirmation modal   
    open={open}
    onClose={handleClose}
    sx={{
        '& .MuiDialog-paper': {
            borderRadius: 10,
            boxShadow: 4,
            p: 0,
            m: 0,
        }
    }
    }
    maxWidth="sm"
    slotProps={{

        backdrop: {
            sx: {
                background: "rgba(0,0,0,0.4)",

            },
        },
    }}>
    <Box sx={{
        minWidth: '100%',
        width: { sm: 500, xs: 350 },
        height: { sm: 150, xs: 100 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
    }}>
        <Grid container >
            <Grid item xs={3} display={"flex"} justifyContent={"center"} alignItems={"center"} >

            <JsonAnimation  jsonAnimation ={animation} height={100} width={100}  />
        {/* <Box
            component={'img'}
            src={bookNowConfirmationIcon}
            sx={{
                width: { sm: 130, xs: 100 },
                height: { sm: 130, xs: 100 },
            }} 
            /> */}
            </Grid>
            <Grid item xs={9} display={"flex"} justifyContent={"start"} alignItems={"center"} >
        <Typography sx={{
            fontFamily: 'Arial',
            fontSize: { sm: '25px', xs: '20px' },
            fontWeight: 700,
            textAlign: 'center'
        }
        } >
            {message}
        </Typography>
        </Grid>
        {/* <Box sx={{
            // width: '100%',
            // px: { md: 6, sm: 3, xs: 1 },
        }}>
            <Typography sx={{
                fontFamily: 'Arial',
                fontSize: { xs: '10px', },
                fontWeight: 400,
                textAlign: 'center',
                color: '#757575',
            }} >
                Lorem Ipsum Generator 
            </Typography>
        </Box> */}

</Grid>
       
    </Box>
</Dialog>
  )
}

export default PopupAlert
