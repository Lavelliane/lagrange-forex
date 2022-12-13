import { useState, useEffect } from 'react';

export default async function useFetch(stockCode, dateOfExtrapolation, nInputs) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  function fetchNow() {
    setLoading(true);
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${stockCode}&apikey=demo`)
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        setData(res.data);
      })
      .then((error) => {
        setLoading(false);
        setError(error);
      });
  }

  const dates = Object.keys(data['Monthly Time Series'])
    .map((key, i) => key)
    .slice(0, 30);
  const datesNumeric = dates.map((date) => Date.parse(date));
  const valuePerDate = Object.keys(data['Monthly Time Series'])
    .map((key, i) => +data['Monthly Time Series'][`${key}`]['1. open'])
    .slice(0, 30);

  dates.unshift(dateOfExtrapolation);
}
