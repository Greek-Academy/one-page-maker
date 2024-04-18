import React from 'react';
import './Login.css';
import {
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
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
        )
            .then((userCredential) => {
                // Sign in with password
                const user = userCredential.user;
                console.log(user);
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    const googleSignin = () => {
        signInWithPopup(auth, googleProvider).catch((err) => {
            // TODO: Link multiple auth providor
            // https://firebase.google.com/docs/auth/web/account-linking?hl=en
            alert(err.message);
        });
    };

    const githubSignin = () => {
        signInWithPopup(auth, githubProvider).catch((err) => {
            alert(err.message);
        });
    };

    return (
        <div className="login">
            <Container className="page" component="main" maxWidth="lg">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '20px',
                        padding: '10px',
                    }}
                >
                    <Typography component="h1" variant="h3">
                        Sign In
                    </Typography>
                    <Box component="form" onSubmit={mailSignin} sx={{ mt: 1 }}>
                        <TextField
                            required
                            id="email"
                            label="email address"
                            name="email"
                            fullWidth
                            autoComplete="email"
                            autoFocus
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            required
                            id="password"
                            label="password"
                            name="password"
                            fullWidth
                            type="password"
                            autoComplete="current-password"
                            sx={{ mt: 2 }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 3,
                                mb: 2,
                                height: '50px',
                                textTransform: 'none',
                            }}
                        >
                            Sign in
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                        <Grid>
                            <Grid item xs>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<img src={googleLogo}></img>}
                                    onClick={googleSignin}
                                    sx={{
                                        mt: 3,
                                        height: '50px',
                                        backgroundColor: '#FFFFFF',
                                        color: '#1F1F1F',
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: '#F2F2F2',
                                        },
                                    }}
                                >
                                    Sign in with Google
                                </Button>
                            </Grid>
                            <Grid item xs>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={
                                        <img
                                            src={githubLogo}
                                            style={{
                                                width: '40px',
                                                marginRight: '5px',
                                            }}
                                        ></img>
                                    }
                                    onClick={githubSignin}
                                    sx={{
                                        mt: 3,
                                        height: '50px',
                                        backgroundColor: '#444',
                                        color: '#FAFAFA',
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: '#030303',
                                        },
                                    }}
                                >
                                    Sign in with Github
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

export default Login;
