import {
    Box,
    Checkbox,
    IconButton,
    makeStyles,
    TextField,
    withStyles,
} from "@material-ui/core";
import React from "react";
import { Task } from "../../Interfaces";
import {
    addAction,
    deleteAction,
    markAction,
    TaskReducerAction,
    updateAction,
} from "./TaskList";
import DeleteIcon from "@material-ui/icons/Delete";

const CustomCheckBox = withStyles({
    root: {
        color: "green !important",
    },
})(Checkbox);

interface Props {
    task: Task;
    index: number;
    dispatch: React.Dispatch<TaskReducerAction>;
}

export const TaskInput = ({ task, index, dispatch }: Props) => {
    const classes = useStyles();

    const handleChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        dispatch(updateAction(e.target.value, index));
    };

    const handleKeyReaction = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const code = e.keyCode || e.which;
        if (code === 8 && !task.description) {
            dispatch(deleteAction(index));
        } else if (code === 13) {
            dispatch(addAction(index));
        }
    };

    const handleCheck = () => {
        dispatch(markAction(index));
    };

    const handleDelete = () => {
        dispatch(deleteAction(index));
    };

    return (
        <Box
            width="100%"
            display="flex"
            flexWrap="nowrap"
            justifyContent="space-between"
            alignItems="center"
        >
            <TextField
                fullWidth
                size="small"
                value={task.description}
                onChange={(e) => handleChange(e)}
                onKeyDown={handleKeyReaction}
                InputProps={{
                    className: classes.textField,
                    startAdornment: (
                        <CustomCheckBox
                            size="small"
                            checked={task.status === "complete"}
                            onChange={handleCheck}
                        />
                    ),
                    autoComplete: "new-password",
                }}
                inputProps={{
                    className: classes.input,
                }}
            />
            <IconButton onClick={handleDelete} size="small">
                <DeleteIcon />
            </IconButton>
        </Box>
    );
};

const useStyles = makeStyles(() => ({
    textField: {
        borderBottom: "none",
        "&:before": {
            borderBottom: "none",
        },
        "&:after": {
            borderBottom: "none",
        },
        "&:hover:not(.Mui-disabled):before": {
            borderBottom: "none",
        },
        "&:focus": {
            borderBottom: "none",
        },
    },
    input: {
        padding: 0,
    },
}));
