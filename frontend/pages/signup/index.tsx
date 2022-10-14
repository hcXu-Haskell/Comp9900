import { useState } from "react";
// next
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
// mui
import {
  Container,
  Avatar,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Link,
} from "@mui/material";
// internal
import useApplicationContext from "hooks/useApplicationContext";
import useAuthedApiCall from "hooks/useAuthedApiCall";
import MainContainer from "components/MainContainer";
import { PASSWORD_RULE, SALT } from "utils/constants";
// third-party
import { Method } from "axios";
import bcrypt from "bcryptjs";
import validator from "validator";

const SignUp: NextPage = () => {
  const { setToken, reportMessage } = useApplicationContext();
  const [inputPassword, setInputPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [match, setMatch] = useState(true);
  const [validName, setValidName] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const router = useRouter();
  const { jump } = router.query;

  const [setRequestSignup] = useAuthedApiCall<{ token: string }>({
    requestInfo: {} as any,
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
    requireAuth: false,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const confirmPassword = data.get("confirmPassword") as string;
    const hashedPassword = bcrypt.hashSync(password, SALT);

    if (!validName || name === "") {
      reportMessage("Name is invalid", "error");
    } else if (!validEmail || email === "") {
      reportMessage("Email is invalid", "error");
    } else if (!validPassword || password === "") {
      reportMessage("Password is not strong", "error");
    } else if (password !== confirmPassword) {
      reportMessage("Two passwords do not match", "error");
    } else {
      setRequestSignup({
        method: "post" as Method,
        url: "/auth/register",
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
    }
  };

  const updatePassword = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const password = (event.target as HTMLInputElement).value;
    setMatch(password === confirmPassword);
    setInputPassword(password);
    setValidPassword(validator.isStrongPassword(password));
  };

  const checkPassword = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const password = (event.target as HTMLInputElement).value;
    setConfirmPassword(password);
    setMatch(password === inputPassword);
  };

  const validateName = (event: any) => {
    const name = event.target.value;
    setValidName(!validator.isEmpty(name));
  };

  const validateEmail = (event: any) => {
    const email = event.target.value;
    setValidEmail(validator.isEmail(email));
  };

  return (
    <>
      <Head>
        <title>Sign up - Where2Park</title>
        <meta name='description' content='Where2Park Sign Up' />
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
          <Typography component='h1' variant='h5'>
            Sign Up
          </Typography>
          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={!validName}
                  id='name'
                  label='Name'
                  name='name'
                  helperText={validName ? "" : "Name is empty"}
                  autoComplete='name'
                  onBlur={validateName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={!validEmail}
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  helperText={validEmail ? "" : "Email is invalid"}
                  onBlur={validateEmail}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={!validPassword}
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  helperText={
                    validPassword
                      ? inputPassword === ""
                        ? PASSWORD_RULE
                        : ""
                      : PASSWORD_RULE
                  }
                  onBlur={updatePassword}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={!match}
                  name='confirmPassword'
                  label='Confirm Password'
                  type='password'
                  id='confirm-password'
                  autoComplete='new-password'
                  helperText={match ? "" : "Passwords do not match"}
                  onChange={checkPassword}
                  onBlur={checkPassword}
                />
              </Grid>
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Link href='/login' variant='body2'>
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </MainContainer>
    </>
  );
};

export default SignUp;
