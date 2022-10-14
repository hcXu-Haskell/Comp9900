import { Box, Typography } from "@mui/material";
import MainContainer from "components/MainContainer";
import { NextPage } from "next";
import Head from "next/head";

const NotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>404 Not Found - Where2Park</title>
        <meta name='description' content='Where2Park Not Found' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MainContainer>
        <Box
          sx={{
            fontSize: "1.25em",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography
            variant='subtitle2'
            fontWeight='bold'
            fontSize='inherit'
            component='span'
            sx={{ mr: 1 }}
          >
            404
          </Typography>
          <Typography fontSize='inherit' variant='subtitle1' component='span'>
            Page Not Found
          </Typography>
        </Box>
      </MainContainer>
    </>
  );
};

export default NotFound;
