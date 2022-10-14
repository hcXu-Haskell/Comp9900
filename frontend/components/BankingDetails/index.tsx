import { useState, useCallback } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import useApplicationContext from "hooks/useApplicationContext";
import useAuthedApiCall from "hooks/useAuthedApiCall";
import { Method } from "axios";

const BankingDetails: React.FC = () => {
  const { user, requestUser } = useApplicationContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [accountBSB, setAccountBSB] = useState(user?.bank_account_bsb);
  const [accountName, setAccountName] = useState(user?.bank_account_name);
  const [accountNum, setAccountNum] = useState(user?.bank_account_number);

  const handleClose = useCallback(() => {
    setAccountBSB(user?.bank_account_bsb);
    setAccountName(user?.bank_account_name);
    setAccountNum(user?.bank_account_number);
    setIsUpdating(false);
  }, [
    user?.bank_account_bsb,
    user?.bank_account_name,
    user?.bank_account_number,
  ]);

  const [setRequestUpdateUserInfo] = useAuthedApiCall({
    requestInfo: {} as any,
    callbackAfter: () => {
      setIsUpdating(false);
      requestUser();
    },
  });

  const handleSave = useCallback(() => {
    if (user) {
      setRequestUpdateUserInfo({
        method: "put" as Method,
        url: `/users/${user.id}`,
        data: {
          bank_account_bsb: accountBSB,
          bank_account_name: accountName,
          bank_account_number: accountNum,
        },
      });
    }
  }, [user, setRequestUpdateUserInfo, accountBSB, accountName, accountNum]);

  return (
    <Stack spacing={3}>
      <Typography variant='h5'>Banking Details</Typography>

      {user && (
        <Stack spacing={2}>
          <Typography variant='subtitle2'>Account BSB</Typography>
          {isUpdating ? (
            <TextField
              value={accountBSB}
              onChange={(e) => setAccountBSB(e.target.value)}
            />
          ) : (
            <Typography>{user.bank_account_bsb}</Typography>
          )}
          <Typography variant='subtitle2'>Account Name</Typography>
          {isUpdating ? (
            <TextField
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          ) : (
            <Typography>{user.bank_account_name}</Typography>
          )}
          <Typography variant='subtitle2'>Account Number</Typography>
          {isUpdating ? (
            <TextField
              value={accountNum}
              onChange={(e) => setAccountNum(e.target.value)}
            />
          ) : (
            <Typography>{user.bank_account_number}</Typography>
          )}
          <Stack direction='row' spacing={2}>
            {isUpdating ? (
              <>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
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

export default BankingDetails;
