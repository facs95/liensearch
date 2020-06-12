import React, { useContext } from 'react';
import { Theme } from '@material-ui/core/styles';
import { 
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    MenuItem,
    makeStyles,
    Menu,
    Divider
 } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import * as Firebase from 'firebase';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const useStyles = makeStyles((theme: Theme) =>
  ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    link: {
      textDecoration: 'none',
      color: 'white'
    }
  }),
);

export const AppHeader = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentUser = useContext(UserContext);
  const history = useHistory();


  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await Firebase.auth().signOut();
  }

  const redirectAdmin = () => {
    history.push('/admin/manage');
  }

  return (
      <AppBar position="absolute">
        <Toolbar>
            <Typography variant="h6" className={classes.title}>
              <Link to="/" className={classes.link}>
                    Dashboard
              </Link>
            </Typography>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                >
                <AccountCircle />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
                >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                {currentUser?.admin && <MenuItem onClick={redirectAdmin}>Admin</MenuItem> }
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </Toolbar>
      </AppBar>
  );
};