import { Ticket, TransportType, City, Provider } from "@/types";
import { cities } from "./cities";
import { busProviders, trainProviders, flightProviders } from "./providers";

let idCounter = 0;
function stableId(): string {
  return `tkt_${(++idCounter).toString(36).padStart(6, "0")}`;
}

function getCity(id: string): City {
  return cities.find((c) => c.id === id)!;
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Factory helpers
// ---------------------------------------------------------------------------

function makeBus(
  from: string, to: string, provider: Provider, dep: string,
  duration: number, price: number, cls: string, amenities: string[],
  seats: number, stopCities: string[] = []
): Ticket {
  const stops = stopCities.map((cid, i) => {
    const arrMin = Math.round((duration / (stopCities.length + 1)) * (i + 1));
    return { city: getCity(cid), arrivalTime: addMinutes(dep, arrMin - 10), departureTime: addMinutes(dep, arrMin), duration: 10 };
  });
  return { id: stableId(), type: "bus", provider, origin: getCity(from), destination: getCity(to), departureTime: dep, arrivalTime: addMinutes(dep, duration), duration, price, currency: "تومان", stops, class: cls, amenities, seatsAvailable: seats };
}

function makeTrain(
  from: string, to: string, provider: Provider, dep: string,
  duration: number, price: number, cls: string, amenities: string[],
  seats: number, stopCities: string[] = []
): Ticket {
  const stops = stopCities.map((cid, i) => {
    const arrMin = Math.round((duration / (stopCities.length + 1)) * (i + 1));
    return { city: getCity(cid), arrivalTime: addMinutes(dep, arrMin - 5), departureTime: addMinutes(dep, arrMin), duration: 5 };
  });
  return { id: stableId(), type: "train", provider, origin: getCity(from), destination: getCity(to), departureTime: dep, arrivalTime: addMinutes(dep, duration), duration, price, currency: "تومان", stops, class: cls, amenities, seatsAvailable: seats };
}

function makeFlight(
  from: string, to: string, provider: Provider, dep: string,
  duration: number, price: number, cls: string, amenities: string[],
  seats: number, baggage: { cabin: string; checked: string },
  stopCities: string[] = []
): Ticket {
  const stops = stopCities.map((cid, i) => {
    const arrMin = Math.round((duration / (stopCities.length + 1)) * (i + 1));
    return { city: getCity(cid), arrivalTime: addMinutes(dep, arrMin - 45), departureTime: addMinutes(dep, arrMin), duration: 45 };
  });
  return { id: stableId(), type: "flight", provider, origin: getCity(from), destination: getCity(to), departureTime: dep, arrivalTime: addMinutes(dep, duration), duration, price, currency: "تومان", stops, class: cls, amenities, seatsAvailable: seats, baggage };
}

// Shortcuts
const bp = busProviders;
const tp = trainProviders;
const fp = flightProviders;

// Bus amenity sets
const busStd: string[] = ["وای‌فای", "پریز برق", "سرویس بهداشتی"];
const busVip: string[] = ["وای‌فای", "پریز برق", "صندلی تخت‌شو", "سرویس بهداشتی", "تهویه مطبوع", "پذیرایی", "تلویزیون"];
const busComfort: string[] = ["وای‌فای", "پریز برق", "سرویس بهداشتی", "تهویه مطبوع", "پذیرایی"];

// Train amenity sets
const trainStd: string[] = ["وای‌فای", "پریز برق", "سرویس بهداشتی", "تهویه مطبوع"];
const trainLux: string[] = ["وای‌فای", "پریز برق", "سرویس بهداشتی", "تهویه مطبوع", "پذیرایی", "تلویزیون", "بالشت و پتو"];
const trainSleeper: string[] = ["وای‌فای", "پریز برق", "سرویس بهداشتی", "تهویه مطبوع", "پذیرایی", "بالشت و پتو", "تختخواب‌دار"];

// Flight amenity sets
const flightEcon: string[] = ["پذیرایی", "سرگرمی"];
const flightBiz: string[] = ["وای‌فای", "پذیرایی", "سرگرمی", "صندلی تخت‌شو", "فضای بار"];
const flightFirst: string[] = ["وای‌فای", "پذیرایی", "سرگرمی", "صندلی تخت‌شو", "فضای بار", "تلویزیون", "بالشت و پتو"];

// Baggage presets
const bagEcon = { cabin: "۷ کیلوگرم", checked: "۲۰ کیلوگرم" };
const bagBiz = { cabin: "۷ کیلوگرم", checked: "۲۳ کیلوگرم" };
const bagFirst = { cabin: "۷ کیلوگرم", checked: "۲۳ کیلوگرم" };

// ---------------------------------------------------------------------------
// 120+ tickets across many routes
// ---------------------------------------------------------------------------
export const allTickets: Ticket[] = [
  // ========== BUS ==========
  // تهران → مشهد (~720 min)
  makeBus("thr","mhd",bp[0],"06:00",720,1200000,"VIP",busVip,18),
  makeBus("thr","mhd",bp[1],"08:30",750,900000,"عادی",busStd,32),
  makeBus("thr","mhd",bp[4],"14:00",700,1500000,"VIP",busVip,12),
  makeBus("thr","mhd",bp[2],"20:00",740,850000,"عادی",busStd,28,["sry"]),
  makeBus("thr","mhd",bp[3],"22:00",710,1100000,"VIP",busComfort,15),
  // مشهد → تهران
  makeBus("mhd","thr",bp[0],"07:00",720,1200000,"VIP",busVip,20),
  makeBus("mhd","thr",bp[1],"10:00",750,900000,"عادی",busStd,30),
  makeBus("mhd","thr",bp[4],"21:00",710,1400000,"VIP",busVip,14),
  // تهران → اصفهان (~360 min)
  makeBus("thr","ifn",bp[0],"06:00",360,800000,"VIP",busVip,20),
  makeBus("thr","ifn",bp[1],"08:00",380,600000,"عادی",busStd,35),
  makeBus("thr","ifn",bp[2],"10:30",370,550000,"عادی",busStd,28,["qom"]),
  makeBus("thr","ifn",bp[4],"14:00",350,950000,"VIP",busVip,10),
  makeBus("thr","ifn",bp[3],"18:00",390,500000,"عادی",busComfort,22),
  // اصفهان → تهران
  makeBus("ifn","thr",bp[0],"07:00",360,800000,"VIP",busVip,18),
  makeBus("ifn","thr",bp[1],"11:00",380,600000,"عادی",busStd,30),
  makeBus("ifn","thr",bp[2],"16:00",370,550000,"عادی",busStd,25),
  // تهران → شیراز (~780 min)
  makeBus("thr","syz",bp[0],"08:00",780,1400000,"VIP",busVip,16),
  makeBus("thr","syz",bp[1],"14:00",800,1000000,"عادی",busStd,26,["ifn"]),
  makeBus("thr","syz",bp[4],"20:00",760,1800000,"VIP",busVip,8),
  makeBus("thr","syz",bp[3],"22:00",790,950000,"عادی",busComfort,20),
  // شیراز → تهران
  makeBus("syz","thr",bp[0],"07:00",780,1400000,"VIP",busVip,14),
  makeBus("syz","thr",bp[1],"15:00",800,1000000,"عادی",busStd,24),
  makeBus("syz","thr",bp[4],"21:00",770,1700000,"VIP",busVip,10),
  // تهران → تبریز (~390 min)
  makeBus("thr","tbz",bp[0],"06:30",390,900000,"VIP",busVip,18),
  makeBus("thr","tbz",bp[2],"10:00",420,650000,"عادی",busStd,30),
  makeBus("thr","tbz",bp[4],"16:00",380,1100000,"VIP",busVip,12),
  makeBus("thr","tbz",bp[3],"22:00",400,600000,"عادی",busComfort,25),
  // تبریز → تهران
  makeBus("tbz","thr",bp[0],"07:00",390,900000,"VIP",busVip,16),
  makeBus("tbz","thr",bp[2],"13:00",420,650000,"عادی",busStd,28),
  makeBus("tbz","thr",bp[4],"20:00",380,1100000,"VIP",busVip,10),
  // تهران → اهواز (~600 min)
  makeBus("thr","awz",bp[0],"07:00",600,1100000,"VIP",busVip,14),
  makeBus("thr","awz",bp[1],"13:00",630,800000,"عادی",busStd,22),
  makeBus("thr","awz",bp[3],"21:00",590,1300000,"VIP",busVip,10),
  // اهواز → تهران
  makeBus("awz","thr",bp[0],"06:00",600,1100000,"VIP",busVip,16),
  makeBus("awz","thr",bp[1],"14:00",630,800000,"عادی",busStd,24),
  // اصفهان → شیراز (~360 min)
  makeBus("ifn","syz",bp[0],"07:00",360,700000,"VIP",busVip,20),
  makeBus("ifn","syz",bp[1],"12:00",380,500000,"عادی",busStd,30),
  makeBus("ifn","syz",bp[3],"18:00",370,650000,"VIP",busComfort,16),
  // شیراز → اصفهان
  makeBus("syz","ifn",bp[0],"08:00",360,700000,"VIP",busVip,18),
  makeBus("syz","ifn",bp[1],"14:00",380,500000,"عادی",busStd,28),
  // تهران → رشت (~270 min)
  makeBus("thr","ras",bp[2],"07:00",270,600000,"عادی",busStd,32),
  makeBus("thr","ras",bp[0],"12:00",260,800000,"VIP",busVip,15),
  // رشت → تهران
  makeBus("ras","thr",bp[2],"08:00",270,600000,"عادی",busStd,30),
  makeBus("ras","thr",bp[0],"15:00",260,800000,"VIP",busVip,14),
  // تهران → قم (~120 min)
  makeBus("thr","qom",bp[1],"07:00",120,500000,"VIP",busVip,25),
  makeBus("thr","qom",bp[3],"10:00",130,350000,"عادی",busStd,35),
  // قم → تهران
  makeBus("qom","thr",bp[1],"09:00",120,500000,"VIP",busVip,22),
  makeBus("qom","thr",bp[3],"14:00",130,350000,"عادی",busStd,30),
  // تهران → همدان (~300 min)
  makeBus("thr","hdm",bp[2],"06:00",300,650000,"عادی",busStd,28),
  makeBus("thr","hdm",bp[0],"14:00",280,850000,"VIP",busVip,16),
  // همدان → تهران
  makeBus("hdm","thr",bp[2],"07:00",300,650000,"عادی",busStd,26),
  // مشهد → کرمان (~700 min)
  makeBus("mhd","ker",bp[0],"08:00",700,1300000,"VIP",busVip,14),
  makeBus("mhd","ker",bp[1],"20:00",720,950000,"عادی",busStd,20),
  // تهران → یزد (~450 min)
  makeBus("thr","azd",bp[0],"08:00",450,900000,"VIP",busVip,16),
  makeBus("thr","azd",bp[2],"20:00",470,650000,"عادی",busStd,24),
  // اصفهان → یزد (~240 min)
  makeBus("ifn","azd",bp[1],"09:00",240,500000,"عادی",busStd,30),
  makeBus("ifn","azd",bp[0],"16:00",230,700000,"VIP",busVip,18),
  // شیراز → بندرعباس (~540 min)
  makeBus("syz","bnd",bp[0],"07:00",540,1000000,"VIP",busVip,14),
  makeBus("syz","bnd",bp[1],"19:00",560,750000,"عادی",busStd,22),
  // تهران → ساری (~300 min)
  makeBus("thr","sry",bp[2],"06:30",300,600000,"عادی",busStd,28),
  makeBus("thr","sry",bp[0],"14:00",280,800000,"VIP",busVip,16),

  // ========== TRAIN ==========
  // تهران → مشهد (~600 min)
  makeTrain("thr","mhd",tp[0],"07:00",600,1500000,"درجه یک",trainStd,45),
  makeTrain("thr","mhd",tp[1],"14:00",570,2200000,"VIP",trainLux,28),
  makeTrain("thr","mhd",tp[4],"18:00",540,3200000,"تختخواب‌دار",trainSleeper,16),
  makeTrain("thr","mhd",tp[2],"20:00",600,1800000,"درجه یک",trainLux,35),
  makeTrain("thr","mhd",tp[3],"22:00",580,2500000,"VIP",trainLux,20),
  // مشهد → تهران
  makeTrain("mhd","thr",tp[0],"06:00",600,1500000,"درجه یک",trainStd,42),
  makeTrain("mhd","thr",tp[1],"15:00",570,2200000,"VIP",trainLux,25),
  makeTrain("mhd","thr",tp[4],"20:00",540,3200000,"تختخواب‌دار",trainSleeper,14),
  // تهران → اصفهان (~420 min)
  makeTrain("thr","ifn",tp[0],"06:30",420,1200000,"درجه یک",trainStd,50,["qom"]),
  makeTrain("thr","ifn",tp[1],"10:00",400,1800000,"VIP",trainLux,30),
  makeTrain("thr","ifn",tp[2],"16:00",430,1000000,"درجه دو",trainStd,55),
  makeTrain("thr","ifn",tp[4],"22:00",420,2800000,"تختخواب‌دار",trainSleeper,14),
  // اصفهان → تهران
  makeTrain("ifn","thr",tp[0],"07:00",420,1200000,"درجه یک",trainStd,48),
  makeTrain("ifn","thr",tp[1],"14:00",400,1800000,"VIP",trainLux,28),
  // تهران → شیراز (~660 min)
  makeTrain("thr","syz",tp[0],"08:00",660,2000000,"درجه یک",trainStd,40,["ifn"]),
  makeTrain("thr","syz",tp[4],"16:00",630,3500000,"تختخواب‌دار",trainSleeper,12),
  makeTrain("thr","syz",tp[1],"20:00",640,2600000,"VIP",trainLux,22),
  // شیراز → تهران
  makeTrain("syz","thr",tp[0],"07:00",660,2000000,"درجه یک",trainStd,38),
  makeTrain("syz","thr",tp[4],"18:00",630,3500000,"تختخواب‌دار",trainSleeper,10),
  // تهران → تبریز (~600 min)
  makeTrain("thr","tbz",tp[0],"08:00",600,1600000,"درجه یک",trainStd,42),
  makeTrain("thr","tbz",tp[1],"18:00",570,2400000,"VIP",trainLux,24),
  makeTrain("thr","tbz",tp[4],"22:00",540,3400000,"تختخواب‌دار",trainSleeper,12),
  // تبریز → تهران
  makeTrain("tbz","thr",tp[0],"07:00",600,1600000,"درجه یک",trainStd,40),
  makeTrain("tbz","thr",tp[1],"16:00",570,2400000,"VIP",trainLux,22),
  // تهران → اهواز (~660 min)
  makeTrain("thr","awz",tp[0],"06:00",660,1800000,"درجه یک",trainStd,38),
  makeTrain("thr","awz",tp[2],"18:00",640,2600000,"VIP",trainLux,20),
  makeTrain("thr","awz",tp[4],"21:00",620,3600000,"تختخواب‌دار",trainSleeper,10),
  // اهواز → تهران
  makeTrain("awz","thr",tp[0],"07:00",660,1800000,"درجه یک",trainStd,36),
  makeTrain("awz","thr",tp[2],"19:00",640,2600000,"VIP",trainLux,18),
  // اصفهان → شیراز (~360 min)
  makeTrain("ifn","syz",tp[0],"08:00",360,1100000,"درجه یک",trainStd,45),
  makeTrain("ifn","syz",tp[1],"16:00",340,1700000,"VIP",trainLux,25),
  // شیراز → اصفهان
  makeTrain("syz","ifn",tp[0],"09:00",360,1100000,"درجه یک",trainStd,42),
  makeTrain("syz","ifn",tp[1],"17:00",340,1700000,"VIP",trainLux,22),
  // تهران → یزد (~480 min)
  makeTrain("thr","azd",tp[0],"08:00",480,1400000,"درجه یک",trainStd,40),
  makeTrain("thr","azd",tp[2],"20:00",460,2000000,"VIP",trainLux,22),
  // تهران → کرمان (~720 min)
  makeTrain("thr","ker",tp[0],"16:00",720,2200000,"درجه یک",trainStd,30),
  makeTrain("thr","ker",tp[4],"20:00",690,4000000,"تختخواب‌دار",trainSleeper,10),
  // مشهد → یزد (~600 min)
  makeTrain("mhd","azd",tp[0],"18:00",600,1800000,"درجه یک",trainStd,32),
  // تهران → ساری (~330 min)
  makeTrain("thr","sry",tp[0],"07:00",330,1000000,"درجه یک",trainStd,45),
  makeTrain("thr","sry",tp[2],"14:00",320,1400000,"VIP",trainLux,28),
  // تهران → همدان (~300 min)
  makeTrain("thr","hdm",tp[0],"08:00",300,800000,"درجه دو",trainStd,50),
  makeTrain("thr","hdm",tp[1],"16:00",280,1300000,"VIP",trainLux,25),

  // ========== FLIGHTS ==========
  // تهران → مشهد (~80 min)
  makeFlight("thr","mhd",fp[0],"06:00",80,3500000,"اکونومی",flightEcon,42,bagEcon),
  makeFlight("thr","mhd",fp[1],"08:30",80,4200000,"اکونومی",flightEcon,35,bagEcon),
  makeFlight("thr","mhd",fp[3],"10:00",85,3000000,"اکونومی",flightEcon,50,bagEcon),
  makeFlight("thr","mhd",fp[4],"12:00",80,3800000,"اکونومی",flightEcon,38,bagEcon),
  makeFlight("thr","mhd",fp[1],"15:00",80,8500000,"بیزینس",flightBiz,12,bagBiz),
  makeFlight("thr","mhd",fp[5],"18:00",85,2800000,"اکونومی",flightEcon,48,bagEcon),
  makeFlight("thr","mhd",fp[0],"21:00",80,3200000,"اکونومی",flightEcon,40,bagEcon),
  // مشهد → تهران
  makeFlight("mhd","thr",fp[0],"07:00",80,3500000,"اکونومی",flightEcon,40,bagEcon),
  makeFlight("mhd","thr",fp[1],"11:00",80,4200000,"اکونومی",flightEcon,32,bagEcon),
  makeFlight("mhd","thr",fp[3],"14:00",85,3000000,"اکونومی",flightEcon,45,bagEcon),
  makeFlight("mhd","thr",fp[4],"17:00",80,3800000,"اکونومی",flightEcon,36,bagEcon),
  makeFlight("mhd","thr",fp[1],"20:00",80,8500000,"بیزینس",flightBiz,10,bagBiz),
  // تهران → شیراز (~90 min)
  makeFlight("thr","syz",fp[0],"06:30",90,4000000,"اکونومی",flightEcon,38,bagEcon),
  makeFlight("thr","syz",fp[1],"09:00",90,4800000,"اکونومی",flightEcon,30,bagEcon),
  makeFlight("thr","syz",fp[4],"12:00",90,3600000,"اکونومی",flightEcon,44,bagEcon),
  makeFlight("thr","syz",fp[1],"16:00",90,9500000,"بیزینس",flightBiz,10,bagBiz),
  makeFlight("thr","syz",fp[3],"20:00",95,3200000,"اکونومی",flightEcon,46,bagEcon),
  // شیراز → تهران
  makeFlight("syz","thr",fp[0],"07:00",90,4000000,"اکونومی",flightEcon,36,bagEcon),
  makeFlight("syz","thr",fp[1],"12:00",90,4800000,"اکونومی",flightEcon,28,bagEcon),
  makeFlight("syz","thr",fp[4],"18:00",90,3600000,"اکونومی",flightEcon,42,bagEcon),
  // تهران → اصفهان (~60 min)
  makeFlight("thr","ifn",fp[0],"07:00",60,2500000,"اکونومی",flightEcon,40,bagEcon),
  makeFlight("thr","ifn",fp[3],"10:00",65,2200000,"اکونومی",flightEcon,48,bagEcon),
  makeFlight("thr","ifn",fp[5],"14:00",60,2000000,"اکونومی",flightEcon,50,bagEcon),
  makeFlight("thr","ifn",fp[1],"18:00",60,6500000,"بیزینس",flightBiz,10,bagBiz),
  // اصفهان → تهران
  makeFlight("ifn","thr",fp[0],"08:00",60,2500000,"اکونومی",flightEcon,38,bagEcon),
  makeFlight("ifn","thr",fp[3],"13:00",65,2200000,"اکونومی",flightEcon,44,bagEcon),
  makeFlight("ifn","thr",fp[5],"19:00",60,2000000,"اکونومی",flightEcon,46,bagEcon),
  // تهران → کیش (~120 min)
  makeFlight("thr","kih",fp[2],"06:00",120,5500000,"اکونومی",flightEcon,35,bagEcon),
  makeFlight("thr","kih",fp[0],"09:00",120,6200000,"اکونومی",flightEcon,28,bagEcon),
  makeFlight("thr","kih",fp[1],"12:00",120,7000000,"اکونومی",flightEcon,22,bagEcon),
  makeFlight("thr","kih",fp[2],"16:00",120,5000000,"اکونومی",flightEcon,40,bagEcon),
  makeFlight("thr","kih",fp[1],"20:00",120,12000000,"بیزینس",flightBiz,8,bagBiz),
  // کیش → تهران
  makeFlight("kih","thr",fp[2],"08:00",120,5500000,"اکونومی",flightEcon,32,bagEcon),
  makeFlight("kih","thr",fp[0],"14:00",120,6200000,"اکونومی",flightEcon,26,bagEcon),
  makeFlight("kih","thr",fp[1],"19:00",120,7000000,"اکونومی",flightEcon,20,bagEcon),
  // تهران → تبریز (~75 min)
  makeFlight("thr","tbz",fp[0],"07:00",75,3200000,"اکونومی",flightEcon,40,bagEcon),
  makeFlight("thr","tbz",fp[3],"11:00",80,2800000,"اکونومی",flightEcon,46,bagEcon),
  makeFlight("thr","tbz",fp[5],"16:00",75,2500000,"اکونومی",flightEcon,50,bagEcon),
  // تبریز → تهران
  makeFlight("tbz","thr",fp[0],"08:00",75,3200000,"اکونومی",flightEcon,38,bagEcon),
  makeFlight("tbz","thr",fp[3],"14:00",80,2800000,"اکونومی",flightEcon,44,bagEcon),
  // تهران → اهواز (~75 min)
  makeFlight("thr","awz",fp[0],"07:30",75,3000000,"اکونومی",flightEcon,42,bagEcon),
  makeFlight("thr","awz",fp[4],"12:00",80,3500000,"اکونومی",flightEcon,35,bagEcon),
  makeFlight("thr","awz",fp[1],"17:00",75,7500000,"بیزینس",flightBiz,10,bagBiz),
  // اهواز → تهران
  makeFlight("awz","thr",fp[0],"09:00",75,3000000,"اکونومی",flightEcon,40,bagEcon),
  makeFlight("awz","thr",fp[4],"15:00",80,3500000,"اکونومی",flightEcon,32,bagEcon),
  // تهران → بندرعباس (~120 min)
  makeFlight("thr","bnd",fp[0],"06:00",120,4500000,"اکونومی",flightEcon,36,bagEcon),
  makeFlight("thr","bnd",fp[1],"11:00",120,5200000,"اکونومی",flightEcon,28,bagEcon),
  makeFlight("thr","bnd",fp[4],"17:00",115,4000000,"اکونومی",flightEcon,42,bagEcon),
  // بندرعباس → تهران
  makeFlight("bnd","thr",fp[0],"08:00",120,4500000,"اکونومی",flightEcon,34,bagEcon),
  makeFlight("bnd","thr",fp[1],"14:00",120,5200000,"اکونومی",flightEcon,26,bagEcon),
  // تهران → کرمان (~90 min)
  makeFlight("thr","ker",fp[3],"07:00",90,3500000,"اکونومی",flightEcon,40,bagEcon),
  makeFlight("thr","ker",fp[0],"13:00",90,4000000,"اکونومی",flightEcon,32,bagEcon),
  // کرمان → تهران
  makeFlight("ker","thr",fp[3],"09:00",90,3500000,"اکونومی",flightEcon,38,bagEcon),
  makeFlight("ker","thr",fp[0],"16:00",90,4000000,"اکونومی",flightEcon,30,bagEcon),
  // مشهد → کرمان (~90 min)
  makeFlight("mhd","ker",fp[3],"08:00",90,3200000,"اکونومی",flightEcon,42,bagEcon),
  // اصفهان → کیش (~110 min)
  makeFlight("ifn","kih",fp[2],"09:00",110,5000000,"اکونومی",flightEcon,30,bagEcon),
  makeFlight("ifn","kih",fp[1],"15:00",110,5800000,"اکونومی",flightEcon,24,bagEcon),
  // کیش → اصفهان
  makeFlight("kih","ifn",fp[2],"12:00",110,5000000,"اکونومی",flightEcon,28,bagEcon),
  // شیراز → کیش (~60 min)
  makeFlight("syz","kih",fp[2],"10:00",60,3500000,"اکونومی",flightEcon,38,bagEcon),
  makeFlight("syz","kih",fp[0],"16:00",60,4000000,"اکونومی",flightEcon,32,bagEcon),
  // کیش → شیراز
  makeFlight("kih","syz",fp[2],"13:00",60,3500000,"اکونومی",flightEcon,36,bagEcon),
  // شیراز → مشهد (~120 min)
  makeFlight("syz","mhd",fp[1],"08:00",120,5500000,"اکونومی",flightEcon,30,bagEcon),
  makeFlight("syz","mhd",fp[0],"15:00",125,5000000,"اکونومی",flightEcon,36,bagEcon),
  // مشهد → شیراز
  makeFlight("mhd","syz",fp[1],"10:00",120,5500000,"اکونومی",flightEcon,28,bagEcon),
  // اصفهان → مشهد (~100 min)
  makeFlight("ifn","mhd",fp[0],"07:30",100,4500000,"اکونومی",flightEcon,35,bagEcon),
  makeFlight("ifn","mhd",fp[1],"14:00",100,5200000,"اکونومی",flightEcon,28,bagEcon),
  // مشهد → اصفهان
  makeFlight("mhd","ifn",fp[0],"09:00",100,4500000,"اکونومی",flightEcon,32,bagEcon),
  // تهران → یزد (~70 min)
  makeFlight("thr","azd",fp[3],"08:00",70,2800000,"اکونومی",flightEcon,44,bagEcon),
  makeFlight("thr","azd",fp[6],"14:00",75,2200000,"اکونومی",flightEcon,50,bagEcon),
  // یزد → تهران
  makeFlight("azd","thr",fp[3],"10:00",70,2800000,"اکونومی",flightEcon,42,bagEcon),
  // تبریز → مشهد (~120 min)
  makeFlight("tbz","mhd",fp[5],"08:00",120,4800000,"اکونومی",flightEcon,34,bagEcon),
  // مشهد → تبریز
  makeFlight("mhd","tbz",fp[5],"11:00",120,4800000,"اکونومی",flightEcon,30,bagEcon),
  // تهران → رشت (فرضی — بلیط هواپیما نادر ولی وجود دارد) (~50 min)
  makeFlight("thr","ras",fp[6],"09:00",50,2200000,"اکونومی",flightEcon,40,bagEcon),
  // تهران → مشهد فرست کلاس
  makeFlight("thr","mhd",fp[1],"10:00",80,15000000,"فرست کلاس",flightFirst,4,bagFirst),
  // تهران → شیراز فرست کلاس
  makeFlight("thr","syz",fp[0],"08:00",90,14000000,"فرست کلاس",flightFirst,4,bagFirst),
  // اهواز → مشهد (~120 min)
  makeFlight("awz","mhd",fp[0],"07:00",120,5000000,"اکونومی",flightEcon,30,bagEcon),
  // مشهد → اهواز
  makeFlight("mhd","awz",fp[0],"10:00",120,5000000,"اکونومی",flightEcon,28,bagEcon),
  // بندرعباس → کیش (~45 min)
  makeFlight("bnd","kih",fp[2],"10:00",45,2500000,"اکونومی",flightEcon,40,bagEcon),
  // کیش → بندرعباس
  makeFlight("kih","bnd",fp[2],"12:00",45,2500000,"اکونومی",flightEcon,38,bagEcon),
];

// ---------------------------------------------------------------------------
// SMART SEARCH — always returns results
// ---------------------------------------------------------------------------

export interface SearchResult {
  tickets: Ticket[];
  matchType: "exact" | "partial" | "suggested";
  message?: string;
}

export function searchTickets(
  originId: string,
  destinationId: string,
  type: TransportType
): SearchResult {
  // 1. Exact match
  const exact = allTickets.filter(
    (t) => t.type === type && t.origin.id === originId && t.destination.id === destinationId
  );
  if (exact.length > 0) {
    return { tickets: exact, matchType: "exact" };
  }

  // 2. Partial: same type, matching origin OR destination
  const partial = allTickets.filter(
    (t) => t.type === type && (t.origin.id === originId || t.destination.id === destinationId)
  );
  if (partial.length > 0) {
    return { tickets: partial, matchType: "partial", message: "نتیجه دقیقی برای این مسیر یافت نشد. نتایج مشابه نمایش داده شده‌اند." };
  }

  // 3. Same transport type — popular picks
  const typeLabel = type === "bus" ? "اتوبوس" : type === "train" ? "قطار" : "هواپیما";
  const sameType = allTickets.filter((t) => t.type === type);
  if (sameType.length > 0) {
    const shuffled = [...sameType].sort((a, b) => {
      const ha = (a.price * 7 + a.duration) % 100;
      const hb = (b.price * 7 + b.duration) % 100;
      return ha - hb;
    });
    return { tickets: shuffled.slice(0, 8), matchType: "suggested", message: `پیشنهاد ما برای سفر با ${typeLabel} — محبوب‌ترین مسیرها` };
  }

  // 4. Ultimate fallback
  return {
    tickets: [...allTickets].sort((a, b) => a.price - b.price).slice(0, 8),
    matchType: "suggested",
    message: "مسیرهای پیشنهادی تریپیکس — ارزان‌ترین بلیط‌ها",
  };
}

export function getTicketById(id: string): Ticket | undefined {
  return allTickets.find((t) => t.id === id);
}

export function getPopularTickets(type?: TransportType): Ticket[] {
  const pool = type ? allTickets.filter((t) => t.type === type) : allTickets;
  return [...pool].sort((a, b) => b.seatsAvailable - a.seatsAvailable).slice(0, 6);
}
