import React from 'react';
import { FieldElement } from 'react-hook-form';
import { Grid, Typography, Divider, FormControl, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';

interface Props {
    register: {
        <Element extends FieldElement<any> = FieldElement<any>>(): (ref: Element | null) => void;
    }
}

export const LandSurveyForm = ({register}: Props) => {

    return (
        <>
            <Grid item>
                <Typography variant="h6">Land Survey</Typography>
                <Divider />
            </Grid>
            <Grid item>
                <FormControl>
                    <FormGroup>
                        <FormControlLabel label="Boundary Survey" control={<Checkbox inputRef={register} name="landSurvey.survey" />} />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel label="Boundary Survey with Cert" control={<Checkbox inputRef={register} name="landSurvey.surveyCert" />} />
                    </FormGroup>
                </FormControl>
            </Grid>
        </>
    )
}