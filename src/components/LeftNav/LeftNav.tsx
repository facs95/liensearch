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
import BusinessIcon from "@material-ui/icons/Business";
import SearchIcon from "@material-ui/icons/Search";
import EmailIcon from "@material-ui/icons/Email";
import LandscapeIcon from "@material-ui/icons/Landscape";
import GavelIcon from "@material-ui/icons/Gavel";
import { useHistory, useLocation } from "react-router-dom";
import {
    ESTOPPEL_LETTER_PATH,
    LIEN_SEARCH_PATH,
    LAND_SURVEY_PATH,
    PERMIT_RESOLUTION_PATH,
} from "../../utils/constants";

interface Props {
    drawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LeftNav = ({ drawerOpen, setDrawerOpen }: Props) => {
    const classes = useStyles();

    const user = useContext(UserContext);
    const history = useHistory();
    const { pathname } = useLocation();

    const options = [
        {
            label: "All Orders",
            icon: <LibraryBooksIcon />,
            action: () => history.push("/"),
            selected: ["/", "/order/:id"].includes(pathname),
        },
        {
            label: "Lien Searches",
            icon: <SearchIcon />,
            action: () => history.push("/" + LIEN_SEARCH_PATH),
            selected: ["/" + LIEN_SEARCH_PATH].includes(pathname),
        },
        {
            label: "Estoppel Letter",
            icon: <EmailIcon />,
            action: () => history.push("/" + ESTOPPEL_LETTER_PATH),
            selected: ["/" + ESTOPPEL_LETTER_PATH].includes(pathname),
        },
        {
            label: "Land Survey",
            icon: <LandscapeIcon />,
            action: () => history.push("/" + LAND_SURVEY_PATH),
            selected: ["/" + LAND_SURVEY_PATH].includes(pathname),
        },
        {
            label: "Permit Resolutions",
            icon: <GavelIcon />,
            action: () => history.push("/" + PERMIT_RESOLUTION_PATH),
            divider: !!user?.admin,
            selected: ["/" + PERMIT_RESOLUTION_PATH].includes(pathname),
        },
    ];

    if (user?.admin) {
        options.push(
            {
                label: "Manage Employees",
                icon: <SupervisorAccountIcon />,
                action: () => history.push("/admin/employees"),
                divider: false,
                selected: pathname === "/admin/employees",
            },
            {
                label: "Manage Clients",
                icon: <BusinessIcon />,
                action: () => history.push("/admin/clients"),
                divider: false,
                selected: pathname === "/admin/clients",
            }
        );
    }

    const drawer = (
        <>
            <div className={classes.logoContainer}>
                <img
                    alt=""
                    className={classes.logo}
                    src={`${process.env.PUBLIC_URL}/logo-transparent.png`}
                />
            </div>
            <List>
                {options.map((option, index) => (
                    <React.Fragment key={`left-nav-${index}`}>
                        <ListItem
                            button
                            onClick={option.action}
                            selected={option.selected}
                        >
                            <ListItemIcon>{option.icon}</ListItemIcon>
                            <ListItemText primary={option.label} />
                        </ListItem>
                        {option.divider && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        </>
    );

    return (
        <nav className={classes.drawer}>
            <Hidden smDown implementation="js">
                <Drawer
                    anchor="left"
                    variant="permanent"
                    open
                    classes={{ paper: classes.drawerPaper }}
                >
                    {drawer}
                </Drawer>
            </Hidden>
            <Hidden mdUp implementation="js">
                <Drawer
                    variant="temporary"
                    anchor="left"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    {drawer}
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
        [theme.breakpoints.up("md")]: {
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
