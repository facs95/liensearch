import React from 'react';
import { FieldElement } from 'react-hook-form';
import { Grid, Typography, Divider, FormControl, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { CreateForm, InputList } from './CreateForm';

interface Props {
    register: {
        <Element extends FieldElement<any> = FieldElement<any>>(): (ref: Element | null) => void;
    }
}

export const LandSurveyForm = ({register}: Props) => {

    const inputList: InputList  = [{
        label: 'Lender Certification',
        name: 'lenderCertification',
        xs: 12,
        md: 6
    }, {
        label: 'Buyer Certification',
        name: 'buyerCertification',
        xs: 12,
        md: 6
    }, {
        label: 'Underwriter Certification',
        name: 'underwriterCertification',
        xs: 12,
        md: 6
    }, {
        label: 'Title Company',
        name: 'titleCompany',
        xs: 12,
        md: 6
    }]

    return (
        <>
            <Grid item>
                <Typography variant="h6">Land Survey</Typography>
                <Divider />
            </Grid>
            <Grid item container spacing={2}>
                <CreateForm {...{register}} {...{inputList}} />
                <Grid item xs={12}>
                    <FormControl>
                        <FormGroup>
                            <FormControlLabel label="Include Hard Copy" control={<Checkbox inputRef={register} name="landSurvey.hardCopy" />} />
                        </FormGroup>
                    </FormControl>
                </Grid>
            </Grid>
        </>
    )
}