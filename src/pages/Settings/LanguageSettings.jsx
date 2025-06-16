import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage, setLanguage } from '../../store/slices/uiSlice';
import { changeLanguage } from '../../utils/i18nUtils';
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

const LanguageSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectLanguage);

  const handleLanguageChange = async (event) => {
    const newLanguage = event.target.value;
    try {
      await changeLanguage(newLanguage);
      dispatch(setLanguage(newLanguage));
      // Force a re-render by updating the document direction
      document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLanguage;
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('settings.language')}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('settings.language')}</InputLabel>
              <Select
                value={currentLanguage}
                onChange={handleLanguageChange}
                label={t('settings.language')}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ar">العربية</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LanguageSettings; 