import { useCallback, useMemo, useEffect, useState } from "react";
// next
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";
// mui
import {
  AppBar,
  Avatar,
  Button,
  CssBaseline,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Box,
  Container,
  Link,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsIcon from "@mui/icons-material/Settings";
// internal
import DropdownMenu from "components/DropdownMenu";
import { TopCities } from "utils/constants";
import useApplicationContext from "hooks/useApplicationContext";
// others
import { DarkModeSwitch } from "components/DarkModeSwitch";
import { ColorMode } from "hooks/useApplicationStates";

export interface NavProps {
  leftSideMenu: () => React.ReactNode;
}

const Nav: React.FC<NavProps> = (props) => {
  const router = useRouter();
  const { leftSideMenu } = props;
  const {
    token,
    setToken,
    user,
    recentHistory,
    darkMode,
    setMode,
    reportMessage,
  } = useApplicationContext();
  const [isSSR, setIsSSR] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setIsSSR(false);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && router.isReady) {
      setCurrentUrl(
        router.query.jump
          ? encodeURIComponent(
              window.location.origin + window.location.pathname
            )
          : encodeURIComponent(window.location.href)
      );
    }
  }, [router.isReady, router.query.jump]);

  const inSignUpOrLogin = useMemo(() => {
    if (typeof window !== "undefined") {
      return (
        window.location.pathname === "/login" ||
        window.location.pathname === "/signup"
      );
    }
  }, []);

  const topCitiesMenuList = useMemo(
    () =>
      Object.keys(TopCities)
        .filter((x) => !(parseInt(x) >= 0))
        .map((city) => (
          <NextLink href={`/?city=${city}`} key={city} passHref>
            <MenuItem disableRipple component='a'>
              <Typography color='primary'>{city}</Typography>
            </MenuItem>
          </NextLink>
        )),
    []
  );

  const logout = useCallback(() => {
    setToken("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }, [setToken]);

  // user profile dropdown menu
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const userProfileOpen = useMemo(() => Boolean(anchorElUser), [anchorElUser]);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // nar bar actions when in mobile
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const isNotLogin = !token || !user;

  const userStatus = useMemo(() => {
    if (isNotLogin) {
      return (
        <Button
          component={Link}
          href={inSignUpOrLogin ? "/login" : `/login?jump=${currentUrl}`}
        >
          Login
        </Button>
      );
    } else {
      return (
        user && (
          <>
            <IconButton
              id='account-btn'
              onClick={handleOpenUserMenu}
              sx={{ p: 0 }}
              aria-controls={userProfileOpen ? "account-menu" : undefined}
              aria-haspopup='true'
              aria-expanded={userProfileOpen ? "true" : undefined}
            >
              <Avatar
                sx={{ width: { xs: 30, md: 36 }, height: { xs: 30, md: 36 } }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorElUser}
              id='account-menu'
              MenuListProps={{
                "aria-labelledby": "account-btn",
              }}
              open={userProfileOpen}
              onClick={handleCloseUserMenu}
              onClose={handleCloseUserMenu}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              sx={{ mt: 1 }}
            >
              <NextLink href='/user-profile' passHref>
                <MenuItem component='a'>
                  <ListItemIcon>
                    <PermIdentityIcon fontSize='small' />
                  </ListItemIcon>
                  My account
                </MenuItem>
              </NextLink>
              <Divider />
              <NextLink href='/user-profile?currentTag=8' passHref>
                <MenuItem component='a'>
                  <ListItemIcon>
                    <SettingsIcon fontSize='small' />
                  </ListItemIcon>
                  Settings
                </MenuItem>
              </NextLink>
              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <LogoutIcon fontSize='small' />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        )
      );
    }
  }, [
    anchorElUser,
    currentUrl,
    inSignUpOrLogin,
    isNotLogin,
    logout,
    user,
    userProfileOpen,
  ]);

  const recentHistoryMenuList = useMemo(
    () =>
      recentHistory.length > 0
        ? recentHistory.map((cs) => (
            <NextLink href={`/car-space-detail/${cs.id}`} key={cs.id} passHref>
              <MenuItem component='a'>
                <Typography color='primary'>{cs.title}</Typography>
              </MenuItem>
            </NextLink>
          ))
        : [
            <MenuItem key='empty' disabled>
              <Typography>No recent history</Typography>
            </MenuItem>,
          ],
    [recentHistory]
  );

  return !isSSR ? (
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
            {leftSideMenu()}
            <Box sx={{ flexGrow: 1 }}>
              <NextLink href='/'>
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
            <Stack
              spacing={2}
              direction='row'
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <DropdownMenu text='Top Cities' menuList={topCitiesMenuList} />
              <Button
                component={Link}
                href={`/register-car-space?jump=${currentUrl}`}
                variant='contained'
              >
                Register Car Space
              </Button>
              <DropdownMenu
                text='Recent History'
                menuList={recentHistoryMenuList}
                endIcon={<></>}
                btnVariant='outlined'
              />
            </Stack>
            <Box sx={{ flexGrow: 0, ml: 2 }}>{userStatus}</Box>
            <Box sx={{ flexGrow: 0, ml: 2 }}>
              <DarkModeSwitch
                checked={darkMode}
                onClick={() => {
                  setMode(darkMode ? ColorMode.LIGHT : ColorMode.DARK);
                  reportMessage(
                    `You have changed appearance preference to ${
                      darkMode ? ColorMode.LIGHT : ColorMode.DARK
                    }`,
                    "info"
                  );
                }}
              />
            </Box>
            <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size='large'
                aria-label='nav bar actions'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElNav)}
                onClick={handleCloseNavMenu}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem disabled>Top Cities</MenuItem>
                {topCitiesMenuList}
                <Divider />
                <NextLink
                  href={`/register-car-space?jump=${currentUrl}`}
                  key='register'
                  passHref
                >
                  <MenuItem disableRipple component='a'>
                    <Typography color='primary'>Register Car Space</Typography>
                  </MenuItem>
                </NextLink>

                <Divider />
                <MenuItem disabled>Recent History</MenuItem>
                {recentHistoryMenuList}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  ) : (
    <></>
  );
};

export default Nav;
