import React, { useCallback, useState } from 'react';
import {
    Box,
    Button,
    TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userApi } from "../api/userApi.ts";
import { assertZodSchema } from "../utils/asserts.ts";
import { idSchema } from '../entity/user/userType.ts';
import { useAppSelector } from '../redux/hooks.ts';

const SetId = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({ userId: "" });

    const uid = useAppSelector(state => state.user.user?.uid);
    const photoUrl = useAppSelector(state => state.user.user?.photoUrl);
    const result = userApi.useIsDuplicatedIdQuery(formData.userId);
    const mutation = userApi.useCreateUserMutation();

    const handleFormData = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setFormData(formData => ({
            ...formData,
            [event.target.id]: event.target.value,
        }))
    }, [])

    const updateUser = useCallback(() => {

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

        // Update user
        const user = {
            id: formData.userId,
            uid: uid ? uid : "",
            photoUrl: photoUrl ? photoUrl : "https://fonts.gstatic.com/s/materialsymbolsoutlined/v183/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsI.woff2",
        }
        mutation.mutate(user)
        navigate('/login')
        alert('Success setting your User ID! \nPlease sign in again.')
    }, [formData, result]);

    return (
        <div className={"set-id flex flex-col justify-center items-center bg-slate-100 h-screen"}>
            <div className={"max-w-screen-lg flex flex-col items-center gap-4"}>
                <div className={"text-6xl pb-4"}>
                    <p>{'Please set your User ID'}</p>
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
                        <Button
                            className={"normal-case h-12"}
                            variant="contained"
                            onClick={updateUser}
                        >
                            {'Submit'}
                        </Button>
                    </div>
                </Box>
            </div>
        </div>
    );
};

export default SetId;
