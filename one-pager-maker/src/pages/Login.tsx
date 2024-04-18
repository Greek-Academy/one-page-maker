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
                    <Typography component="h1" variant="h5">
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
                            sx={{ mt: 3, mb: 2 }}
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
                                    onClick={googleSignin}
                                    sx={{ mt: 3 }}
                                >
                                    Sign in with google
                                </Button>
                            </Grid>
                            <Grid item xs>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={githubSignin}
                                    sx={{ mt: 3 }}
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
