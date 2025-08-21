import { useEffect, useState } from 'react';
import API from '../api/api';
import { fmtDateTime } from '../utils/format';

export default function Bookings() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true); setError('');
    try {
      // Requires backend endpoint: GET /api/bookings (for current user)
      const res = await API.get('/bookings');
      setItems(res.data);
    } catch (err) {
      setError(err.userMessage || 'Implement GET /api/bookings endpoint in backend to show bookings.');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className='max-w-6xl mx-auto p-6'>Loading...</div>;
  if (error) return <div className='max-w-6xl mx-auto p-6 text-red-600'>{error}</div>;

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-4'>My Bookings</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {items.map((b) => (
          <div key={b.id} className='card'>
            <div className='font-semibold'>{b.event.title}</div>
            <div className='text-sm text-gray-600'>{fmtDateTime(b.event.eventDate)}</div>
            <div className='mt-2'>Quantity: <b>{b.quantity}</b></div>
          </div>
        ))}
      </div>
    </div>
  );
}