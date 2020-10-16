# purpleair-notify

Watch this repo to receive an email whenever [PurpleAir][purpleair] sensor(s) show AQI air quality PM2.5 as "unhealthy".

![AQI PM2.5 Table](/aqi_pm25_table.png?raw=true)

To set your own sensors, [fork][fork] this repo and enter your PurpleAir integer sensor id(s) separated by comma as a [GitHub Repo Secret][secrets] named `SENSOR_IDS`, or modify `scrape.ts`.

[purpleair]: https://www.purpleair.com/map
[secrets]: https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository
[fork]: https://github.com/alanhamlett/purpleair-notify/fork
