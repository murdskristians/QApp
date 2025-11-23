import { useState, useEffect } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { ProfileMenu } from '../../components/layout/ProfileMenu';
import { PersonalInfo } from './PersonalInfo';
import { PasswordSecurity } from './PasswordSecurity';
import { AppearanceTheme } from './AppearanceTheme';
import { GeneralPreferences } from './GeneralPreferences';
import { ConnectedApps } from './ConnectedApps';
import { Notifications } from './Notifications';
import { ApiToken } from './ApiToken';
import { menuList } from '../../config';

import { MainPanel } from './StyledComponents';

interface MainPanelWrapperProps {
  profileContact: any;
  isLoading: boolean;
  onSignOut: () => void;
  onBackToChat?: () => void;
}

export const MainPanelWrapper: React.FC<MainPanelWrapperProps> = ({
  profileContact,
  isLoading,
  onSignOut,
  onBackToChat,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const defaultPath = menuList.find((item) => item.enabled)?.path ?? menuList[0].path;
  const [selectedPath, setSelectedPath] = useState<string>(defaultPath);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  const handlePathChange = (path: string) => {
    setSelectedPath(path);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const renderContent = () => {
    switch (selectedPath) {
      case '/personal-information':
        return <PersonalInfo profileContact={profileContact} isLoading={isLoading} />;
      case '/password-security':
        return <PasswordSecurity />;
      case '/appearance-theme':
        return <AppearanceTheme />;
      case '/general-preferences':
        return <GeneralPreferences />;
      case '/connected-apps':
        return <ConnectedApps />;
      case '/notifications':
        return <Notifications />;
      case '/api-token':
        return <ApiToken />;
      default:
        return <PersonalInfo profileContact={profileContact} isLoading={isLoading} />;
    }
  };

  const currentMenuItem = menuList.find(item => item.path === selectedPath);

  return (
    <MainPanel id="main-panel" data-testid="main-panel-wrapper">
      {isMobile && (
        <>
          <div className="profile-mobile-header">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="profile-menu-toggle-button"
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="profile-mobile-header-title">
              {currentMenuItem?.title || 'Menu'}
            </div>
            <div className="profile-mobile-header-spacer"></div>
          </div>
          {isMenuOpen && (
            <div
              onClick={() => setIsMenuOpen(false)}
              className="profile-menu-overlay"
            />
          )}
        </>
      )}
      <ProfileMenu
        onSignOut={onSignOut}
        selectedPath={selectedPath}
        onPathChange={handlePathChange}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
      {renderContent()}
    </MainPanel>
  );
};
