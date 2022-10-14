import { useCallback, Dispatch, SetStateAction, useMemo } from "react";
// next
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";
// mui
import {
  AppBar,
  Button,
  CssBaseline,
  Toolbar,
  Box,
  Container,
  Link,
} from "@mui/material";
import useApplicationContext from "hooks/useApplicationContext";

interface AdminNavProps {
  adminToken: string;
  setAdminToken: Dispatch<SetStateAction<string>>;
}

const AdminNav: React.FC<AdminNavProps> = (props) => {
  const { darkMode } = useApplicationContext();
  const { adminToken, setAdminToken } = props;
  const router = useRouter();
  const logout = useCallback(() => {
    setAdminToken("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminToken");
    }
    router.push("/admin/login");
  }, [router, setAdminToken]);

  const userStatus = useMemo(() => {
    if (!adminToken) {
      return (
        <Button component={Link} href='/admin/login'>
          Login
        </Button>
      );
    } else {
      return <Button onClick={logout}>Logout</Button>;
    }
  }, [adminToken, logout]);

  return (
    <>
      <CssBaseline />
      <AppBar color='inherit'>
        <Container
          component='main'
          maxWidth='xl'
          sx={{
            p: {
              xs: 0,
            },
          }}
        >
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <NextLink href='/admin'>
                <a>
                  <Image
                    src={darkMode ? "/dark.png" : "/light.png"}
                    width={384}
                    height={45}
                    alt='logo'
                  />
                </a>
              </NextLink>
            </Box>
            <Box sx={{ flexGrow: 0, ml: 2 }}>{userStatus}</Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default AdminNav;
