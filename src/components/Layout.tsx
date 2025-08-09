import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mui/material';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/create':
        return 'Form Builder';
      case '/preview':
        return 'Form Preview';
      case '/myforms':
        return 'My Forms';
      default:
        return 'Form Builder';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {getPageTitle()}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => handleNavigation('/create')}
              sx={{ 
                backgroundColor: location.pathname === '/create' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
              }}
            >
              Create Form
            </Button>
            <Button
              color="inherit"
              onClick={() => handleNavigation('/preview')}
              sx={{ 
                backgroundColor: location.pathname === '/preview' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
              }}
            >
              Preview
            </Button>
            <Button
              color="inherit"
              onClick={() => handleNavigation('/myforms')}
              sx={{ 
                backgroundColor: location.pathname === '/myforms' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
              }}
            >
              My Forms
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;