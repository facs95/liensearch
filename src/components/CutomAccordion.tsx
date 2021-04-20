import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export interface AccordionContentInterface {
    subHeader: string;
    value?: JSX.Element | string | number | boolean;
}

export interface CustomAccordionProps {
    header: string;
    content: AccordionContentInterface[];
    defaultExpanded?: boolean;
}

export const CustomAccordion = ({
    header,
    content,
    defaultExpanded,
}: CustomAccordionProps) => {
    const classes = useStyles();
    return (
        <Accordion {...{ defaultExpanded }} className={classes.accordion}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{header}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container direction="column" spacing={1}>
                    {content.map((item, index) => (
                        <Grid
                            key={`accordion-${index}`}
                            item
                            container
                            wrap="nowrap"
                        >
                            <Grid item xs={6} md={4} lg={3}>
                                <Typography variant="body2">
                                    {item.subHeader}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} md={10} lg={9}>
                                <Typography>{item.value}</Typography>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
};

const useStyles = makeStyles((theme) => ({
    accordion: {
        width: "100%",
    },
}));
