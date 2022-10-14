import {
  Avatar,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import User from "models/User";

interface AdminUserCardProps {
  user: User;
  handleDelete: (user: User) => void;
  sendStatement: (user: User) => void;
}

const AdminUserCard: React.FC<AdminUserCardProps> = (props) => {
  const { user, handleDelete, sendStatement } = props;
  const theme = useTheme();
  const mdMatches = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: mdMatches ? "row" : "column",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexGrow: 1,
          gap: 1,
          flexDirection: mdMatches ? "row" : "column",
        }}
      >
        <Stack direction='row' spacing={2} alignItems='center' flexGrow={1}>
          <Avatar />

          <Stack justifyContent='space-between' spacing={1}>
            <Typography variant='subtitle2'>{user.name}</Typography>
            <Typography variant='subtitle1' color='text.secondary'>
              {user.email}
            </Typography>
          </Stack>
        </Stack>
        <Stack>
          <Button onClick={() => handleDelete(user)}>delete</Button>
          <Button onClick={() => sendStatement(user)}>send statement</Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AdminUserCard;
