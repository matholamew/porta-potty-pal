import styled from 'styled-components';

export const Button = styled.button`
  min-height: 44px; // Apple's minimum touch target
  padding: ${props => `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  border-radius: 22px; // Apple's pill-shaped button
  border: none;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text.onPrimary};
  font-size: ${props => props.theme.typography.body.fontSize};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled(Button)`
  background: ${props => props.theme.colors.gray[200]};
  color: ${props => props.theme.colors.text.primary};
`; 