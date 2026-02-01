const ReplyForm = () => {
  return (
    <form className="reply-form">
      <div className="form-grid">
        {/* Text Field */}
        <div className="form-group">
          <div className="floating-input">
            <input
              type="text"
              id="name"
              className="form-input"
              required
              placeholder=" "
            />
            <label htmlFor="name" className="floating-label">
              Your Name
            </label>
            <div className="focus-border"></div>
          </div>
        </div>

        {/* Email Field */}
        <div className="form-group">
          <div className="floating-input">
            <input
              type="email"
              id="email"
              className="form-input"
              required
              placeholder=" "
            />
            <label htmlFor="email" className="floating-label">
              Email Address
            </label>
            <div className="focus-border"></div>
          </div>
        </div>

        {/* Comment Field */}
        <div className="form-group full-width">
          <div className="floating-input">
            <textarea
              id="comment"
              className="form-input"
              rows={4}
              required
              placeholder=" "
            />
            <label htmlFor="comment" className="floating-label">
              Write Your Comment
            </label>
            <div className="focus-border"></div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-submit">
          <button type="submit" className="submit-button">
            <span>Post Comment</span>
            <svg
              className="arrow-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReplyForm;
