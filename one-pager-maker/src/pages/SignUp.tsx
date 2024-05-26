import React, { useCallback, useState } from 'react';
import {
    Box,
    Button,
    TextField,
} from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { userApi } from "../api/userApi.ts";
import { assertZodSchema } from "../utils/asserts.ts";
import { idSchema } from '../entity/user/userType.ts';

const SignUp = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({ userId: "", email: "", password: "" });

    const result = userApi.useIsDuplicatedIdQuery(formData.userId);
    const mutation = userApi.useCreateUserMutation();

    const handleFormData = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setFormData(formData => ({
            ...formData,
            [event.target.id]: event.target.value,
        }))
    }, [])

    const createUser = useCallback(() => {

        // user id validation
        try {
            assertZodSchema(idSchema, formData.userId)
        } catch {
            alert(`User ID is allowed only alphanumeric characters, underscores (_), and hyphens (-).`);
            return
        }

        if (result.data) {
            alert(`User ID "${formData.userId}" is already registerd.`);
            return
        } else if (result.error) {
            alert(`Server Internal Error. Please retry.`);
            return
        }

        // TODO: similar code. refactor!
        // Regist user
        createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
        ).then((authUser) => {

            const user = {
                id: formData.userId,
                uid: authUser.user.uid,
                photoUrl: "https://fonts.gstatic.com/s/materialsymbolsoutlined/v183/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsI.woff2",
            }
            mutation.mutate(user)

            // Signin with created user
            signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            ).then(() => {
                navigate('/')
            }).catch((err) => {
                alert(`エラー: ${err?.toString()}`);
            });
        }).catch((err) => {
            alert(`エラー: ${err?.toString()}`);
        });
    }, [formData, result]);

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
                            id="userId"
                            label="user ID"
                            name="userId"
                            autoFocus
                            value={formData.userId}
                            onChange={handleFormData}
                        />
                        <TextField
                            required
                            id="email"
                            label="email address"
                            name="email"
                            autoComplete="email"
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
