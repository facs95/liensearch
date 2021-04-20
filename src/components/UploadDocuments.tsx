import React, { useState, useContext, useEffect, useCallback } from "react";
import {
    Grid,
    makeStyles,
    Button,
    Paper,
    Typography,
    IconButton,
    CircularProgress,
    Box,
} from "@material-ui/core";
import { UserContext } from "../context/UserContext";
import CloseIcon from "@material-ui/icons/Close";
import DescriptionIcon from "@material-ui/icons/Description";
import GetAppIcon from "@material-ui/icons/GetApp";
import { map } from "lodash";
import firebase from "firebase/app";
import { EmptyState } from "./EmpyState";
import { SnackContext } from "../context/SnackContext";
import { INFO_ACTION_BOX_HEIGHT } from "./TaskList/TaskList";

interface Props {
    orderId: string;
    orgId: string;
}

export const UploadDocuments = ({ orderId, orgId }: Props) => {
    const [listOfFiles, setListOfFiles] = useState<string[]>([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    const docsPath = `org-${orgId}/order-${orderId}/`;

    const { setMessage, setMessageType } = useContext(SnackContext);
    const user = useContext(UserContext);

    const db = firebase.storage();

    const catchError = useCallback(
        (err: any) => {
            setMessageType("error");
            setMessage(err && err.message);
        },
        [setMessage, setMessageType]
    );

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
                .catch((err) => catchError(err))
                .finally(() => setLoading(false));
        }
    }, [db, user, docsPath, catchError]);

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

    if (loading) return <CircularProgress />;

    return (
        <Paper className={classes.paper}>
            <Box display="flex" flexDirection="column" p={3} height="100%">
                <Box
                    mt={1}
                    display="flex"
                    justifyContent="space-between"
                    flexWrap="nowrap"
                    alignItems="center"
                >
                    <Typography variant="h5">Documents</Typography>
                    {user && user.admin && (
                        <Grid
                            item
                            container
                            spacing={1}
                            justify="flex-end"
                            alignItems="center"
                        >
                            {uploadLoading && (
                                <Grid item>
                                    <CircularProgress size={30} />
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
                                        size="small"
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
                </Box>
                {listOfFiles.length !== 0 ? (
                    <Box mt={1} flexGrow={1} className={classes.filesContainer}>
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
                        ))}
                    </Box>
                ) : (
                    <Box mt={2} flexGrow={1}>
                        <EmptyState
                            width={150}
                            title="No Documents Found"
                            imageFile="documents.svg"
                        />
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

const useStyles = makeStyles(() => ({
    input: {
        display: "none",
    },
    paper: {
        height: INFO_ACTION_BOX_HEIGHT,
    },
    filesContainer: {
        overflowY: "scroll",
    },
}));
