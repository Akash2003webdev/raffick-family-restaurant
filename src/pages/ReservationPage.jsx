import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import ConfirmOrderModal from "../components/ConfirmOrderModal";
import { submitReservation } from "../lib/api";
import { buildReservationMessage, sendWhatsAppMessage } from "../lib/whatsapp";

export default function ReservationPage({ onToast }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
    note: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);

  const canSubmit =
    form.name.trim() && form.phone.trim().length >= 10 && form.date && form.time && form.guests > 0;

  async function handleConfirm() {
    await submitReservation(form);
    const message = buildReservationMessage(form);
    sendWhatsAppMessage(message);
    setShowConfirm(false);
    onToast?.("Reservation request sent!");
    setForm({ name: "", phone: "", date: "", time: "", guests: 2, note: "" });
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-24 md:pb-16">
      <div className="relative rounded-3xl overflow-hidden h-36 md:h-52 bg-gradient-to-br from-primary-600 to-ink flex items-center justify-center mb-5 md:mb-8">
        <div className="text-center text-cream">
          <CalendarCheck size={30} className="mx-auto mb-1 text-gold-300" />
          <h1 className="font-display font-bold text-xl md:text-3xl">Reserve a Table</h1>
          <p className="text-xs md:text-sm text-gold-200 mt-1">We'll confirm your booking on WhatsApp</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowConfirm(true);
        }}
        className="bg-white rounded-2xl shadow-soft p-4 md:p-6 space-y-3 md:max-w-lg md:mx-auto"
      >
        <input
          type="text"
          placeholder="Your Name *"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400"
        />
        <input
          type="tel"
          placeholder="Phone Number *"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400"
          />
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Number of Guests</label>
          <input
            type="number"
            min={1}
            value={form.guests}
            onChange={(e) => setForm((f) => ({ ...f, guests: Number(e.target.value) }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400"
          />
        </div>
        <textarea
          placeholder="Special request (optional)"
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400 resize-none"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-3 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm disabled:opacity-40 transition-colors"
        >
          Reserve Table
        </button>
      </form>

      <ConfirmOrderModal
        open={showConfirm}
        title="Confirm Reservation"
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
      >
        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="font-semibold text-primary-700">Name:</span> {form.name}</p>
          <p><span className="font-semibold text-primary-700">Phone:</span> {form.phone}</p>
          <p><span className="font-semibold text-primary-700">Date:</span> {form.date}</p>
          <p><span className="font-semibold text-primary-700">Time:</span> {form.time}</p>
          <p><span className="font-semibold text-primary-700">Guests:</span> {form.guests}</p>
          {form.note && <p><span className="font-semibold text-primary-700">Note:</span> {form.note}</p>}
        </div>
      </ConfirmOrderModal>
    </div>
  );
}
