import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  @media (max-width: 768px) {
    align-items: flex-end;
  }
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  width: 90%;
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: ${props => props.theme.shadows.large};
  margin: 20px;
  border-radius: ${props => props.theme.borderRadius.lg};

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    margin: 0;
    max-height: 90vh;
    border-radius: ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg} 0 0;
  }
`;

const Grabber = styled.div`
  width: 36px;
  height: 5px;
  background: ${props => props.theme.colors.gray[300]};
  border-radius: 2.5px;
  margin: 8px auto;
`;

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()} isOpen={isOpen}>
        <Grabber />
        {children}
      </ModalContainer>
    </Overlay>
  );
};

export default Modal; 