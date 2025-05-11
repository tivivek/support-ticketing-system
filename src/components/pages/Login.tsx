import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Link,
  Divider,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
import type { AppDispatch } from '../../store';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const from = (location.state as any)?.from?.pathname || '/';

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await dispatch(
        login({
          email: data.email,
          password: data.password,
        })
      ).unwrap();

      navigate(from, { replace: true });
    } catch (err: any) {
      setError(
        err.message ||
          'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth='sm' sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Typography variant='h4' component='h1' gutterBottom fontWeight='bold'>
          Support Ticketing System
        </Typography>

        <Typography variant='subtitle1' color='text.secondary' gutterBottom>
          Sign in to your account
        </Typography>

        <Divider sx={{ width: '100%', my: 3 }} />

        {error && (
          <Alert severity='error' sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ width: '100%' }}
        >
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            autoComplete='email'
            autoFocus
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isLoading}
          />

          <TextField
            margin='normal'
            required
            fullWidth
            id='password'
            label='Password'
            type='password'
            autoComplete='current-password'
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={isLoading}
          />

          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={20} color='inherit' /> : null
            }
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant='body2' color='text.secondary'>
              For demo purposes, use the following credentials:
            </Typography>
            <Box sx={{ mt: 1, mb: 2 }}>
              <Typography variant='body2'>
                <strong>Customer:</strong> customer@example.com / password123
              </Typography>
              <Typography variant='body2'>
                <strong>Agent:</strong> agent@example.com / password123
              </Typography>
              <Typography variant='body2'>
                <strong>Admin:</strong> admin@example.com / password123
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
