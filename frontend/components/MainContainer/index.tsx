import { Container } from "@mui/material";
import Copyright from "components/Copyright";
import Loader from "components/Loader";
import Nav from "components/Nav";

interface MainContainerProps {
  children?: React.ReactNode;
  loading?: boolean;
  leftSideMenu?: () => React.ReactNode;
  MyNav?: React.FC;
  isHomePage?: boolean;
}

const MainContainer: React.FC<MainContainerProps> = (props) => {
  const {
    loading = false,
    leftSideMenu = () => <></>,
    MyNav = Nav,
    isHomePage = false,
  } = props;
  return loading ? (
    <Loader />
  ) : (
    <>
      <MyNav leftSideMenu={leftSideMenu} />
      <Container
        component='main'
        maxWidth='xl'
        sx={{
          mt: 10,
          mb: 1,
          minHeight: `calc(100vh - ${80 + 20 + 8}px)`,
          height: isHomePage ? `calc(100vh - ${80 + 20 + 8}px)` : undefined,
        }}
      >
        {props.children}
      </Container>
      <Copyright />
    </>
  );
};

export default MainContainer;
