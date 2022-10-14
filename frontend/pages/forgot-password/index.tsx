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
  Stack,
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

const ForgotPassword: NextPage = () => {
  const { reportMessage } = useApplicationContext();
  const [validEmail, setValidEmail] = useState<boolean>(true);
  const [validPassword, setValidPassword] = useState(true);
  const [email, setEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [match, setMatch] = useState(true);
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const router = useRouter();
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

  const [setRequestSendCode] = useAuthedApiCall({
    requestInfo: {} as any,
    requireAuth: false,
    callbackAfter: () => {
      reportMessage(
        `Sent an email with verification code to ${email}`,
        "success"
      );
      setVerificationCodeSent(true);
    },
  });
  const [setRequestChangePassword] = useAuthedApiCall({
    requestInfo: {} as any,
    requireAuth: false,
    callbackAfter: () => {
      router.push("/login");
    },
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    if (!verificationCodeSent) {
      const email = data.get("email") as string;
      if (!validEmail) {
        reportMessage("Email is not valid", "error");
        return;
      }
      setRequestSendCode({
        method: "get" as Method,
        url: `/auth/forgot-password?email=${encodeURIComponent(email)}`,
      });
    } else {
      const code = data.get("code") as string;
      const password = data.get("password") as string;
      const confirmPassword = data.get("confirmPassword") as string;
      const hashedPassword = bcrypt.hashSync(password, SALT);
      if (code === "") {
        reportMessage("Please enter code", "error");
        return;
      }
      if (password === "") {
        reportMessage("Please enter password", "error");
        return;
      }
      if (!validPassword) {
        reportMessage("Password is not strong", "error");
        return;
      }
      if (password !== confirmPassword) {
        reportMessage("Two passwords do not match", "error");
        setConfirmPassword("");
        return;
      }
      setRequestChangePassword({
        method: "put" as Method,
        url: "/auth/reset-password",
        data: {
          email,
          code,
          password: hashedPassword,
        },
      });
    }
  };

  const validateEmail = (event: any) => {
    const email = event.target.value;
    setValidEmail(validator.isEmail(email));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCodeSent(false);
    setEmail(e.target.value);
  };

  return (
    <>
      <Head>
        <title>Forgot Password - Where2Park</title>
        <meta name='description' content='Where2Park Forget Password' />
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
            Account Recovery
          </Typography>
          <Stack
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
            spacing={2}
          >
            <TextField
              margin='normal'
              disabled={verificationCodeSent}
              required
              fullWidth
              value={email}
              onChange={handlePasswordChange}
              error={!validEmail}
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              helperText={validEmail ? "" : "Email is invalid"}
              onBlur={validateEmail}
            />
            {verificationCodeSent && (
              <>
                <Typography>
                  An email with a verification code was just sent to {email}
                </Typography>
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  name='code'
                  label='Enter code'
                  type='code'
                  id='code'
                  autoComplete='off'
                />
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
              </>
            )}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              {verificationCodeSent ? "Confirm" : "Next"}
            </Button>
            {verificationCodeSent && (
              <Button
                fullWidth
                variant='outlined'
                onClick={() => setVerificationCodeSent(false)}
              >
                Cancel
              </Button>
            )}
          </Stack>
        </Container>
      </MainContainer>
    </>
  );
};

export default ForgotPassword;
