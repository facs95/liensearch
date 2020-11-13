import React, { useContext } from "react";
import { Theme } from "@material-ui/core/styles";
import {
    Toolbar,
    IconButton,
    MenuItem,
    makeStyles,
    Menu,
    Divider,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import * as Firebase from "firebase";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { DRAWER_WIDTH } from "./AppWrapper";
import { TitleContext } from "../context/TitleContext";

const useStyles = makeStyles((theme: Theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    link: {
        textDecoration: "none",
        color: "black",
        flexGrow: 1,
    },
    logo: {
        height: 60,
        width: 140,
    },
    divider: {
        backgroundColor: "#8a818126",
    },
    appBar: {
        [theme.breakpoints.up("sm")]: {
            marginLeft: DRAWER_WIDTH,
            width: `calc(100% - ${DRAWER_WIDTH}px)`,
        },
        top: 0,
        left: "auto",
        right: 0,
        position: "absolute",
        zIndex: 1100,
        boxSizing: "border-box",
    },
    toolBar: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: 100,
        paddingRight: 100,
        alignItems: 'center',
        paddingTop: 20
    }
}));

export const AppHeader = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const { title } = useContext(TitleContext);

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
        <div className={classes.appBar}>
            <Toolbar className={classes.toolBar}>
                <Typography variant="h4">{title}</Typography>
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
        </div>
    );
};
