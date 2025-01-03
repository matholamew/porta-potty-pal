import React from 'react';
import styled from 'styled-components';
import Modal from './Modal';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.surface};
  height: 100%;
  
  @media (max-width: 768px) {
    /* Full height on mobile */
    min-height: 100vh;
  }
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${props => props.theme.colors.surface};
  padding: 8px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  flex: 1;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
`;

const Text = styled.p`
  font-size: 15px;
  line-height: 1.4;
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
`;

const FeatureList = styled.ul`
  margin: 0;
  padding-left: 20px;
  
  li {
    font-size: 15px;
    line-height: 1.4;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text.primary};
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const NavButton = styled.button`
  border: none;
  background: none;
  color: ${props => props.theme.colors.primary};
  font-size: 17px;
  padding: 8px 12px;
  min-width: 44px;
  min-height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AboutModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Container>
        <Header>
          <NavButton onClick={onClose}>Close</NavButton>
          <Title>About In-a-Pinch</Title>
          <NavButton style={{ visibility: 'hidden' }}>Close</NavButton>
        </Header>

        <Content>
          <Section>
            <SectionTitle>Our Mission</SectionTitle>
            <Text>
              In-a-Pinch was created to help people find nearby restroom facilities quickly and easily. 
              We understand that when nature calls, you need reliable information fast.
            </Text>
          </Section>

          <Section>
            <SectionTitle>Features</SectionTitle>
            <FeatureList>
              <li>Find nearby portable toilets with real-time location tracking</li>
              <li>View ratings and reviews from other users</li>
              <li>Add new locations to help others in need</li>
              <li>Leave reviews and ratings to help the community</li>
              <li>Dark mode support for comfortable nighttime viewing</li>
              <li>Locations are removed after 3 months of inactivity</li>
              <li>Ability to remove locations that are no longer there</li>
              <li>Ability to report inappropriate comments</li>
            </FeatureList>
          </Section>

          <Section>
            <SectionTitle>Community Driven</SectionTitle>
            <Text>
              Our app relies on users like you to keep information accurate and up-to-date. 
              By contributing locations and reviews, you're helping others find relief when they need it most.
            </Text>
          </Section>
        </Content>
      </Container>
    </Modal>
  );
};

export default AboutModal; 