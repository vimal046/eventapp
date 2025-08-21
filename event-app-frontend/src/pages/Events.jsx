import { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import Modal from "../components/Modal";
import { useToast } from "../context/ToastContext";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { showToast } = useToast();

  const [bookEvent, setBookEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      setError(err.userMessage || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onBook = (ev) => {
    setBookEvent(ev);
    setQuantity(1);
  };

  const confirmBook = async () => {
    if (!bookEvent) return;
    const qtyNum = Number(quantity);
    if (!Number.isInteger(qtyNum) || qtyNum <= 0) {
      showToast("Invalid quantity", "error");
      return;
    }
    try {
      await API.post(`/bookings/events/${bookEvent.id}?quantity=${qtyNum}`);
      showToast("Booking successful", "success");
      setBookEvent(null);
      await load();
    } catch (err) {
      showToast(err.userMessage || "Booking failed", "error");
    }
  };

  if (loading)
    return <div className="max-w-6xl mx-auto p-6">Loading events...</div>;
  if (error)
    return <div className="max-w-6xl mx-auto p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((ev) => (
        <EventCard
          key={ev.id}
          ev={ev}
          onBook={user?.role === "USER" ? onBook : null}
        />
      ))}

      <Modal
        open={!!bookEvent}
        title={bookEvent ? `Book tickets for ${bookEvent.title}` : ""}
        onClose={() => setBookEvent(null)}
        actions={
          <>
            <button className="btn" onClick={() => setBookEvent(null)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={confirmBook}>
              Confirm
            </button>
          </>
        }
      >
        <div className="space-y-2">
          <div className="label">Quantity</div>
          <input
            type="number"
            min="1"
            className="input"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
