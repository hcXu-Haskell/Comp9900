import { useState } from "react";
// next
import { useRouter } from "next/router";
import Head from "next/head";
import { NextPage } from "next";
// mui
import {
  Container,
  Avatar,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Link,
} from "@mui/material";
// internal
import useApplicationContext from "hooks/useApplicationContext";
import useAuthedApiCall from "hooks/useAuthedApiCall";
import MainContainer from "components/MainContainer";
import { SALT } from "utils/constants";
// third-party
import { Method } from "axios";
import bcrypt from "bcryptjs";
import validator from "validator";

const LogIn: NextPage = () => {
  const { setToken, reportMessage } = useApplicationContext();
  const [validEmail, setValidEmail] = useState<boolean>(true);
  const router = useRouter();
  const { jump } = router.query;

  const [setRequestLogin] = useAuthedApiCall<{ token: string }>({
    requestInfo: {} as any,
    requireAuth: false,
    callbackAfter: (data) => {
      if (data.token) {
        setToken(data.token);
        if (jump && typeof jump === "string") {
          router.push(jump);
        } else {
          router.push("/");
        }
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    if (!validEmail) {
      reportMessage("Email is not valid", "error");
    } else if (validator.isEmpty(password)) {
      reportMessage("Password is empty", "error");
    } else {
      const hashedPassword = bcrypt.hashSync(password, SALT);
      setRequestLogin({
        method: "post" as Method,
        url: "/auth/login",
        data: {
          email,
          password: hashedPassword,
        },
      });
    }
  };

  const validateEmail = (event: any) => {
    const email = event.target.value;
    setValidEmail(validator.isEmail(email));
  };

  return (
    <>
      <Head>
        <title>Log in - Where2Park</title>
        <meta name='description' content='Where2Park Log in' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MainContainer>
        <Container
          maxWidth='xs'
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }} />
          <Typography component='h1' variant='h5'>
            Log In
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              error={!validEmail}
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              helperText={validEmail ? "" : "Email is invalid"}
              onBlur={validateEmail}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item xs={8}>
                <Link href='/signup' variant='body2'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
              <Grid item xs={4} textAlign='right'>
                <Link href='/forgot-password' variant='body2'>
                  {"Forgot password?"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </MainContainer>
    </>
  );
};

export default LogIn;
