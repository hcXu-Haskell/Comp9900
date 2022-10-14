import {
  Card,
  CardContent,
  Typography,
  Rating,
  Box,
  Avatar,
  Stack,
} from "@mui/material";
import Comment from "models/Comment";

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = (props) => {
  const { comment } = props;
  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Stack direction='row' spacing={2} alignItems='center'>
            <Avatar sx={{ width: 32, height: 32 }} />
            <Typography variant='subtitle1'>
              {comment.customer?.name}
            </Typography>
          </Stack>
          <Rating name='read-only' value={comment.rating} readOnly />
          <Typography variant='subtitle2'>
            {new Intl.DateTimeFormat("en-AU", {
              dateStyle: "short",
              timeStyle: "medium",
            }).format(new Date(comment.created_at))}
          </Typography>
          <Typography>{comment.content}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
