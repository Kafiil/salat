import React, { useState, useEffect } from 'react';
import 'reset-css';
import './App.css';
import axios from 'axios';
import moment from 'moment';

import Spinner from './common/spinner';
import PrayerCard from './components/prayerCard';
import SelectList from './components/selectList';

const API_URL = 'https://maroc-salat.herokuapp.com/';

const App = () => {
  let [cities, setCities] = useState();
  let [prayers, setPrayers] = useState();
  let [id, setId] = useState(+localStorage.getItem('id') || 1);

  useEffect(() => {
    async function init() {
      const today = moment();
      const yesterday = moment().subtract(1, 'day');

      const day = moment().date();
      const month = moment().month() + 1;
      const PRAYERS_KEY = `prayers_${day}_${month}`;
      const YESTERDAY_KEY = `prayers_${yesterday.date()}_${yesterday.month()}`;

      //TODO: Extract a custom hook
      const cities = localStorage.getItem('cities')
        ? JSON.parse(localStorage.getItem('cities'))
        : (await axios.get(`${API_URL}city`)).data;

      setCities(cities);
      localStorage.setItem('cities', JSON.stringify(cities));

      const URL = `${API_URL}prayer?month=${today.month()}&day=${today.date()}`;

      const prayers = localStorage.getItem(PRAYERS_KEY)
        ? JSON.parse(localStorage.getItem(PRAYERS_KEY))
        : (await axios.get(URL)).data;
      setPrayers(prayers);
      localStorage.removeItem(YESTERDAY_KEY);
      localStorage.setItem(PRAYERS_KEY, JSON.stringify(prayers));
    }

    init();
  }, []);

  useEffect(() => {
    localStorage.setItem('id', id);
  }, [id]);

  const onChange = e => {
    const id = +e.target.value;
    setId(id);
  };

  return (
    <div id="main">
      {id && prayers ? (
        <>
          <PrayerCard prayer={prayers.find(e => e.id === id)} />
          <SelectList value={id} values={cities} onChange={onChange} />
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default App;