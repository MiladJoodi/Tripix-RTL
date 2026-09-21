import { Booking, Ticket } from "@/types";
import { cities } from "./cities";
import { busProviders, trainProviders, flightProviders } from "./providers";

function city(id: string) {
  return cities.find((c) => c.id === id)!;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function makeTicket(partial: Omit<Ticket, "currency" | "amenities" | "seatsAvailable" | "stops"> & {
  amenities?: string[];
  seatsAvailable?: number;
  stops?: Ticket["stops"];
}): Ticket {
  return {
    currency: "تومان",
    amenities: partial.amenities ?? ["وای‌فای"],
    seatsAvailable: partial.seatsAvailable ?? 12,
    stops: partial.stops ?? [],
    ...partial,
  };
}

const samplePassenger = {
  firstName: "میلاد",
  lastName: "جودی",
  email: "milad@tripix.ir",
  phone: "09121234567",
  dateOfBirth: "1995-05-12",
  idNumber: "0012345678",
};

/** Demo bookings for empty / first-load state */
export function createDemoBookings(): Booking[] {
  const tickets: { ticket: Ticket; status: Booking["status"]; bookedAt: string; ref: string; id: string }[] = [
    {
      id: "demo_bk_01",
      ref: "TPX-A1B2C3",
      status: "confirmed",
      bookedAt: daysAgo(1),
      ticket: makeTicket({
        id: "demo_tkt_01",
        type: "bus",
        provider: busProviders[0],
        origin: city("thr"),
        destination: city("ifn"),
        departureTime: "08:30",
        arrivalTime: "13:45",
        duration: 315,
        price: 280000,
        class: "VIP",
        amenities: ["وای‌فای", "صندلی تخت‌شو", "پذیرایی"],
      }),
    },
    {
      id: "demo_bk_02",
      ref: "TPX-D4E5F6",
      status: "confirmed",
      bookedAt: daysAgo(2),
      ticket: makeTicket({
        id: "demo_tkt_02",
        type: "flight",
        provider: flightProviders[1],
        origin: city("thr"),
        destination: city("kih"),
        departureTime: "10:15",
        arrivalTime: "12:00",
        duration: 105,
        price: 1450000,
        class: "اکونومی",
        baggage: { cabin: "۵ کیلو", checked: "۲۰ کیلو" },
      }),
    },
    {
      id: "demo_bk_03",
      ref: "TPX-G7H8I9",
      status: "pending",
      bookedAt: daysAgo(0),
      ticket: makeTicket({
        id: "demo_tkt_03",
        type: "train",
        provider: trainProviders[0],
        origin: city("thr"),
        destination: city("mhd"),
        departureTime: "22:00",
        arrivalTime: "08:30",
        duration: 630,
        price: 420000,
        class: "۴ تخته",
        amenities: ["وای‌فای", "پذیرایی", "بالشت و پتو"],
      }),
    },
    {
      id: "demo_bk_04",
      ref: "TPX-J1K2L3",
      status: "pending",
      bookedAt: daysAgo(0),
      ticket: makeTicket({
        id: "demo_tkt_04",
        type: "bus",
        provider: busProviders[2],
        origin: city("ifn"),
        destination: city("syz"),
        departureTime: "14:00",
        arrivalTime: "18:20",
        duration: 260,
        price: 210000,
        class: "معمولی",
      }),
    },
    {
      id: "demo_bk_05",
      ref: "TPX-M4N5O6",
      status: "completed",
      bookedAt: daysAgo(18),
      ticket: makeTicket({
        id: "demo_tkt_05",
        type: "train",
        provider: trainProviders[1],
        origin: city("thr"),
        destination: city("tbz"),
        departureTime: "07:00",
        arrivalTime: "15:30",
        duration: 510,
        price: 380000,
        class: "۵ ستاره",
      }),
    },
    {
      id: "demo_bk_06",
      ref: "TPX-P7Q8R9",
      status: "completed",
      bookedAt: daysAgo(35),
      ticket: makeTicket({
        id: "demo_tkt_06",
        type: "flight",
        provider: flightProviders[0],
        origin: city("mhd"),
        destination: city("thr"),
        departureTime: "16:40",
        arrivalTime: "18:10",
        duration: 90,
        price: 980000,
        class: "اکونومی",
        baggage: { cabin: "۵ کیلو", checked: "۲۰ کیلو" },
      }),
    },
    {
      id: "demo_bk_07",
      ref: "TPX-S1T2U3",
      status: "cancelled",
      bookedAt: daysAgo(7),
      ticket: makeTicket({
        id: "demo_tkt_07",
        type: "bus",
        provider: busProviders[4],
        origin: city("thr"),
        destination: city("ras"),
        departureTime: "09:00",
        arrivalTime: "14:30",
        duration: 330,
        price: 195000,
        class: "VIP",
      }),
    },
    {
      id: "demo_bk_08",
      ref: "TPX-V4W5X6",
      status: "cancelled",
      bookedAt: daysAgo(12),
      ticket: makeTicket({
        id: "demo_tkt_08",
        type: "flight",
        provider: flightProviders[2],
        origin: city("thr"),
        destination: city("syz"),
        departureTime: "11:20",
        arrivalTime: "12:50",
        duration: 90,
        price: 1100000,
        class: "اکونومی",
      }),
    },
    {
      id: "demo_bk_09",
      ref: "TPX-Y7Z8A9",
      status: "confirmed",
      bookedAt: daysAgo(3),
      ticket: makeTicket({
        id: "demo_tkt_09",
        type: "train",
        provider: trainProviders[2],
        origin: city("ifn"),
        destination: city("thr"),
        departureTime: "18:45",
        arrivalTime: "23:15",
        duration: 270,
        price: 350000,
        class: "۴ تخته",
      }),
    },
  ];

  return tickets.map(({ ticket, status, bookedAt, ref, id }) => ({
    id,
    bookingRef: ref,
    ticket,
    passengers: [{ ...samplePassenger }],
    status,
    bookedAt,
    totalPrice: ticket.price,
  }));
}
