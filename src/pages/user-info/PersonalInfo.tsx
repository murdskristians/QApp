import { PuiBox, PuiTypography } from 'piche.ui';

import { SocialMedia } from '../../components/layout/SocialMedia';
import { Address } from '../../components/layout/Address';
import { PersonalData } from '../../components/layout/PersonalData';
import { ProfileContact } from '../../types/profile';

interface PersonalInfoProps {
  profileContact: ProfileContact | null;
  isLoading: boolean;
}

export const PersonalInfo = ({
  profileContact,
  isLoading,
}: PersonalInfoProps) => {
  return (
    <PuiBox
      sx={{
        height: '100%',
        padding: { xs: '24px 16px', md: '48px 40px' },
        overflowY: 'auto',
        background: {
          xs: 'transparent',
          md: 'transparent',
        },
        // Dark theme support
        '[data-theme="dark"] &': {
          background: {
            xs: 'transparent',
            md: 'transparent',
          },
        },
      }}
      className="personal-info"
    >
      <PuiTypography
        variant="body-lg-medium"
        sx={{
          marginBottom: { xs: '24px !important', md: '36px !important' },
          marginLeft: { xs: '0', md: '24px' },
          fontWeight: 500,
          fontSize: { xs: '18px', md: '20px' },
          letterSpacing: '-0.01em',
          color: {
            xs: 'inherit',
            md: 'inherit',
          },
          '[data-theme="dark"] &': {
            color: '#ffffff',
          },
        }}
      >
        Personal Information
      </PuiTypography>
      <PuiBox sx={{ maxWidth: { xs: '100%', md: '747px' } }}>
        <PuiBox
          sx={{
            background: {
              xs: 'transparent',
              md: 'transparent',
            },
            borderRadius: { xs: '16px', md: '24px' },
            padding: { xs: '16px', md: '24px' },
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '12px', md: '16px' },
            '& > *': {
              marginBottom: '0 !important',
            },
            // Dark theme support
            '[data-theme="dark"] &': {
              background: {
                xs: 'transparent',
                md: 'transparent',
              },
            },
          }}
        >
          <PersonalData profileContact={profileContact} isLoading={isLoading} />
          <Address address={profileContact?.address ?? null} />
          <SocialMedia links={profileContact?.socialLinks ?? []} />
        </PuiBox>
      </PuiBox>
    </PuiBox>
  );
};
