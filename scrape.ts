import axios from 'axios';
import * as core from '@actions/core';

type Threshold = {
  [key: string]: number;
};

const PM25_THRESHOLD: Threshold = {
  outside: 100,
  inside: 50,
};

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

async function checkAqi(sensor_id: string) {
  const url = 'https://www.purpleair.com/json?show=' + sensor_id.toString();
  const response = await axios.get(url);
  const pm25 = parseFloat(response.data.results[0].pm2_5_cf_1);
  const sensorName: string = response.data.results[0].Label;
  const sensorType: string = response.data.results[0].DEVICE_LOCATIONTYPE;
  const aqi = getAqiLabel(pm25);

  const threshold = PM25_THRESHOLD[sensorType];
  if (pm25 >= threshold) {
    const msg = `Air quality ${aqi}. PM2.5 ${pm25} over ${threshold} threshold! From ${sensorName} (${sensor_id.toString()})`;
    console.log(msg);
    core.setFailed(msg);
    throw new Error(msg);
  } else {
    console.log(
      `Air quality ${aqi}. PM2.5 ${pm25} under threshold ${threshold}. From ${sensorName} (${sensor_id.toString()})`,
    );
  }
}

export const scrape = () => {
  var sensor_ids = process.env.SENSOR_IDS || '19189,64043,20203,62565';
  for (var sensor_id of sensor_ids.split(',')) {
    checkAqi(sensor_id);
  }
};

scrape();
