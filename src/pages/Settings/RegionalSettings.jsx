import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';

const RegionalSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [dateFormat, setDateFormat] = React.useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = React.useState('12h');
  const [currency, setCurrency] = React.useState('USD');

  const handleDateFormatChange = (event) => {
    setDateFormat(event.target.value);
    // TODO: Save to Redux store when implemented
  };

  const handleTimeFormatChange = (event) => {
    setTimeFormat(event.target.value);
    // TODO: Save to Redux store when implemented
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
    // TODO: Save to Redux store when implemented
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('settings.regional')}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('settings.general.dateFormat')}</InputLabel>
              <Select
                value={dateFormat}
                onChange={handleDateFormatChange}
                label={t('settings.general.dateFormat')}
              >
                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('settings.general.timeFormat')}</InputLabel>
              <Select
                value={timeFormat}
                onChange={handleTimeFormatChange}
                label={t('settings.general.timeFormat')}
              >
                <MenuItem value="12h">12-hour (AM/PM)</MenuItem>
                <MenuItem value="24h">24-hour</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('settings.general.currency')}</InputLabel>
              <Select
                value={currency}
                onChange={handleCurrencyChange}
                label={t('settings.general.currency')}
              >
                <MenuItem value="USD">USD ($)</MenuItem>
                <MenuItem value="EUR">EUR (€)</MenuItem>
                <MenuItem value="GBP">GBP (£)</MenuItem>
                <MenuItem value="SAR">SAR (﷼)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RegionalSettings; 