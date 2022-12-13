import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import Iconify from '../../../components/iconify';
import { auth } from '../../../firebase-config';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [error, setError] = useState("")

  const [userX, setUserX] = useState({})

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUserX(currentUser)
      console.log(userX)
    })
  
  },[])
  

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      console.log(user)
      if(user){
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      setError(error.message)
    }
    
  }
  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" onChange={(e) => setLoginEmail(e.target.value)}/>

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
          onChange={(e) => setLoginPassword(e.target.value)}
        />
      </Stack>
          <Typography variant='subtitle2' sx={{color: 'red'}}>{error}</Typography>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={login}>
        Login
      </LoadingButton>
    </>
  );
}
