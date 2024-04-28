import React, { useCallback, useState } from 'react';
import {
    Box,
    Button,
    TextField,
} from '@mui/material';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "" });

    const handleFormData = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setFormData(formData => ({
            ...formData,
            [event.target.id]: event.target.value,
        }))
    }, [])


    const reset = useCallback(() => {
        // TODO: redirect sign in page 
        sendPasswordResetEmail(
            auth,
            formData.email,
        ).then(() => {
            alert('send mail and please check your mail box')
            navigate('/')
        }).catch((err) => {
            alert(`エラー: ${err?.toString()}`);
        });
    }, [formData]);

    return (
        <div className={"reset-password flex flex-col justify-center items-center  bg-slate-100 h-screen"}>
            <div className={"max-w-screen-lg flex flex-col items-center gap-4"}>
                <div className={"flex flex-col items-center text-6xl pb-4"}>
                    <p>{"Enter your email to"}</p>
                    <p>{" reset password"}</p>
                </div>
                <Box >
                    <div className={"flex flex-col w-96 gap-5 pb-3"}>
                        <TextField
                            required
                            id="email"
                            label="email address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleFormData}
                        />
                        <Button
                            className={"normal-case h-12"}
                            variant="contained"
                            onClick={reset}
                        >
                            {'Reset password'}
                        </Button>
                    </div>
                </Box>
            </div>
        </div>
    );
};

export default ResetPassword;
