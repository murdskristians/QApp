import { PuiBox, PuiTypography, PuiButton } from 'piche.ui';

const connectedApps = [
  {
    name: 'Google',
    icon: '🔵',
    description: 'Connected for authentication',
    connectedAt: 'Connected 2 months ago',
  },
  {
    name: 'Slack',
    icon: '💬',
    description: 'Not connected',
    connectedAt: null,
  },
  {
    name: 'Microsoft Teams',
    icon: '👥',
    description: 'Not connected',
    connectedAt: null,
  },
];

export const ConnectedApps = () => {
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
        Connected Apps
      </PuiTypography>

      <PuiBox sx={{ maxWidth: '747px' }}>
        <PuiBox
          sx={{
            background: { xs: 'transparent', md: 'transparent' },
            borderRadius: { xs: '16px', md: '24px' },
            padding: { xs: '16px', md: '24px' },
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '12px', md: '16px' },
            '[data-theme="dark"] &': {
              background: { xs: 'transparent', md: 'transparent' },
            },
          }}
        >
          {connectedApps.map((app) => (
            <PuiBox
              key={app.name}
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
              <PuiBox sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <PuiBox sx={{ fontSize: '32px' }}>{app.icon}</PuiBox>
                <PuiBox>
                  <PuiTypography variant="body-sm-semibold" sx={{ marginBottom: '4px', display: 'block' }}>
                    {app.name}
                  </PuiTypography>
                  <PuiTypography variant="body-xs-regular" sx={{ color: '#6B7280', display: 'block' }}>
                    {app.connectedAt || app.description}
                  </PuiTypography>
                </PuiBox>
              </PuiBox>
              <PuiButton variant={app.connectedAt ? 'outlined' : 'contained'} size="small" sx={{ padding: '2px 6px', fontSize: '10px', minWidth: 'auto', height: '24px' }}>
                {app.connectedAt ? 'Disconnect' : 'Connect'}
              </PuiButton>
            </PuiBox>
          ))}
        </PuiBox>
      </PuiBox>
    </PuiBox>
  );
};
