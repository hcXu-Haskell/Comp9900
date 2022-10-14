import { useState, useCallback } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import useApplicationContext from "hooks/useApplicationContext";
import useAuthedApiCall from "hooks/useAuthedApiCall";
import { Method } from "axios";
import User from "models/User";

const ContactDetails: React.FC = () => {
  const { user, requestUser } = useApplicationContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const [setRequestUpdateUserInfo] = useAuthedApiCall({
    requestInfo: {} as any,
    callbackAfter: () => {
      setIsUpdating(false);
      requestUser();
    },
  });

  const handleSave = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (user) {
        const data = new FormData(e.currentTarget);
        const name = data.get("name");
        setRequestUpdateUserInfo({
          method: "put" as Method,
          url: `/users/${user.id}`,
          data: {
            name,
          },
        });
      }
    },
    [setRequestUpdateUserInfo, user]
  );

  return (
    <Stack spacing={3}>
      <Typography variant='h5'>Contact Details</Typography>
      {user && (
        <Stack spacing={2} component='form' onSubmit={handleSave}>
          <Typography variant='subtitle2'>Name</Typography>
          {isUpdating ? (
            <TextField name='name' defaultValue={user.name} />
          ) : (
            <Typography>{user.name}</Typography>
          )}
          <Typography variant='subtitle2'>Email</Typography>
          <Typography>{user.email}</Typography>
          <Stack direction='row' spacing={2}>
            {isUpdating ? (
              <>
                <Button onClick={() => setIsUpdating(false)}>Cancel</Button>
                <Button type='submit'>Save</Button>
              </>
            ) : (
              <Button onClick={() => setIsUpdating(true)}>Update</Button>
            )}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default ContactDetails;
