import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatDate } from '../../utils/formatDate';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadFeedbacks();
  }, [filterStatus]);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllFeedbacks(filterStatus || null);
      setFeedbacks(data);
      setError('');
    } catch (err) {
      setError('Failed to load feedbacks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await adminService.markFeedbackAsRead(id);
      loadFeedbacks();
      setError('');
    } catch (err) {
      setError('Failed to mark feedback as read');
      console.error(err);
    }
  };

  if (loading && feedbacks.length === 0) {
    return (
      <AdminLayout>
        <Loading />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 style={{ marginBottom: '20px' }}>Feedback Management</h1>

        <ErrorMessage message={error} onClose={() => setError('')} />

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ fontWeight: '500' }}>Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="READ">Read</option>
          </select>
        </div>

        {feedbacks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px' }}>
            <p>No feedbacks found</p>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Patient</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Rating</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Comment</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((feedback) => (
                  <tr key={feedback.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>{feedback.patientName}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>{'⭐'.repeat(feedback.rating)}</span>
                        <span style={{ fontSize: '14px', color: '#666' }}>({feedback.rating}/5)</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', maxWidth: '300px' }}>
                      {feedback.comment || '-'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: feedback.status === 'READ' ? '#d4edda' : '#fff3cd',
                        color: feedback.status === 'READ' ? '#155724' : '#856404',
                        fontSize: '12px',
                      }}>
                        {feedback.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{formatDate(feedback.createdAt)}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {feedback.status === 'PENDING' && (
                        <button
                          onClick={() => handleMarkAsRead(feedback.id)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          Mark as Read
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FeedbackList;

