import React from 'react';
import {Stepper, Step, StepLabel} from '@material-ui/core';

interface Props {
    activeStep: number,
    steps: Array<{
        label: string
    }>
}

export const CreateStepper = ({activeStep, steps}: Props) => {

    return (
        <Stepper activeStep={activeStep}>
            {steps.map(step => (
                <Step key={step.label}>
                    <StepLabel>{step.label}</StepLabel>
                </Step>
            ))}
        </Stepper>
    )
}