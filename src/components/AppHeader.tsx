import React, {
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
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
    AppBar,
    AppBarProps,
    Box,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import * as Firebase from "firebase";
import { UserContext } from "../context/UserContext";
import { TitleContext } from "../context/TitleContext";
import { useHistory } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import firebase from "firebase/app";
import { OrganizationHeader } from "./OrganizationHeader";
interface Props {
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppHeader = ({ setDrawerOpen, ...args }: AppBarProps & Props) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const { title } = useContext(TitleContext);
    const [orgName, setOrgName] = useState("");

    const currentUser = useContext(UserContext);
    const history = useHistory();

    const getOrgName = useCallback(async () => {
        try {
            const db = firebase.firestore();
            if (currentUser && !currentUser?.admin) {
                const orgDoc = await db
                    .collection("organizations")
                    .doc(currentUser.orgId)
                    .get();
                if (orgDoc.exists) {
                    const data = orgDoc.data();
                    if (data) {
                        setOrgName(data.name);
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }, [currentUser]);

    useEffect(() => {
        getOrgName();
    }, [getOrgName]);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await Firebase.auth().signOut();
    };

    return (
        <AppBar position="relative" color="transparent" elevation={0} {...args}>
            <Toolbar disableGutters>
                <div className={classes.container}>
                    <div className={classes.titleContainer}>
                        <Box mr={2} className={classes.drawerToggle}>
                            <IconButton
                                size="small"
                                onClick={() => setDrawerOpen(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                        <Typography variant="h4">{title}</Typography>
                    </div>
                    <Box display="flex" alignItems="center" flexWrap="nowrap">
                        {orgName && (
                            <Box mr={2}>
                                <OrganizationHeader {...{ orgName }} />
                            </Box>
                        )}
                        <IconButton
                            onClick={handleMenu}
                            color="inherit"
                            size="small"
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
                            <MenuItem onClick={() => history.push("/profile")}>
                                <ListItemAvatar>
                                    <Avatar>
                                        {currentUser?.email.charAt(0)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText>
                                    {currentUser?.email}
                                </ListItemText>
                            </MenuItem>
                            <Divider className={classes.divider} />
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </div>
            </Toolbar>
        </AppBar>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    link: {
        textDecoration: "none",
        color: "black",
        flexGrow: 1,
    },
    divider: {
        backgroundColor: "#8a818126",
    },
    container: {
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
    },
    drawerToggle: {
        [theme.breakpoints.up("md")]: {
            display: "none",
        },
    },
    titleContainer: {
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "center",
    },
}));
