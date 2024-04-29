import React, { useCallback, useState } from 'react';
import {
    Box,
    Button,
    TextField,
} from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleFormData = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setFormData(formData => ({
            ...formData,
            [event.target.id]: event.target.value,
        }))
    }, [])

    const createUser = useCallback(() => {

        createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
        ).then(() => {
            // Signin with created user
            signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            ).catch((err) => {
                alert(`エラー: ${err?.toString()}`);
            });
            navigate('/')
        }).catch((err) => {
            alert(`エラー: ${err?.toString()}`);
        });
    }, [formData]);

    return (
        <div className={"sign-up flex flex-col justify-center items-center bg-slate-100 h-screen"}>
            <div className={"max-w-screen-lg flex flex-col items-center gap-4"}>
                <div className={"text-6xl pb-4"}>
                    <p>{'Sign Up'}</p>
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
                        <TextField
                            required
                            id="password"
                            label="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleFormData}
                        />
                        <Button
                            className={"normal-case h-12"}
                            variant="contained"
                            onClick={createUser}
                        >
                            {'Create account'}
                        </Button>
                    </div>
                </Box>
            </div>
        </div>
    );
};

export default SignUp;
