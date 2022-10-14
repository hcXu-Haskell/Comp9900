import User from "./User";

interface Comment {
  id: number;
  rating: number;
  content?: string;

  created_at: string;
  updated_at: string;

  user_id: number;
  carspace_id: number;
  customer: Pick<User, "name">;
}

export default Comment;
