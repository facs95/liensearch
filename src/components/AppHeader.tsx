import React, { useContext } from "react";
import { Theme } from "@material-ui/core/styles";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    MenuItem,
    makeStyles,
    Menu,
    Divider,
    ListItemAvatar,
    Avatar,
    ListItemText,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import * as Firebase from "firebase";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const useStyles = makeStyles((theme: Theme) => ({
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
        textDecoration: "none",
        color: "black",
        flexGrow:1
    },
    logo: {
        height: 60,
        width:140
    },
    divider: {
        backgroundColor: 'grey'
    }
}));

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
    };

    const redirectAdmin = () => {
        history.push("/admin/manage");
    };

    return (
        <AppBar position="absolute">
            <Toolbar>
                <Link to="/" className={classes.link}>
                    <img
                        alt=""
                        className={classes.logo}
                        src={`${process.env.PUBLIC_URL}/logo-transparent.png`}
                    />
                </Link>
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
                        vertical: "top",
                        horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem>
                        <ListItemAvatar>
                            <Avatar>{currentUser?.email.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText>{currentUser?.email}</ListItemText>
                    </MenuItem>
                    {currentUser?.admin && (
                        <MenuItem onClick={redirectAdmin}>Admin</MenuItem>
                    )}
                    <Divider className={classes.divider} />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};