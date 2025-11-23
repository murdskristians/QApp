import { useState } from 'react';
import { PuiBox, PuiTypography, PuiSwitch, PuiSelectV2, PuiMenuItem } from 'piche.ui';

export const GeneralPreferences = () => {
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC+2');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [autoSave, setAutoSave] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);

  return (
    <PuiBox
      sx={{
        height: '100%',
        padding: { xs: '24px 16px', md: '48px 40px' },
        overflowY: 'auto',
        background: { xs: 'transparent', md: 'transparent' },
        '[data-theme="dark"] &': {
          background: { xs: 'transparent', md: 'transparent' },
        },
      }}
      className="personal-info"
    >
      <PuiTypography
        variant="body-lg-medium"
        sx={{
          marginBottom: '36px !important',
          marginLeft: '24px',
          fontWeight: 500,
          fontSize: '20px',
          letterSpacing: '-0.01em',
        }}
      >
        General Preferences
      </PuiTypography>

      <PuiBox sx={{ maxWidth: '747px' }}>
        <PuiBox
          sx={{
            background: { xs: 'transparent', md: 'transparent' },
            borderRadius: { xs: '16px', md: '24px' },
            padding: { xs: '16px', md: '24px' },
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '16px', md: '24px' },
            '[data-theme="dark"] &': {
              background: { xs: 'transparent', md: 'transparent' },
            },
          }}
        >
          {/* Language */}
          <PuiBox>
            <PuiTypography variant="body-sm-semibold" sx={{ marginBottom: '8px' }}>
              Language
            </PuiTypography>
            <PuiSelectV2
              value={language}
              onChange={(e) => setLanguage(e.target.value as string)}
              fullWidth
            >
              <PuiMenuItem value="en">English</PuiMenuItem>
              <PuiMenuItem value="lv">Latviešu</PuiMenuItem>
              <PuiMenuItem value="ru">Русский</PuiMenuItem>
            </PuiSelectV2>
          </PuiBox>

          {/* Timezone */}
          <PuiBox>
            <PuiTypography variant="body-sm-semibold" sx={{ marginBottom: '8px' }}>
              Timezone
            </PuiTypography>
            <PuiSelectV2
              value={timezone}
              onChange={(e) => setTimezone(e.target.value as string)}
              fullWidth
            >
              <PuiMenuItem value="UTC+2">UTC+2 (Riga)</PuiMenuItem>
              <PuiMenuItem value="UTC+1">UTC+1</PuiMenuItem>
              <PuiMenuItem value="UTC+0">UTC+0</PuiMenuItem>
              <PuiMenuItem value="UTC-5">UTC-5 (New York)</PuiMenuItem>
            </PuiSelectV2>
          </PuiBox>

          {/* Date Format */}
          <PuiBox>
            <PuiTypography variant="body-sm-semibold" sx={{ marginBottom: '8px' }}>
              Date Format
            </PuiTypography>
            <PuiSelectV2
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value as string)}
              fullWidth
            >
              <PuiMenuItem value="DD/MM/YYYY">DD/MM/YYYY</PuiMenuItem>
              <PuiMenuItem value="MM/DD/YYYY">MM/DD/YYYY</PuiMenuItem>
              <PuiMenuItem value="YYYY-MM-DD">YYYY-MM-DD</PuiMenuItem>
            </PuiSelectV2>
          </PuiBox>

          {/* Auto-save */}
          <PuiBox
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: (theme) => theme.palette.background.default,
              borderRadius: '12px',
              border: (theme) => `1px solid ${theme.palette.grey[50]}`,
              '[data-theme="dark"] &': {
                backgroundColor: '#272727',
                border: '1px solid #3a3a3a',
                color: '#ffffff',
              },
            }}
          >
            <PuiBox>
              <PuiTypography variant="body-sm-semibold" sx={{ marginBottom: '8px', display: 'block' }}>
                Auto-save Drafts
              </PuiTypography>
              <PuiTypography variant="body-xs-regular" sx={{ color: '#6B7280', display: 'block' }}>
                Automatically save message drafts as you type
              </PuiTypography>
            </PuiBox>
            <PuiSwitch
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              sx={{
                '& .MuiSwitch-track': {
                  backgroundColor: '#D1D5DB',
                  opacity: 1,
                },
                '&:hover .MuiSwitch-track': {
                  backgroundColor: '#9CA3AF',
                },
              }}
            />
          </PuiBox>

          {/* Show Online Status */}
          <PuiBox
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: (theme) => theme.palette.background.default,
              borderRadius: '12px',
              border: (theme) => `1px solid ${theme.palette.grey[50]}`,
              '[data-theme="dark"] &': {
                backgroundColor: '#272727',
                border: '1px solid #3a3a3a',
                color: '#ffffff',
              },
            }}
          >
            <PuiBox>
              <PuiTypography variant="body-sm-semibold" sx={{ marginBottom: '8px', display: 'block' }}>
                Show Online Status
              </PuiTypography>
              <PuiTypography variant="body-xs-regular" sx={{ color: '#6B7280', display: 'block' }}>
                Let others see when you're online
              </PuiTypography>
            </PuiBox>
            <PuiSwitch
              checked={showOnlineStatus}
              onChange={(e) => setShowOnlineStatus(e.target.checked)}
              sx={{
                '& .MuiSwitch-track': {
                  backgroundColor: '#D1D5DB',
                  opacity: 1,
                },
                '&:hover .MuiSwitch-track': {
                  backgroundColor: '#9CA3AF',
                },
              }}
            />
          </PuiBox>
        </PuiBox>
      </PuiBox>
    </PuiBox>
  );
};
