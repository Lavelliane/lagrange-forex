import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, TextField, Button } from '@mui/material';
// components
// eslint-disable-next-line import/no-unresolved
import lagrange from 'src/utils/lagrange';
import { useQuery } from 'react-query';
import { useState } from 'react';
// sections
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Page404 from './Page404';
import {
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { auth } from '../firebase-config';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const [nInputs, setNInputs] = useState(1);
  const [dateOfExtrapolation, setDateOfExtrapolation] = useState();
  const [stockCode, setStockCode] = useState('IBM');
  const [dates, setDates] = useState();
  const [datesNumeric, setDatesNumeric] = useState();
  const [valuePerDate, setValuePerDate] = useState();

  const compressDate = (dateString) => Date.parse(dateString) / 10000

  const fetchTimeSeries = async () => {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${stockCode.toUpperCase()}&apikey=JCPHBSQUN3UH142O`
    );
    return response.json();
  };

  const onSuccess = (data) => {

    const dates = Object.keys(data["Monthly Time Series"]).map((key, i) => key).slice(0, 30);
    const datesNumeric = dates.map((date) => compressDate(date));
    const valuePerDate = Object.keys(data["Monthly Time Series"]).map((key, i) => (+data["Monthly Time Series"][`${key}`]["1. open"]).toFixed(2)).slice(0,30);

    const result = lagrange(compressDate(dateOfExtrapolation), datesNumeric.slice(0, +nInputs), valuePerDate.slice(0, +nInputs))

    setDates([dateOfExtrapolation, ...dates])
    setDatesNumeric([compressDate(dateOfExtrapolation), ...datesNumeric])
    setValuePerDate([result.toFixed(2), ...valuePerDate])

  }
  const onError = (error) => {
    console.log(error)
  }
  const { data, status, refetch, isLoading, isFetching, isError } = useQuery('timeSeries', fetchTimeSeries, {
    refetchOnWindowFocus: false,
    enabled: false, // disable this query from automatically running
    onSuccess,
    onError,
  });

  const extrapolate = (e) => {
    e.preventDefault()
    refetch()
    
  };

  const handleChange = (newValue) => {
    setDateOfExtrapolation(newValue.toISOString().split('T')[0]);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
 

  if(auth.currentUser?.email === null){
    return (
      <Page404 />
    )
  }

  return (
    <>
      <Helmet>
        <title> Dashboard | Lagrange </title>
      </Helmet>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              id="outlined-required"
              label="N"
              helperText="Number of inputs"
              onChange={(e) => setNInputs(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
          <DesktopDatePicker
              label="Date of Appointment"
              inputFormat="MM/DD/YYYY"
              value={dateOfExtrapolation}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params}  />}
              minDate={dayjs()}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              id="outlined-required"
              label="e.g. IBM"
              helperText="Stock Code"
              onChange={(e) => setStockCode(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" disableElevation sx={{ padding: '15px', width: '200px' }} onClick={(e) => extrapolate(e)}>
              Extrapolate
            </Button>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            {data || status === 'error' ? (
              <AppWebsiteVisits
                title={`${stockCode} Open Price by month (Past 15 months)`}
                subheader="(+43%) than last year"
                chartLabels={dates && dates.slice(0, 15)}
                chartData={[
                  {
                    name: 'Stocks',
                    type: 'area',
                    fill: 'gradient',
                    data: valuePerDate && valuePerDate.slice(0, 15),
                  },
                ]}
              />
            ) : (
              <Typography variant="subtitle1">No data found.</Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Data Used for Extrapolation"
              list={[...Array(+nInputs && +nInputs + 1)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: valuePerDate && valuePerDate.map((v) => v)[index],
                type: `order${index + 1}`,
                time: dates && dates.map((d) => d)[index],
              }))}
            />
          </Grid>  

         

          <Grid item xs={12} md={6} lg={12}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>   

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          
        </Grid>
      </Container>
      </LocalizationProvider>
    </>
  );
}
