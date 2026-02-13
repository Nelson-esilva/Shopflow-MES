import React, { useState } from 'react';
import HorizontalMenu from './HorizontalMenu';
import VerticalMenu from './VerticalMenu';
import ContentBox from './ContextBox';
import Footer from './Footer';
import { useTheme, useMediaQuery } from '@mui/material';

const drawerWidth = 260;
const collapsedWidth = 64;
const footerHeight = 40;

const DesignerLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => setMenuOpen((prev) => !prev);
  const handleMobileDrawerToggle = () => setMobileOpen((prev) => !prev);

  const menuWidthForAppBar = isMobile ? 0 : menuOpen ? `${drawerWidth}px` : `${collapsedWidth}px`;
  const menuWidthForContent = isMobile ? 0 : menuOpen ? drawerWidth : collapsedWidth;

  return (
    <>
      <HorizontalMenu onHamburgerClick={isMobile ? handleMobileDrawerToggle : handleDrawerToggle} menuWidth={menuWidthForAppBar} />
      <VerticalMenu
        open={isMobile ? mobileOpen : menuOpen}
        onToggle={isMobile ? handleMobileDrawerToggle : handleDrawerToggle}
        mobileOpen={mobileOpen}
        onMobileToggle={handleMobileDrawerToggle}
      />
      <ContentBox fixed={true} menuWidth={menuWidthForContent} sx={{ height: `calc(100vh - 64px - ${footerHeight}px)` }}>
        {children}
      </ContentBox>
      <Footer menuWidth={menuWidthForContent} />
    </>
  );
};

export default DesignerLayout; 