import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// eslint-disable-next-line import/no-unresolved
import { auth } from 'src/firebase-config';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function SignUpForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerDisplayName, setRegisterDisplayName] = useState("")

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
      const result = await updateProfile(auth.currentUser, {
        displayName: registerDisplayName
      })
      console.log(user, result)
    } catch (error) {
      console.log(error.message)
    }
    navigate('/dashboard', { replace: true });
  }

  return (
    <>
      <Stack spacing={3}>
        <TextField name="displayName" label="Display name" onChange={(e) => setRegisterDisplayName(e.target.value)}/>
        <TextField name="email" label="Email address" onChange={(e) => setRegisterEmail(e.target.value)}/>

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={register} sx={{mt: 2}}>
        Sign Up
      </LoadingButton>
    </>
  );
}
