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
import GetAppIcon from "@material-ui/icons/GetApp";
import { map } from "lodash";
import firebase from "firebase/app";
import { MessageSnackbar } from "./SnackMessage";
import { EmptyState } from "./EmpyState";

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

    const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const onDownload = (fileName: string) => {
        const fileRef = db.ref(`${docsPath}${fileName}`);
        fileRef
            .getDownloadURL()
            .then((url) => {
                var xhr = new XMLHttpRequest();
                xhr.responseType = "blob";
                xhr.onload = function () {
                    var blob = xhr.response;
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", fileName);
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode?.removeChild(link);
                };
                xhr.open("GET", url);
                xhr.send();
            })
            .catch((err) => console.log(err));
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
                    <Grid
                        item
                        container
                        justify="space-between"
                        alignItems="center"
                        wrap="nowrap"
                    >
                        <Grid item>
                            <Typography variant="h5">Documents</Typography>
                        </Grid>
                        {user && user.admin && (
                        <Grid item container spacing={1} justify="flex-end" alignItems="center">
                            {uploadLoading && (
                                <Grid item>
                                    <CircularProgress />
                                </Grid>
                            )}
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
                                        size="large"
                                        component="span"
                                        variant="outlined"
                                        disabled={uploadLoading}
                                    >
                                        Upload New File
                                    </Button>
                                </label>
                            </Grid>
                        </Grid>
                    )}
                    </Grid>
                    <Grid item container direction="column" spacing={2}>
                        {listOfFiles.length === 0 ? (
                            <EmptyState
                                width={200}
                                title="No documents yet"
                                imageFile="documents.svg"
                            />
                        ) : (
                            listOfFiles.map((file, index) => (
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
                                        wrap="nowrap"
                                    >
                                        <Grid item>
                                            <DescriptionIcon />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body1" noWrap>
                                                {file}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <IconButton
                                            onClick={() => onDownload(file)}
                                        >
                                            <GetAppIcon />
                                        </IconButton>
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
                            ))
                        )}
                    </Grid>
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
