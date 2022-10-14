import { Dispatch, SetStateAction, useCallback, useState } from "react";
import Link from "next/link";
// mui
import {
  Stack,
  Grid,
  Typography,
  ButtonGroup,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
// internal
import CarSpaceListItemDashboard from "components/CarSpaceListItemDashboard";
import CarSpace from "models/CarSpace";
import { BookmarkType, EmptyMessage } from "pages/user-profile";
import { createTimeSorter } from "utils/utils";
import { IRequestInfo } from "hooks/useAuthedApiCall";

interface BookmarksProps {
  likedCarSpaces: CarSpace[];
  dislikedCarSpaces: CarSpace[];
  setRequestLikeDislikeCarSpace: Dispatch<SetStateAction<IRequestInfo>>;
}

const Bookmarks: React.FC<BookmarksProps> = (props) => {
  const { likedCarSpaces, dislikedCarSpaces, setRequestLikeDislikeCarSpace } =
    props;
  const [filter, setFilter] = useState(BookmarkType.ALL);

  const theme = useTheme();
  const xsMatches = useMediaQuery(theme.breakpoints.down("sm"));
  const handleButtonClick = useCallback(
    (type: BookmarkType) => (e: React.MouseEvent<HTMLButtonElement>) => {
      setFilter(type);
    },
    [setFilter]
  );

  const getButtonVariant = useCallback(
    (type: BookmarkType) => (filter === type ? "contained" : undefined),
    [filter]
  );
  return (
    <Stack spacing={3}>
      <Grid
        container
        flexDirection={xsMatches ? "column" : "row"}
        justifyContent='space-between'
        gap={2}
      >
        <Grid item>
          <Typography variant='h5'>Bookmarks</Typography>
        </Grid>
        <Grid item>
          <ButtonGroup>
            <Button
              onClick={handleButtonClick(BookmarkType.ALL)}
              variant={getButtonVariant(BookmarkType.ALL)}
            >
              All
            </Button>
            <Button
              onClick={handleButtonClick(BookmarkType.LIKED)}
              variant={getButtonVariant(BookmarkType.LIKED)}
            >
              Liked
            </Button>
            <Button
              onClick={handleButtonClick(BookmarkType.DISLIKED)}
              variant={getButtonVariant(BookmarkType.DISLIKED)}
            >
              Disliked
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      {filter !== BookmarkType.DISLIKED && (
        <>
          <Stack spacing={2}>
            <Typography variant='subtitle2'>Liked</Typography>
            {likedCarSpaces.length > 0 ? (
              likedCarSpaces
                .sort(createTimeSorter)
                .map((cs) => (
                  <CarSpaceListItemDashboard
                    key={cs.id}
                    carSpace={cs}
                    bookmarkType={BookmarkType.LIKED}
                    setRequestLikeDislikeCarSpace={
                      setRequestLikeDislikeCarSpace
                    }
                  />
                ))
            ) : (
              <Link href='/'>
                <Button>Look for a car space you like</Button>
              </Link>
            )}
          </Stack>
          {filter === BookmarkType.ALL && <Divider />}
        </>
      )}
      {filter !== BookmarkType.LIKED && (
        <>
          <Stack spacing={2}>
            <Typography variant='subtitle2'>Disliked</Typography>
            {dislikedCarSpaces.length > 0 ? (
              dislikedCarSpaces
                .sort(createTimeSorter)
                .map((cs) => (
                  <CarSpaceListItemDashboard
                    key={cs.id}
                    carSpace={cs}
                    bookmarkType={BookmarkType.DISLIKED}
                    setRequestLikeDislikeCarSpace={
                      setRequestLikeDislikeCarSpace
                    }
                  />
                ))
            ) : (
              <EmptyMessage>You have no disliked car space</EmptyMessage>
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default Bookmarks;
