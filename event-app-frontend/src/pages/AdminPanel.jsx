import { useEffect, useState } from "react";
import API from "../api/api";
import EventCard from "../components/EventCard";
import Modal from "../components/Modal";
import { useToast } from "../context/ToastContext";

// Helper to create multipart with JSON part named 'data' (backend expects @RequestPart("data"))
const buildMultipart = (json, file) => {
  const fd = new FormData();
  const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
  fd.append("data", blob);
  if (file) fd.append("image", file);
  return fd;
};

export default function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    totalTickets: 1,
  });
  const [image, setImage] = useState(null);

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

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      const dto = { ...form, totalTickets: Number(form.totalTickets) };
      const fd = buildMultipart(dto, image);
      await API.post("/events", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Event created", "success");
      setForm({ title: "", description: "", eventDate: "", totalTickets: 1 });
      setImage(null);
      await load();
    } catch (err) {
      showToast(err.userMessage || "Create failed", "error");
    }
  };

  const [deleteId, setDeleteId] = useState(null);
  const remove = async (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await API.delete("/events/" + deleteId);
      showToast("Event deleted", "success");
      setDeleteId(null);
      await load();
    } catch (err) {
      showToast(err.userMessage || "Delete failed", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <form onSubmit={createEvent} className="card mb-6 space-y-3">
        <div>
          <div className="label">Title</div>
          <input
            className="input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <div className="label">Description</div>
          <textarea
            className="input"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <div className="label">Event Date</div>
          <input
            type="datetime-local"
            className="input"
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
          />
        </div>
        <div>
          <div className="label">Total Tickets</div>
          <input
            type="number"
            min="1"
            className="input"
            value={form.totalTickets}
            onChange={(e) => setForm({ ...form, totalTickets: e.target.value })}
          />
        </div>
        <div>
          <div className="label">Image</div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Create Event
        </button>
      </form>

      {loading && <div>Loading events...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div key={ev.id} className="relative">
              <button
                className="absolute top-2 right-2 btn btn-danger"
                onClick={() => remove(ev.id)}
              >
                Delete
              </button>
              <EventCard ev={ev} isAdmin />
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!deleteId}
        title="Delete event"
        onClose={() => setDeleteId(null)}
        actions={
          <>
            <button className="btn" onClick={() => setDeleteId(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={confirmDelete}>
              Delete
            </button>
          </>
        }
      >
        Are you sure you want to delete this event? This action cannot be
        undone.
      </Modal>
    </div>
  );
}
