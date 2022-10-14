import { useCallback, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Stack,
  Typography,
  Radio,
  RadioGroup,
  Box,
  Checkbox,
  InputLabel,
  Input,
  InputAdornment,
  Button,
  Grid,
} from "@mui/material";
import useApplicationContext from "hooks/useApplicationContext";
import { ColorMode } from "hooks/useApplicationStates";
import useAuthedApiCall from "hooks/useAuthedApiCall";
import { Method } from "axios";

const Settings: React.FC = () => {
  const { mode, setMode, user, requestUser, reportMessage } =
    useApplicationContext();
  const [isDiscount, setIsDiscount] = useState(
    user?.discount_rate && user?.discount_rate > 0 ? true : false
  );
  const [setRequestUpdateUserInfo] = useAuthedApiCall({
    requestInfo: {} as any,
    callbackAfter: () => {
      requestUser();
      reportMessage("Updated successfully", "success");
    },
  });
  const handleSaveDiscountRate = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const discountRate = data.get("discount_rate");
      if (user) {
        setRequestUpdateUserInfo({
          method: "put" as Method,
          url: `/users/${user.id}`,
          data: {
            discount_rate: discountRate,
          },
        });
      }
    },
    [setRequestUpdateUserInfo, user]
  );

  const handleDiscountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsDiscount(e.target.checked);
      if (!e.target.checked && user) {
        setRequestUpdateUserInfo({
          method: "put" as Method,
          url: `/users/${user.id}`,
          data: {
            discount_rate: 0,
          },
        });
      }
    },
    [setRequestUpdateUserInfo, user]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (user) {
        setRequestUpdateUserInfo({
          method: "put" as Method,
          url: `/users/${user.id}`,
          data: {
            [event.target.name]: event.target.checked,
          },
        });
      }
    },
    [setRequestUpdateUserInfo, user]
  );

  return (
    <Stack spacing={3}>
      <Typography variant='h5'>Settings</Typography>
      <Stack spacing={2}>
        <FormControl>
          <FormLabel id='appearance-setting-radio-buttons-group-label'>
            Appearance
          </FormLabel>
          <Paper sx={{ display: "flex", p: 2, mt: 2 }} elevation={3}>
            <RadioGroup
              aria-labelledby='appearance-setting-radio-buttons-group-label'
              value={mode}
              onChange={(e) => setMode(e.target.value as ColorMode)}
              defaultValue={ColorMode.LIGHT}
            >
              <FormControlLabel
                value={ColorMode.LIGHT}
                control={<Radio />}
                label='Light'
              />
              <FormControlLabel
                value={ColorMode.DARK}
                control={<Radio />}
                label='Dark'
              />
              <FormControlLabel
                disabled={!navigator.geolocation}
                value={ColorMode.AUTO}
                control={<Radio />}
                label={
                  <Box>
                    Auto{" "}
                    <Typography variant='caption' component='span'>
                      {navigator.geolocation
                        ? "Appearance depends on sunrise and sunset time"
                        : "Sorry, current location is not supported"}
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </Paper>
        </FormControl>
        {user && (
          <>
            <FormControl>
              <FormLabel id='recommendations-setting-radio-buttons-group-label'>
                Recommendations
              </FormLabel>
              <Paper sx={{ display: "flex", p: 2, mt: 2 }} elevation={3}>
                <FormGroup aria-labelledby='recommendations-setting-radio-buttons-group-label'>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={user.nearby_parking}
                        onChange={handleChange}
                        name='nearby_parking'
                      />
                    }
                    label='I want to be recommended nearby car spaces when I enter the website'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={user.rental_history}
                        onChange={handleChange}
                        name='rental_history'
                      />
                    }
                    label='I want to receive emails of recommended car spaces based on my rental history'
                  />
                </FormGroup>
              </Paper>
            </FormControl>
            <FormControl>
              <FormLabel id='subscriptions-setting-radio-buttons-group-label'>
                Subscriptions
              </FormLabel>
              <Paper sx={{ display: "flex", p: 2, mt: 2 }} elevation={3}>
                <FormGroup aria-labelledby='subscriptions-setting-radio-buttons-group-label'>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={user.competitive}
                        onChange={handleChange}
                        name='competitive'
                      />
                    }
                    label='I want to receive an email when there is a new competitive car space posted'
                  />
                </FormGroup>
              </Paper>
            </FormControl>
            <FormControl>
              <FormLabel id='discount-setting-radio-buttons-group-label'>
                Discount
              </FormLabel>
              <Paper sx={{ display: "flex", p: 2, mt: 2 }} elevation={3}>
                <Stack spacing={2}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isDiscount}
                          onChange={handleDiscountChange}
                        />
                      }
                      label='I want to give discount to first-time user'
                    />
                  </FormGroup>
                  {isDiscount && (
                    <Grid
                      container
                      component='form'
                      onSubmit={handleSaveDiscountRate}
                      alignItems='center'
                      gap={2}
                    >
                      <Grid item xs={8}>
                        <FormControl fullWidth>
                          <InputLabel htmlFor='min-price'>
                            Discount Rate
                          </InputLabel>
                          <Input
                            defaultValue={user.discount_rate}
                            type='number'
                            name='discount_rate'
                            id='discount-rate'
                            inputProps={{ step: 0.1, min: 0, max: 100 }}
                            endAdornment={
                              <InputAdornment position='end'>%</InputAdornment>
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={2}>
                        <Button type='submit'>Save</Button>
                      </Grid>
                    </Grid>
                  )}
                </Stack>
              </Paper>
            </FormControl>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default Settings;
