import { create } from "zustand";
import { Ticket, Passenger, Booking } from "@/types";
import { generateBookingRef, generateId } from "@/utils/helpers";
import { createDemoBookings } from "@/data/demo-bookings";

const STORAGE_KEY = "tripix-bookings";
const SEED_VERSION_KEY = "tripix-bookings-seed";
const SEED_VERSION = "v2";

interface BookingStore {
  selectedTicket: Ticket | null;
  step: number;
  passengers: Passenger[];
  bookings: Booking[];
  currentBooking: Booking | null;

  selectTicket: (ticket: Ticket) => void;
  setStep: (step: number) => void;
  setPassengers: (passengers: Passenger[]) => void;
  confirmBooking: () => void;
  loadBookings: () => void;
  clearCurrentBooking: () => void;
  reset: () => void;
}

function persist(bookings: Booking[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch {}
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  selectedTicket: null,
  step: 0,
  passengers: [],
  bookings: [],
  currentBooking: null,

  selectTicket: (ticket) => set({ selectedTicket: ticket, step: 0 }),

  setStep: (step) => set({ step }),

  setPassengers: (passengers) => set({ passengers }),

  confirmBooking: () => {
    const { selectedTicket, passengers, bookings } = get();
    if (!selectedTicket) return;

    const booking: Booking = {
      id: generateId(),
      bookingRef: generateBookingRef(),
      ticket: selectedTicket,
      passengers,
      status: "confirmed",
      bookedAt: new Date().toISOString(),
      totalPrice: selectedTicket.price * passengers.length,
    };

    const updated = [booking, ...bookings];
    set({
      currentBooking: booking,
      bookings: updated,
      step: 3,
    });
    persist(updated);
  },

  loadBookings: () => {
    try {
      const seedVer = localStorage.getItem(SEED_VERSION_KEY);
      const raw = localStorage.getItem(STORAGE_KEY);
      let existing: Booking[] = [];

      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) existing = parsed;
      }

      if (seedVer !== SEED_VERSION) {
        const demos = createDemoBookings();
        const demoIds = new Set(demos.map((b) => b.id));
        const userOnly = existing.filter((b) => !demoIds.has(b.id) && !String(b.id).startsWith("demo_"));
        const merged = [...userOnly, ...demos];
        localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
        persist(merged);
        set({ bookings: merged });
        return;
      }

      if (existing.length === 0) {
        const demos = createDemoBookings();
        persist(demos);
        set({ bookings: demos });
        return;
      }

      set({ bookings: existing });
    } catch {
      const demos = createDemoBookings();
      set({ bookings: demos });
    }
  },

  clearCurrentBooking: () =>
    set({ currentBooking: null, selectedTicket: null, step: 0, passengers: [] }),

  reset: () =>
    set({ selectedTicket: null, step: 0, passengers: [], currentBooking: null }),
}));
