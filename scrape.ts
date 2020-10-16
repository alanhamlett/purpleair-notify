import axios from 'axios';
import * as core from '@actions/core';

type AQIRange = {
  cutoff: number;
  label: string;
};

function getAqiLabel(pm25: number): string {
  const aqiTable: AQIRange[] = [
    { cutoff: 12, label: 'good' }, // AQI 0-50
    { cutoff: 35.4, label: 'moderate' }, // AQI 51-100
    { cutoff: 55.4, label: 'unhealthy for sensitive groups' }, // AQI 101-150
    { cutoff: 150.4, label: 'unhealthy' }, // AQI 151-200
    { cutoff: 250.4, label: 'very unhealthy' }, // AQI 201-300
    { cutoff: 350.4, label: 'hazardous' }, // AQI 301+
  ];

  for (var row of aqiTable) {
    if (pm25 <= row.cutoff) return row.label;
  }
  return aqiTable[-1].label;
}

export const scrape = async () => {
  var sensor_id = process.env.SENSOR_ID || '19189';

  const url = 'https://www.purpleair.com/json?show=' + sensor_id;
  const response = await axios.get(url);
  const pm25 = parseFloat(response.data.results[0].pm2_5_cf_1);
  const aqi = getAqiLabel(pm25);

  const PM25_THRESHOLD = 100;
  if (pm25 >= PM25_THRESHOLD) {
    const msg = `Air quality ${aqi}. PM2.5 ${pm25} over ${PM25_THRESHOLD} threshold!`;
    console.log(msg);
    core.setFailed(msg);
  } else {
    console.log(`Air quality ${aqi}. PM2.5 ${pm25} under threshold ${PM25_THRESHOLD}.`);
  }
};

scrape();
