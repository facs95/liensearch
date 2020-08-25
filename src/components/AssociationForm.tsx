import React from 'react';
import { Grid, Typography, Divider, TextField, Button, IconButton } from '@material-ui/core';
import { Associations, blankAssociation } from '../views/NewOrder/NewOrder';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/CloseOutlined';

interface Props {
    setAssociations: React.Dispatch<React.SetStateAction<Associations>>,
    associations: Associations
}

interface AssociationData {
    name: string
    number: string
}

export const AssociationForm = ({setAssociations, associations}: Props) => {
    
    const addAssociation = () => {
        setAssociations(c => [...c, {...blankAssociation}])
    }

    const removeAssociation = (index: number) => {
        setAssociations(c => {
            let arr = [...c];
            arr.splice(index, 1);
            return arr;
        })
    }

    const handleDataChange = (name: keyof AssociationData, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const updatedData = [...associations];
        updatedData[index][name] = e.target.value;
        setAssociations(updatedData);
    };

    return (
        <>
            <Grid item>
                <Typography variant="h6">Associations (Estoppel Letter)</Typography>
                <Divider />
            </Grid>
            {associations.map((entry, index) => (
                <Grid item container key={`association-form-${index}`} alignItems="center" spacing={2}>
                    <Grid item container alignItems="center" spacing={1} xs={6} md={6}>
                        {index !== 0 && (
                            <Grid item xs={1}>
                                <IconButton onClick={() => removeAssociation(index)} size="small">
                                    <CloseIcon />
                                </IconButton>
                            </Grid>
                        )}
                        <Grid item xs={index !== 0 ? 11 : 12}>
                            <TextField fullWidth 
                                autoComplete='nope'
                                required={true} 
                                label='Association Name'
                                value={entry.name}
                                variant="outlined"
                                onChange={e => handleDataChange('name', e, index) } />
                        </Grid>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <TextField fullWidth 
                            autoComplete='nope'
                            required={true}
                            label='Association Number'
                            value={entry.number}
                            variant="outlined"
                            onChange={e => handleDataChange('number', e, index) } />
                    </Grid>
                </Grid>
            ))}
            <Grid item xs={3}>
                <Button variant='text' onClick={addAssociation} color='primary' startIcon={<AddIcon />}>
                    Add Association
                </Button> 
            </Grid>
        </>
    )
}