import {
    Divider,
    Drawer,
    Hidden,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
} from "@material-ui/core";
import React, { useContext } from "react";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import { DRAWER_WIDTH } from "../AppWrapper";
import { UserContext } from "../../context/UserContext";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { useHistory } from "react-router-dom";

export const LeftNav = () => {
    const classes = useStyles();

    const user = useContext(UserContext);
    const history = useHistory();

    const options = [
        {
            label: "My Orders",
            icon: <LibraryBooksIcon />,
            action: () => history.push("/"),
            divider: !!user?.admin,
        },
    ];

    if (user?.admin) {
        options.push({
            label: "Manage Employees",
            icon: <SupervisorAccountIcon />,
            action: () => history.push("/admin/manage"),
            divider: false,
        });
    }

    return (
        <nav className={classes.drawer}>
            <Hidden xsDown implementation="js">
                <Drawer
                    anchor="left"
                    variant="permanent"
                    open
                    classes={{ paper: classes.drawerPaper }}
                >
                    <div className={classes.logoContainer}>
                        <img
                            alt=""
                            className={classes.logo}
                            src={`${process.env.PUBLIC_URL}/logo-transparent.png`}
                        />
                    </div>
                    <List>
                        {options.map((option, index) => (
                            <>
                                <ListItem
                                    key={`left-nav-${index}`}
                                    button
                                    onClick={option.action}
                                >
                                    <ListItemIcon>{option.icon}</ListItemIcon>
                                    <ListItemText primary={option.label} />
                                </ListItem>
                                {option.divider && <Divider />}
                            </>
                        ))}
                    </List>
                </Drawer>
            </Hidden>
        </nav>
    );
};

const useStyles = makeStyles((theme) => ({
    drawerPaper: {
        width: DRAWER_WIDTH,
        backgroundColor: theme.palette.primary.main,
    },
    drawer: {
        [theme.breakpoints.up("sm")]: {
            width: DRAWER_WIDTH,
            flexShrink: 0,
        },
    },
    logo: {
        height: 90,
        width: 200,
    },
    logoContainer: {
        padding: theme.spacing(2),
    },
}));
