import React, { useCallback, useState } from "react";
import "./Login.css";
import { Box, Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  AuthProvider
} from "firebase/auth";
import { auth, githubProvider, googleProvider } from "../firebase";
import googleLogo from "../assets/web_light_rd_na.svg";
import githubLogo from "../assets/github-mark-white.svg";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleFormData = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setFormData((formData) => ({
        ...formData,
        [event.target.id]: event.target.value
      }));
    },
    []
  );

  const mailSignin = useCallback(() => {
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(`エラー: ${err?.toString()}`);
      });
  }, [formData]);

  const signinWithProvider = useCallback((provider: AuthProvider) => {
    signInWithPopup(auth, provider)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(`エラー: ${err?.toString()}`);
      });
  }, []);

  return (
    <div
      className={
        "login flex h-screen flex-col items-center justify-center bg-slate-100"
      }
    >
      <div className={"flex max-w-screen-lg flex-col items-center gap-4"}>
        <div className={"pb-4 text-6xl"}>
          <p>{"Sign In"}</p>
        </div>
        <Box>
          <div className={"flex w-96 flex-col gap-5 pb-3"}>
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
              className={"h-12 normal-case"}
              variant="contained"
              onClick={mailSignin}
            >
              {"Sign in"}
            </Button>
          </div>
        </Box>
        <div className={"flex flex-col items-center gap-3 pb-4"}>
          <Link
            to="/sign-up"
            className="font-medium text-blue-600 hover:underline"
          >
            {"Sign up here"}
          </Link>
          <Link
            to="/reset-password"
            className="font-medium text-blue-600 hover:underline"
          >
            {"Reset password"}
          </Link>
        </div>
        <div className={"flex w-full flex-col justify-center gap-5"}>
          <Button
            className="bg-google-white normal-case text-google-black hover:bg-google-nature"
            variant="contained"
            startIcon={<img src={googleLogo} alt="Google logo"></img>}
            onClick={() => signinWithProvider(googleProvider)}
          >
            {"Continue with Google"}
          </Button>
          <Button
            className="bg-github-glay normal-case hover:bg-github-black"
            variant="contained"
            startIcon={
              <img
                className="mr-1 w-10"
                src={githubLogo}
                alt="Github logo"
              ></img>
            }
            onClick={() => {
              signinWithProvider(githubProvider);
            }}
          >
            {"Continue with Github"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
