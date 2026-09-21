import React, { useState } from 'react';

export default function CreateTicketModal({ isOpen, onClose, userId, onTicketCreated }) {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'MEDIUM'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.subject.trim() || !formData.description.trim()) {
      setError('Please provide both a subject and details for your query.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/tickets/create/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error(`Failed to create ticket (Server returned ${res.status})`);
      }

      setFormData({ subject: '', description: '', priority: 'MEDIUM' });
      onTicketCreated();
      onClose();
    } catch (err) {
      setError(err.message || 'Unable to submit ticket. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title fw-bold">Raise New Support Ticket</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && (
                <div className="alert alert-danger py-2 small mb-3">{error}</div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase text-muted">Subject / Query Type</label>
                <input
                  type="text"
                  name="subject"
                  className="form-control"
                  placeholder="e.g. Spare battery delivery delay / Inquiry on repair estimate"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase text-muted">Priority Level</label>
                <select
                  name="priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase text-muted">Detailed Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  placeholder="Explain your problem or inquiry in detail..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>

            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-dark btn-sm px-3">
                {loading ? 'Submitting...' : 'Submit Support Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}