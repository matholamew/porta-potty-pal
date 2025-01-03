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
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  @media (max-width: 768px) {
    align-items: flex-end;
  }
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  width: 100%;
  max-width: 540px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  margin: 16px;
  border-radius: 16px;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    margin: 0;
    max-height: 90vh;
    border-radius: 16px 16px 0 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Grabber = styled.div`
  width: 36px;
  height: 5px;
  background: ${props => props.theme.colors.gray[300]};
  border-radius: 2.5px;
  margin: 8px auto;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Modal = ({ isOpen, onClose, children }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    if (!isOpen) return;
    
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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