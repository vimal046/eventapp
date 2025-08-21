import { fmtDateTime } from '../utils/format';

export default function EventCard({ ev, onBook, isAdmin }) {
  return (
    <div className="card flex flex-col">
      {ev.imageUrl && (
        <img src={(import.meta.env.VITE_PUBLIC_BASE || 'http://localhost:8080') + ev.imageUrl} alt={ev.title} className="h-44 w-full object-cover rounded-xl mb-3" />
      )}
      <h3 className="text-lg font-semibold">{ev.title}</h3>
      <p className="text-gray-600 line-clamp-3">{ev.description}</p>
      <div className="text-sm text-gray-500 mt-1">{fmtDateTime(ev.eventDate)}</div>
      <div className="mt-2 text-sm">Available: <b>{ev.availableTickets}</b> / {ev.totalTickets}</div>
      <div className="mt-3 flex gap-2">
        {!isAdmin && onBook && (
          <button disabled={ev.availableTickets <= 0} className="btn btn-primary disabled:opacity-50" onClick={() => onBook(ev)}>
            {ev.availableTickets > 0 ? 'Book' : 'Sold Out'}
          </button>
        )}
      </div>
    </div>
  );
}