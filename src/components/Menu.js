import React from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.xxl};
  right: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.menu.background};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.body.fontSize};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.menu.hover};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.divider};
  }
`;

const MenuButton = styled.button`
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text.primary};
  border: 1px solid ${props => props.theme.colors.divider};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.menu.hover};
  }
`;

const Menu = ({ onUpdateLocation, onToggleTheme, isDarkMode }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <MenuButton onClick={() => setIsOpen(!isOpen)}>
        <span>☰</span>
        <span>Menu</span>
      </MenuButton>

      {isOpen && (
        <MenuContainer>
          <MenuItem onClick={() => {
            onUpdateLocation();
            setIsOpen(false);
          }}>
            <span>🔄</span>
            <span>Update Location</span>
          </MenuItem>
          <MenuItem onClick={() => {
            onToggleTheme();
            setIsOpen(false);
          }}>
            <span>{isDarkMode ? '☀️' : '🌙'}</span>
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </MenuItem>
        </MenuContainer>
      )}
    </div>
  );
};

export default Menu; 