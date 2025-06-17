import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme, setTheme } from '../../store/slices/uiSlice';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Switch,
  FormControlLabel,
  useTheme,
} from '@mui/material';

const ThemeSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);
  const theme = useTheme();

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== currentTheme) {
      dispatch(setTheme(savedTheme));
    }
  }, []);

  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    dispatch(setTheme(newTheme));
    localStorage.setItem('theme', newTheme);
    // Update document theme attribute
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleDarkModeToggle = (event) => {
    const newTheme = event.target.checked ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    localStorage.setItem('theme', newTheme);
    // Update document theme attribute
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <Card sx={{ bgcolor: theme.palette.background.paper }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="text.primary">
          {t('settings.theme')}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('settings.theme')}</InputLabel>
              <Select
                value={currentTheme}
                onChange={handleThemeChange}
                label={t('settings.theme')}
              >
                <MenuItem value="light">{t('settings.lightMode')}</MenuItem>
                <MenuItem value="dark">{t('settings.darkMode')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={currentTheme === 'dark'}
                  onChange={handleDarkModeToggle}
                />
              }
              label={t('settings.darkMode')}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ThemeSettings; 