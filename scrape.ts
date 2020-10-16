import axios from 'axios';
import * as core from '@actions/core';

function getAqiLabel(pm25: float): string {
  const aqiTable = [
    [12, 'good'], // AQI 0-50
    [35.4, 'moderate'], // AQI 51-100
    [55.4, 'unhealthy for sensitive groups'], // AQI 101-150
    [150.4, 'unhealthy'], // AQI 151-200
    [250.4, 'very unhealthy'], // AQI 201-300
    [350.4, 'hazardous'], // AQI 301+
  ];

  for (var row of aqiTable) {
    const cutoff = row[0];
    if (pm25 <= cutoff) return row[1];
  }
  return aqiTable[-1][1];
}

export const scrape = async () => {
  var sensor_id = process.env.SENSOR_ID || '19189';

  const url = 'https://www.purpleair.com/json?show=' + sensor_id;
  const response = await axios.get(url);
  const pm25: float = parseFloat(response.data.results[0].pm2_5_cf_1);
  console.log('PM2.5: ' + pm25.toString());
  console.log(`::set-output name=pm25::${pm25}`);
  const aqi = getAqiLabel(pm25);
  console.log('AQI: ' + aqi);

  const PM25_THRESHOLD = 100;
  if (pm25 >= PM25_THRESHOLD) {
    const msg = `Air quality ${label}. PM2.5 over ${PM25_THRESHOLD} threshold!`;
    console.log(msg);
    core.setFailed(msg);
  } else {
    console.log(`Air quality ${label}. PM2.5 under threshold ${PM25_THRESHOLD}.`);
  }
};

scrape();
