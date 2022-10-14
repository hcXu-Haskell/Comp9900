import { Dispatch, SetStateAction, useCallback } from "react";
// mui
import { ButtonGroup, IconButton } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
//internal
import { BookmarkType } from "pages/user-profile";
import useApplicationContext from "hooks/useApplicationContext";
import { IRequestInfo } from "hooks/useAuthedApiCall";
import CarSpace from "models/CarSpace";
import { Method } from "axios";

interface LikeDislikeButtonGroupProps {
  // current car space is liked or not
  currentBookmarkType: BookmarkType;
  setRequestLikeDislikeCarSpace: Dispatch<SetStateAction<IRequestInfo>>;
  carSpaceId: CarSpace["id"];
}

const LikeDislikeButtonGroup: React.FC<LikeDislikeButtonGroupProps> = (
  props
) => {
  const { currentBookmarkType, setRequestLikeDislikeCarSpace, carSpaceId } =
    props;
  const { reportMessage } = useApplicationContext();
  const getIconButtonColor = (type: BookmarkType) =>
    currentBookmarkType === type ? "primary" : "disabled";

  const likeDislike = useCallback(
    (action: "like" | "cancel-like" | "dislike" | "cancel-dislike") => {
      if (setRequestLikeDislikeCarSpace) {
        setRequestLikeDislikeCarSpace({
          method: "put" as Method,
          url: `/car-spaces/${carSpaceId}/${action}`,
        });
      }
    },
    [carSpaceId, setRequestLikeDislikeCarSpace]
  );
  const handleIconButtonClick = useCallback(
    (type: BookmarkType) => () => {
      switch (type) {
        case BookmarkType.LIKED:
          // click like when liked, cancel like
          // click like when dislike or none, like
          likeDislike(
            currentBookmarkType === BookmarkType.LIKED ? "cancel-like" : "like"
          );

          break;
        case BookmarkType.DISLIKED:
          // click dislike when disliked, cancel dislike
          // click dislike when liked or none, dislike
          likeDislike(
            currentBookmarkType === BookmarkType.DISLIKED
              ? "cancel-dislike"
              : "dislike"
          );
          break;
        default:
          reportMessage("Wrong bookmark type", "error");
      }
    },
    [currentBookmarkType, likeDislike, reportMessage]
  );
  return (
    <ButtonGroup>
      <IconButton onClick={handleIconButtonClick(BookmarkType.LIKED)}>
        <ThumbUpIcon color={getIconButtonColor(BookmarkType.LIKED)} />
      </IconButton>
      <IconButton onClick={handleIconButtonClick(BookmarkType.DISLIKED)}>
        <ThumbDownIcon color={getIconButtonColor(BookmarkType.DISLIKED)} />
      </IconButton>
    </ButtonGroup>
  );
};

export default LikeDislikeButtonGroup;
