import React, { useState } from 'react';
import styled from 'styled-components';
import RatingDisplay from './RatingDisplay';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 10px;
  font-size: 17px;
  line-height: 1.4;
  min-height: 100px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text.primary};
  -webkit-appearance: none;
  resize: none;
  box-sizing: border-box;

  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const Button = styled.button`
  flex: 1;
  min-height: 44px;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  background: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.background};
  color: ${props => props.primary ? 'white' : props.theme.colors.text.primary};
  border: ${props => props.primary ? 'none' : `1px solid ${props.theme.colors.gray[300]}`};

  &:active {
    opacity: 0.9;
  }
`;

const AddReview = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
  };

  return (
    <Container>
      <RatingDisplay 
        rating={rating}
        interactive={true}
        onRatingSelect={setRating}
      />
      <TextArea
        placeholder="Add your comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <ButtonGroup>
        <Button type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" primary onClick={handleSubmit}>Submit</Button>
      </ButtonGroup>
    </Container>
  );
};

export default AddReview; 