import React, { useState } from 'react';
import styled from 'styled-components';
import RatingDisplay from './RatingDisplay';

const Form = styled.form`
  margin-top: ${props => props.theme.spacing.md};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.body.fontSize};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.body.fontSize};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.body.fontSize};
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: ${props => props.theme.colors.gray[400]};
    cursor: not-allowed;
  }
`;

const AddReview = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({ rating: Number(rating), comment });
      setRating(3);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <RatingDisplay 
        rating={rating} 
        interactive={true}
        onRatingSelect={setRating}
      />
      
      <TextArea
        placeholder="Write your review here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      
      <Button type="submit" disabled={isSubmitting || !comment.trim()}>
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
      
      <Button 
        type="button" 
        onClick={onCancel}
        style={{ 
          background: 'transparent',
          color: 'inherit',
          marginTop: '8px'
        }}
      >
        Cancel
      </Button>
    </Form>
  );
};

export default AddReview; 