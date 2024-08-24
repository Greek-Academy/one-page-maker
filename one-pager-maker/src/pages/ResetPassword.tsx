import React, { useCallback, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "" });

  const handleFormData = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setFormData((formData) => ({
        ...formData,
        [event.target.id]: event.target.value
      }));
    },
    []
  );

  const reset = useCallback(() => {
    sendPasswordResetEmail(auth, formData.email)
      .then(() => {
        alert("We sent an email to you. Please check your mail box.");
        navigate("/");
      })
      .catch((err) => {
        alert(`エラー: ${err?.toString()}`);
      });
  }, [formData]);

  return (
    <div
      className={
        "reset-password flex h-screen flex-col items-center justify-center bg-slate-100"
      }
    >
      <div className={"flex max-w-screen-lg flex-col items-center gap-4"}>
        <div className={"flex flex-col items-center pb-4 text-6xl"}>
          <p>{"Enter your email to"}</p>
          <p>{" reset password"}</p>
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
            <Button
              className={"h-12 normal-case"}
              variant="contained"
              onClick={reset}
            >
              {"Reset password"}
            </Button>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default ResetPassword;
