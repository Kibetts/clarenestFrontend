import { useState } from 'react';
import { Star } from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const TestimonialForm = ({ onSubmitSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit testimonial');
      }

      onSubmitSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="abt-page-testimonial-form">
      <div className="abt-page-testimonial-form-header">
        <h3 className="text-xl font-bold mb-4">Share Your Experience</h3>
        <button onClick={onClose} className="close-button">&times;</button>
      </div>
      
      {error && (
        <div className="error-message mb-4 text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full p-2 border rounded"
            placeholder="Title of your review"
          />
        </div>

        {/* Updated star rating section */}
        <div className="star-rating-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              className="star-rating-button focus:outline-none"
            >
              <Star
                className={`${
                  star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>

        <div>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            rows={4}
            className="w-full p-2 border rounded"
            placeholder="Share your experience with us"
          />
        </div>

        {/* Updated submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`abt-page-learning-button w-full ${isSubmitting ? 'loading' : ''}`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default TestimonialForm;