import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { TicketStatus, TicketPriority } from '../../types';

const MOCK_TICKET_OVERVIEW = [
  { name: 'Open', value: 45, color: '#2196f3' },
  { name: 'In Progress', value: 28, color: '#ff9800' },
  { name: 'Pending', value: 15, color: '#9c27b0' },
  { name: 'Resolved', value: 18, color: '#4caf50' },
  { name: 'Closed', value: 30, color: '#9e9e9e' },
];

const MOCK_TICKET_BY_PRIORITY = [
  { name: 'Low', value: 32, color: '#9e9e9e' },
  { name: 'Medium', value: 45, color: '#2196f3' },
  { name: 'High', value: 38, color: '#ff9800' },
  { name: 'Critical', value: 21, color: '#f44336' },
];

const MOCK_MONTHLY_TICKETS = [
  { name: 'Jan', created: 65, resolved: 42 },
  { name: 'Feb', created: 59, resolved: 52 },
  { name: 'Mar', created: 80, resolved: 72 },
  { name: 'Apr', created: 81, resolved: 90 },
  { name: 'May', created: 56, resolved: 48 },
  { name: 'Jun', created: 55, resolved: 50 },
  { name: 'Jul', created: 40, resolved: 35 },
];

const MOCK_AGENT_PERFORMANCE = [
  { name: 'Alex J.', tickets: 45, avgResponseTime: 2.5 },
  { name: 'Sarah W.', tickets: 38, avgResponseTime: 3.2 },
  { name: 'Michael B.', tickets: 52, avgResponseTime: 1.8 },
  { name: 'Emma T.', tickets: 30, avgResponseTime: 2.1 },
];

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const TotalTickets = () => (
    <Card sx={{ height: '100%', boxShadow: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='h6' color='text.secondary' gutterBottom>
            Total Tickets
          </Typography>
          <DescriptionIcon color='primary' fontSize='large' />
        </Box>
        <Typography
          variant='h3'
          component='div'
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          136
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          +12% from last month
        </Typography>
      </CardContent>
    </Card>
  );

  const ResolvedTickets = () => (
    <Card sx={{ height: '100%', boxShadow: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='h6' color='text.secondary' gutterBottom>
            Resolved
          </Typography>
          <CheckCircleIcon color='success' fontSize='large' />
        </Box>
        <Typography
          variant='h3'
          component='div'
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          48
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Last 30 days
        </Typography>
      </CardContent>
    </Card>
  );

  const PendingTickets = () => (
    <Card sx={{ height: '100%', boxShadow: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='h6' color='text.secondary' gutterBottom>
            Pending
          </Typography>
          <HourglassEmptyIcon color='warning' fontSize='large' />
        </Box>
        <Typography
          variant='h3'
          component='div'
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          43
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Awaiting response
        </Typography>
      </CardContent>
    </Card>
  );

  const CriticalTickets = () => (
    <Card sx={{ height: '100%', boxShadow: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='h6' color='text.secondary' gutterBottom>
            Critical
          </Typography>
          <PriorityHighIcon color='error' fontSize='large' />
        </Box>
        <Typography
          variant='h3'
          component='div'
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          21
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Need immediate attention
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' sx={{ mb: 4, fontWeight: 'bold' }}>
        Support Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <TotalTickets />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ResolvedTickets />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PendingTickets />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CriticalTickets />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, width: '100%', height: '100%', boxShadow: 3 }}>
            <Typography variant='h6' gutterBottom>
              Ticket Status Overview
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <ResponsiveContainer width='102%' height={300}>
              <PieChart>
                <Pie
                  data={MOCK_TICKET_OVERVIEW}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {MOCK_TICKET_OVERVIEW.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', boxShadow: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant='h6'>Agent Performance</Typography>
              <Button variant='outlined' size='small'>
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <ResponsiveContainer width='102%' height={300}>
              <BarChart
                data={MOCK_AGENT_PERFORMANCE}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                layout='vertical'
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis type='number' />
                <YAxis dataKey='name' type='category' />
                <Tooltip />
                <Legend />
                <Bar dataKey='tickets' name='Tickets Resolved' fill='#2196f3' />
                <Bar
                  dataKey='avgResponseTime'
                  name='Avg. Response Time (h)'
                  fill='#ff9800'
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, width: '101%', height: '100%', boxShadow: 3 }}>
            <Typography variant='h6' gutterBottom>
              Tickets by Priority
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={MOCK_TICKET_BY_PRIORITY}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {MOCK_TICKET_BY_PRIORITY.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
