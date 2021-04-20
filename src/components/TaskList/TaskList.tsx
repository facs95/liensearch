import { Box, Button, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useReducer } from "react";
import { Order, Task, taskStatusTypes } from "../../Interfaces";
import AddIcon from "@material-ui/icons/Add";
import { TaskInput } from "./TaskInput";

interface Props {
    order: Order;
}

const blankTask: Task = {
    status: "incomplete",
    description: "",
};

enum ActionKind {
    Add = "Add",
    Update = "Update",
    Mark = "Mark",
    Delete = "Delete",
}

const toggleStatus = (task: Task) => {
    if (task.status === "complete") {
        return "incomplete";
    } else {
        return "complete";
    }
};

export interface TaskReducerAction {
    type: keyof typeof ActionKind;
    payload: {
        description?: string;
        status?: taskStatusTypes;
        index: number;
    };
}

export function taskReducer(state: Task[], action: TaskReducerAction): Task[] {
    switch (action.type) {
        case ActionKind.Add:
            const newArr = [...state];
            newArr.splice(action.payload.index + 1, 0, blankTask);
            return newArr;
        case ActionKind.Update:
            if (action.payload.description !== undefined) {
                return state.map((task, i) => {
                    if (i === action.payload.index) {
                        return {
                            ...task,
                            description: action.payload.description!,
                        };
                    }
                    return task;
                });
            }
            return state;
        case ActionKind.Mark:
            return state.map((task, i) => {
                if (i === action.payload.index)
                    return {
                        ...task,
                        status: toggleStatus(task),
                    };
                return task;
            });
        case ActionKind.Delete:
            return state.filter((_task, i) => action.payload.index !== i);
        default:
            return state;
    }
}

export function addAction(index: number) {
    return {
        type: ActionKind.Add,
        payload: {
            index,
        },
    } as TaskReducerAction;
}

export function updateAction(taskText: string, index: number) {
    return {
        type: ActionKind.Update,
        payload: {
            description: taskText,
            index,
        },
    } as TaskReducerAction;
}

export function markAction(index: number) {
    return {
        type: ActionKind.Mark,
        payload: {
            index,
        },
    } as TaskReducerAction;
}

export function deleteAction(index: number) {
    return {
        type: ActionKind.Delete,
        payload: {
            index,
        },
    } as TaskReducerAction;
}

export const TaskList = ({ order }: Props) => {
    const [tasks, dispatch] = useReducer(
        taskReducer,
        order.taskList ? order.taskList : []
    );

    const classes = useStyles();

    const handleAddTask = () => {
        console.log(tasks.length);
        dispatch(addAction(tasks.length)); //Adds it to the end
    };

    return (
        <Paper className={classes.paper}>
            <Box display="flex" flexDirection="column" p={3} height="100%">
                <Box mt={1}>
                    <Typography variant="h5">Task List</Typography>
                </Box>
                {tasks.length === 0 ? (
                    <Box
                        flexGrow={1}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Button
                            size="small"
                            variant="text"
                            type="submit"
                            onClick={handleAddTask}
                            startIcon={<AddIcon />}
                        >
                            Add new Task
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Box mt={1} flexGrow={1} className={classes.tasksInput}>
                            {tasks.map((item, index) => (
                                <TaskInput
                                    key={`task-${index}`}
                                    task={item}
                                    {...{ index }}
                                    {...{ dispatch }}
                                />
                            ))}
                        </Box>
                        <Box justifySelf="flex-end">
                            <Button
                                size="small"
                                variant="text"
                                type="submit"
                                onClick={handleAddTask}
                                startIcon={<AddIcon />}
                            >
                                Add new Task
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Paper>
    );
};

const useStyles = makeStyles((theme) => ({
    paper: {
        height: "325px",
    },
    tasksInput: {
        overflowY: "scroll",
    },
}));
