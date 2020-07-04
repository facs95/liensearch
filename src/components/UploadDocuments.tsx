import React, { useState, useContext, useEffect, useCallback } from "react";
import {
    Grid,
    makeStyles,
    Button,
    Paper,
    Typography,
    Divider,
    IconButton,
    CircularProgress,
} from "@material-ui/core";
import { UserContext } from "../context/UserContext";
import CloseIcon from "@material-ui/icons/Close";
import DescriptionIcon from "@material-ui/icons/Description";
import { map } from "lodash";
import * as firebase from "firebase/app";
import { MessageSnackbar } from "./SnackMessage";

interface Props {
    orderId: string;
    orgId: string;
}

export const UploadDocuments = ({ orderId, orgId }: Props) => {
    const [listOfFiles, setListOfFiles] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">(
        "error"
    );
    const [uploadLoading, setUploadLoading] = useState(false);

    const docsPath = `org-${orgId}/order-${orderId}/`;

    const user = useContext(UserContext);

    const db = firebase.storage();

    const catchError = (err: any) => {
        setMessageType("error");
        setMessage(err && err.message);
    };

    const createSuccess = (message: string) => {
        setMessageType("success");
        setMessage(message);
    };

    const deleteFile = (fileName: string) => {
        const storageRef = db.ref();
        const deleteReference = storageRef.child(docsPath);
        deleteReference
            .child(fileName)
            .delete()
            .then(() => {
                createSuccess(`Succesfully Delete ${fileName}`);
                listFiles();
            })
            .catch((err) => {
                catchError(err);
            });
    };

    const listFiles = useCallback(() => {
        if (user) {
            const storageRef = db.ref();
            let listRef = storageRef.child(docsPath);
            listRef
                .listAll()
                .then((res) => {
                    setListOfFiles(res.items.map((item) => item.name));
                })
                .catch((err) => catchError(err));
        }
    }, [db, user, docsPath]);

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const storageRef = db.ref();
            const uploadReference = storageRef.child(docsPath);
            const prom = map(files, (file) => {
                const fileRef = uploadReference.child(file.name);
                return fileRef.put(file);
            });
            setUploadLoading(true);
            Promise.all(prom)
                .then(() => {
                    createSuccess("Succesful Upload");
                    listFiles();
                })
                .catch((err) => catchError(err))
                .finally(() => setUploadLoading(false));
        }
    };

    useEffect(() => {
        listFiles();
    }, [listFiles]);

    const classes = useStyles();

    return (
        <>
            <MessageSnackbar
                {...{ message }}
                {...{ setMessage }}
                {...{ messageType }}
            />
            <Paper className={classes.fullWidth}>
                <Grid
                    container
                    direction="column"
                    spacing={3}
                    className={classes.cardContainer}
                >
                    <Grid item>
                        <Typography variant="h5">Documents</Typography>
                        <Divider />
                    </Grid>
                    <Grid item container direction="column" spacing={2}>
                        {listOfFiles.map((file, index) => (
                            <Grid
                                key={`file-${index}`}
                                item
                                container
                                justify="space-between"
                                wrap="nowrap"
                            >
                                <Grid
                                    item
                                    container
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <Grid item>
                                        <DescriptionIcon />
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">
                                            {file}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                {user && user.admin && (
                                    <Grid item>
                                        <IconButton
                                            onClick={() => deleteFile(file)}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Grid>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                    {user && user.admin && (
                        <Grid item container spacing={1}>
                            <Grid item>
                                <input
                                    className={classes.input}
                                    style={{ display: "none" }}
                                    id="raised-button-file"
                                    multiple
                                    type="file"
                                    onChange={onUpload}
                                />
                                <label htmlFor="raised-button-file">
                                    <Button
                                        color="primary"
                                        size="large"
                                        variant="contained"
                                        component="span"
                                        disabled={uploadLoading}
                                    >
                                        Upload New File
                                    </Button>
                                </label>
                            </Grid>
                            {uploadLoading && (
                                <Grid item>
                                    <CircularProgress />
                                </Grid>
                            )}
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </>
    );
};

const useStyles = makeStyles((theme) => ({
    input: {
        display: "none",
    },
    cardContainer: {
        padding: theme.spacing(3),
    },
    fullWidth: {
        width: "100%",
    },
}));
