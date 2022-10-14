import React, { useState, useCallback } from "react";
// next
import { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
// mui
import { Box, Avatar, Typography, TextField, Button } from "@mui/material";
// internal
import AdminNav from "components/AdminNav";
import MainContainer from "components/MainContainer";
import useAuthedApiCall from "hooks/useAuthedApiCall";
import { SALT } from "utils/constants";
import useApplicationContext from "hooks/useApplicationContext";
// third-party
import validator from "validator";
import { Method } from "axios";
import bcrypt from "bcryptjs";

const AdminLogin: NextPage = () => {
  const { reportMessage } = useApplicationContext();
  const [adminToken, setAdminToken] = useState("");
  const router = useRouter();
  const [validEmail, setValidEmail] = useState(true);
  const validateEmail = (event: any) => {
    const email = event.target.value;
    if (validator.isEmail(email)) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };
  const [setRequestLogin] = useAuthedApiCall<{ token: string }>({
    requestInfo: {} as any,
    requireAuth: false,
    callbackAfter: (data) => {
      if (data.token) {
        setAdminToken(data.token);
        localStorage.setItem("adminToken", data.token);
        router.push("/admin");
      }
    },
  });
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
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
          url: "/auth/admin/login",
          data: {
            email,
            password: hashedPassword,
          },
        });
      }
    },
    [reportMessage, setRequestLogin, validEmail]
  );
  return (
    <>
      <Head>
        <title>Admin Login - Where2Park</title>
        <meta name='description' content='Where2Park Admin Login' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MainContainer
        MyNav={() => (
          <AdminNav adminToken={adminToken} setAdminToken={setAdminToken} />
        )}
      >
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
          <Typography variant='h5'>Admin Log In</Typography>
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
          </Box>
        </Box>
      </MainContainer>
    </>
  );
};

export default AdminLogin;
