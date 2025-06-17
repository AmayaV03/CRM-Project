import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { changeLanguage, isRTL } from '../../utils/i18nUtils';

// Styled components
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 120,
  margin: theme.spacing(1),
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.23)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  '& .MuiSelect-select': {
    color: '#FFFFFF !important',
  },
  '& .MuiSvgIcon-root': {
    color: '#FFFFFF !important',
  },
  '& .MuiSelect-select.MuiSelect-select': {
    color: '#FFFFFF !important',
  },
  '& .MuiSelect-select.MuiSelect-select.': {
    color: '#FFFFFF !important',
  }
}));

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', direction: 'ltr' },
    { code: 'ar', name: 'العربية', direction: 'rtl' }
  ];

  const handleLanguageChange = async (event) => {
    const newLang = event.target.value;
    await changeLanguage(newLang);
  };

  return (
    <StyledFormControl size="small">
      <Select
        labelId="language-select-label"
        id="language-select"
        value={i18n.language}
        onChange={handleLanguageChange}
        sx={{
          color: '#FFFFFF !important',
          '.MuiSelect-select': {
            color: '#FFFFFF !important',
          },
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FFFFFF',
          },
          '& .MuiSvgIcon-root': {
            color: '#FFFFFF',
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem 
            key={lang.code} 
            value={lang.code}
            sx={{ 
              direction: lang.direction,
              fontFamily: lang.code === 'ar' ? 'Arial, sans-serif' : 'inherit',
              color: 'text.primary'
            }}
          >
            {lang.name}
          </MenuItem>
        ))}
      </Select>
    </StyledFormControl>
  );
};

export default LanguageSelector; 