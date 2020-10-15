import axios from 'axios';

export const scrape = async () => {
  var sensor_id = process.env.SENSOR_ID || '19189';

  const url = 'https://www.purpleair.com/json?show=' + sensor_id;
  const response = await axios.get(url);
  var pm25 = response.data.results[0].pm2_5_cf_1;
  console.log(pm25);
  console.log(`::set-output name=pm25::${pm25}`);
};

scrape();
