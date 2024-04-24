import React from 'react';
import './Login.css';
import {
    Box,
    Button,
    Link,
    TextField,
} from '@mui/material';
import { signInWithEmailAndPassword, signInWithPopup, AuthProvider } from 'firebase/auth';
import { auth, githubProvider, googleProvider } from '../firebase';
import googleLogo from '../assets/web_light_rd_na.svg';
import githubLogo from '../assets/github-mark-white.svg';

const Login = () => {
    const mailSignin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        signInWithEmailAndPassword(
            auth,
            String(data.get('email')),
            String(data.get('password'))
        ).catch((err) => {
            alert(`エラー: ${err?.toString()}`);
        });
    };

    const signinWithProvider = (provider: AuthProvider) => {
        signInWithPopup(auth, provider).catch((err) => {
            alert(`エラー: ${err?.toString()}`);
        });
    };

    return (
        <div className={"login flex flex-col justify-center items-center bg-slate-100 h-screen"}>
            <div className={"max-w-screen-lg flex flex-col items-center gap-4"}>
                <div className={"text-6xl pb-4"}>
                    <p>{'Sign In'}</p>
                </div>
                <Box component="form" onSubmit={mailSignin} >
                    <div className={"flex flex-col w-96 gap-5 pb-3"}>
                        <TextField
                            required
                            id="email"
                            label="email address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            required
                            id="password"
                            label="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                        />
                        <Button
                            className={"normal-case h-12"}
                            type="submit"
                            variant="contained"
                        >
                            {'Sign in'}
                        </Button>
                    </div>
                </Box>
                <div className={"flex flex-col items-center gap-3 pb-4"}>
                    <Link href="#" variant="h6">
                        {"Sign up here"}
                    </Link>
                    <Link href="#" variant="h6">
                        {"Reset password"}
                    </Link>
                </div>
                <div className={"flex flex-col justify-center w-full gap-5"}>
                    <Button
                        className="bg-google-white hover:bg-google-nature text-google-black normal-case"
                        variant="contained"
                        startIcon={<img src={googleLogo} alt="Google logo"></img>}
                        onClick={() => signinWithProvider(googleProvider)}
                    >
                        {'Continue with Google'}
                    </Button>
                    <Button
                        className="bg-github-glay hover:bg-github-black normal-case"
                        variant="contained"
                        startIcon={<img className="w-10 mr-1" src={githubLogo} alt="Github logo"></img>}
                        onClick={() => { signinWithProvider(githubProvider) }}
                    >
                        {'Continue with Github'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Login;
