import { useCallback, useEffect, useState } from "react";
import "./App.css";

const useLocalStorage = import.meta.env.VITE_USE_LOCAL_STORAGE === "true";
const reservationsEndpoint = "/api/reservations";
const servicesEndpoint = "/api/services";

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "WhatsApp", href: "#" },
];

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle
      cx="12"
      cy="12"
      r="3.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="17" cy="7" r="1.2" fill="currentColor" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M14.3 8.7h2V6h-2c-2.3 0-3.6 1.3-3.6 3.7V12H8.5v2.7h2.2V21h3.1v-6.3h2.5l.4-2.7h-2.9V9.9c0-.7.2-1.2 1.3-1.2z"
      fill="currentColor"
    />
  </svg>
);

const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M6.7 4.8c.4-.4.9-.5 1.4-.3l2.2 1.2c.5.2.7.8.5 1.3l-.8 1.7c-.1.3-.1.6.1.8 1 1.4 2.2 2.6 3.6 3.6.2.2.5.2.8.1l1.7-.8c.5-.2 1.1 0 1.3.5l1.2 2.2c.2.5.1 1-.3 1.4l-1.4 1.4c-.7.7-1.6 1-2.5.7-2.4-.6-4.7-2-6.8-4.1C5.3 12.9 3.9 10.6 3.3 8.2c-.2-.9 0-1.8.7-2.5l1.4-1.4z"
      fill="currentColor"
    />
  </svg>
);

const socialIconByLabel = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  WhatsApp: WhatsappIcon,
};

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true">
    <path d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176zM144 288L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 288L144 288z" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true">
    <path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z" />
  </svg>
);

const InstagramBrandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true">
    <path d="M320.3 205C256.8 204.8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245.4C360.9 245.2 394.4 278.5 394.6 319.7C394.8 360.9 361.5 394.4 320.3 394.6C279.1 394.8 245.6 361.5 245.4 320.3C245.2 279.1 278.5 245.6 319.7 245.4zM413.1 200.3C413.1 185.5 425.1 173.5 439.9 173.5C454.7 173.5 466.7 185.5 466.7 200.3C466.7 215.1 454.7 227.1 439.9 227.1C425.1 227.1 413.1 215.1 413.1 200.3zM542.8 227.5C541.1 191.6 532.9 159.8 506.6 133.6C480.4 107.4 448.6 99.2 412.7 97.4C375.7 95.3 264.8 95.3 227.8 97.4C192 99.1 160.2 107.3 133.9 133.5C107.6 159.7 99.5 191.5 97.7 227.4C95.6 264.4 95.6 375.3 97.7 412.3C99.4 448.2 107.6 480 133.9 506.2C160.2 532.4 191.9 540.6 227.8 542.4C264.8 544.5 375.7 544.5 412.7 542.4C448.6 540.7 480.4 532.5 506.6 506.2C532.8 480 541 448.2 542.8 412.3C544.9 375.3 544.9 264.5 542.8 227.5zM495 452C487.2 471.6 472.1 486.7 452.4 494.6C422.9 506.3 352.9 503.6 320.3 503.6C287.7 503.6 217.6 506.2 188.2 494.6C168.6 486.8 153.5 471.7 145.6 452C133.9 422.5 136.6 352.5 136.6 319.9C136.6 287.3 134 217.2 145.6 187.8C153.4 168.2 168.5 153.1 188.2 145.2C217.7 133.5 287.7 136.2 320.3 136.2C352.9 136.2 423 133.6 452.4 145.2C472 153 487.1 168.1 495 187.8C506.7 217.3 504 287.3 504 319.9C504 352.5 506.7 422.6 495 452z" />
  </svg>
);

const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true">
    <path d="M451.5 160C434.9 160 418.8 164.5 404.7 172.7C388.9 156.7 370.5 143.3 350.2 133.2C378.4 109.2 414.3 96 451.5 96C537.9 96 608 166 608 252.5C608 294 591.5 333.8 562.2 363.1L491.1 434.2C461.8 463.5 422 480 380.5 480C294.1 480 224 410 224 323.5C224 322 224 320.5 224.1 319C224.6 301.3 239.3 287.4 257 287.9C274.7 288.4 288.6 303.1 288.1 320.8C288.1 321.7 288.1 322.6 288.1 323.4C288.1 374.5 329.5 415.9 380.6 415.9C405.1 415.9 428.6 406.2 446 388.8L517.1 317.7C534.4 300.4 544.2 276.8 544.2 252.3C544.2 201.2 502.8 159.8 451.7 159.8zM307.2 237.3C305.3 236.5 303.4 235.4 301.7 234.2C289.1 227.7 274.7 224 259.6 224C235.1 224 211.6 233.7 194.2 251.1L123.1 322.2C105.8 339.5 96 363.1 96 387.6C96 438.7 137.4 480.1 188.5 480.1C205 480.1 221.1 475.7 235.2 467.5C251 483.5 269.4 496.9 289.8 507C261.6 530.9 225.8 544.2 188.5 544.2C102.1 544.2 32 474.2 32 387.7C32 346.2 48.5 306.4 77.8 277.1L148.9 206C178.2 176.7 218 160.2 259.5 160.2C346.1 160.2 416 230.8 416 317.1C416 318.4 416 319.7 416 321C415.6 338.7 400.9 352.6 383.2 352.2C365.5 351.8 351.6 337.1 352 319.4C352 318.6 352 317.9 352 317.1C352 283.4 334 253.8 307.2 237.5z" />
  </svg>
);

const WhatsappButtonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true">
    <path d="M476.9 161.1C435 119.1 379.2 96 319.9 96C197.5 96 97.9 195.6 97.9 318C97.9 357.1 108.1 395.3 127.5 429L96 544L213.7 513.1C246.1 530.8 282.6 540.1 319.8 540.1L319.9 540.1C442.2 540.1 544 440.5 544 318.1C544 258.8 518.8 203.1 476.9 161.1zM319.9 502.7C286.7 502.7 254.2 493.8 225.9 477L219.2 473L149.4 491.3L168 423.2L163.6 416.2C145.1 386.8 135.4 352.9 135.4 318C135.4 216.3 218.2 133.5 320 133.5C369.3 133.5 415.6 152.7 450.4 187.6C485.2 222.5 506.6 268.8 506.5 318.1C506.5 419.9 421.6 502.7 319.9 502.7zM421.1 364.5C415.6 361.7 388.3 348.3 383.2 346.5C378.1 344.6 374.4 343.7 370.7 349.3C367 354.9 356.4 367.3 353.1 371.1C349.9 374.8 346.6 375.3 341.1 372.5C308.5 356.2 287.1 343.4 265.6 306.5C259.9 296.7 271.3 297.4 281.9 276.2C283.7 272.5 282.8 269.3 281.4 266.5C280 263.7 268.9 236.4 264.3 225.3C259.8 214.5 255.2 216 251.8 215.8C248.6 215.6 244.9 215.6 241.2 215.6C237.5 215.6 231.5 217 226.4 222.5C221.3 228.1 207 241.5 207 268.8C207 296.1 226.9 322.5 229.6 326.2C232.4 329.9 268.7 385.9 324.4 410C359.6 425.2 373.4 426.5 391 423.9C401.7 422.3 423.8 410.5 428.4 397.5C433 384.5 433 373.4 431.6 371.1C430.3 368.6 426.6 367.2 421.1 364.5z" />
  </svg>
);

const actionLinks = [
  { label: "Como llegar", href: "#", Icon: LocationIcon },
  { label: "Seguinos en instagram", href: "#", Icon: InstagramBrandIcon },
  { label: "Visita nuestro sitio web", href: "#", Icon: LinkIcon },
];

const whatsappAction = {
  label: "WhatsApp",
  href: "#",
};

const buildTimeSlots = () => {
  const slots = [];
  for (let hour = 10; hour <= 20; hour += 1) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
  }
  return slots;
};

const timeSlots = buildTimeSlots();

const defaultAvailableTimes = timeSlots;
const defaultAvailableDays = [1, 2, 3, 4, 5, 6];

const weekdayOptions = [
  { value: 1, label: "L" },
  { value: 2, label: "M" },
  { value: 3, label: "X" },
  { value: 4, label: "J" },
  { value: 5, label: "V" },
  { value: 6, label: "S" },
  { value: 0, label: "D" },
];

const weekdayOrderIndex = weekdayOptions.reduce((acc, day, index) => {
  acc[day.value] = index;
  return acc;
}, {});

const formatDayLabels = (days) => {
  if (!Array.isArray(days) || days.length === 0) return "Sin días";
  return [...days]
    .map((day) => Number(day))
    .sort(
      (a, b) => (weekdayOrderIndex[a] ?? 99) - (weekdayOrderIndex[b] ?? 99)
    )
    .map((day) => weekdayOptions.find((item) => item.value === day)?.label)
    .filter(Boolean)
    .join(", ");
};

const normalizeAvailableDays = (days) => {
  if (!Array.isArray(days)) return defaultAvailableDays;
  const normalized = days
    .map((day) => Number(day))
    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6);
  return normalized.length ? normalized : defaultAvailableDays;
};

const initialServices = [
  {
    id: "limpieza",
    name: "Limpieza facial",
    duration: "45 min",
    price: 18000,
    availableTimes: defaultAvailableTimes,
    availableDays: defaultAvailableDays,
  },
  {
    id: "masajes",
    name: "Masajes relajantes",
    duration: "60 min",
    price: 22000,
    availableTimes: defaultAvailableTimes,
    availableDays: defaultAvailableDays,
  },
  {
    id: "cejas",
    name: "Diseño de cejas",
    duration: "30 min",
    price: 12000,
    availableTimes: defaultAvailableTimes,
    availableDays: defaultAvailableDays,
  },
  {
    id: "manos",
    name: "Manicura spa",
    duration: "50 min",
    price: 15000,
    availableTimes: defaultAvailableTimes,
    availableDays: defaultAvailableDays,
  },
];

const formatMoney = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value) => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

const toIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isAllowedDay = (value, allowedDays) => {
  if (!value) return false;
  const day = new Date(`${value}T00:00:00`).getDay();
  if (Array.isArray(allowedDays) && allowedDays.length > 0) {
    return allowedDays.includes(day);
  }
  return day !== 0;
};

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const weekdays = ["L", "M", "X", "J", "V", "S", "D"];

const buildCalendarDays = (monthDate, allowedDays) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cells = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push({ key: `empty-${i}`, empty: true });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const iso = toIsoDate(date);
    const disabled = date < today || !isAllowedDay(iso, allowedDays);
    cells.push({
      key: iso,
      date,
      iso,
      label: day,
      disabled,
    });
  }

  const totalCells = Math.ceil(cells.length / 7) * 7;
  while (cells.length < totalCells) {
    cells.push({ key: `empty-${cells.length}`, empty: true });
  }

  return cells;
};

const buildAdminCalendarDays = (monthDate, countsByDate) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push({ key: `empty-${i}`, empty: true });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const iso = toIsoDate(date);
    cells.push({
      key: iso,
      iso,
      label: day,
      count: countsByDate[iso] || 0,
    });
  }

  const totalCells = Math.ceil(cells.length / 7) * 7;
  while (cells.length < totalCells) {
    cells.push({ key: `empty-${cells.length}`, empty: true });
  }

  return cells;
};

const bookingSteps = [
  { id: "services", label: "Servicio" },
  { id: "date", label: "Fecha" },
  { id: "time", label: "Hora" },
  { id: "contact", label: "Mis datos" },
  { id: "payment", label: "Reservar" },
  { id: "thanks", label: "Pago" },
];

const getStepIndex = (id) =>
  bookingSteps.findIndex((step) => step.id === id);

const Stepper = ({ current }) => (
  <div className="stepper" aria-label="Progreso de la reserva">
    {bookingSteps.map((step, index) => {
      const status =
        index < current ? "complete" : index === current ? "current" : "upcoming";
      return (
        <div key={step.id} className={`stepper-item ${status}`}>
          <span className="stepper-dot" aria-hidden="true">
            {index + 1}
          </span>
          <span className="stepper-label">{step.label}</span>
        </div>
      );
    })}
  </div>
);

const getRouteFromPath = (path) => {
  if (path.startsWith("/login")) return "admin-login";
  if (path.startsWith("/admin")) return "admin";
  return "client";
};

const normalizePhone = (value) => value.replace(/[^\d]/g, "");

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

const loadLocalServices = () => {
  if (typeof window === "undefined") return initialServices;
  const stored = window.localStorage.getItem("turnos_services");
  if (!stored) return initialServices;
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return initialServices;
    return parsed.map((service) => ({
      ...service,
      availableTimes:
        service.availableTimes && service.availableTimes.length > 0
          ? service.availableTimes
          : defaultAvailableTimes,
      availableDays: normalizeAvailableDays(service.availableDays),
    }));
  } catch (error) {
    return initialServices;
  }
};

const loadLocalReservations = () => {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem("turnos_reservations");
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const generateReservationId = () => {
  const base = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RES-${base}-${rand}`;
};

function App() {
  const [route, setRoute] = useState(() =>
    getRouteFromPath(window.location.pathname)
  );
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminMonth, setAdminMonth] = useState(() => new Date());
  const [adminSelectedDate, setAdminSelectedDate] = useState(() =>
    toIsoDate(new Date())
  );
  const [services, setServices] = useState(() =>
    useLocalStorage ? loadLocalServices() : []
  );
  const [servicesLoading, setServicesLoading] = useState(!useLocalStorage);
  const [servicesError, setServicesError] = useState("");
  const [serviceActionError, setServiceActionError] = useState("");
  const [serviceActionLoading, setServiceActionLoading] = useState(false);
  const [reservations, setReservations] = useState(() =>
    useLocalStorage ? loadLocalReservations() : []
  );
  const [reservationsLoading, setReservationsLoading] = useState(!useLocalStorage);
  const [reservationsError, setReservationsError] = useState("");
  const [adminFilter, setAdminFilter] = useState("all");
  const [showCreateReservation, setShowCreateReservation] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [adminPendingOpen, setAdminPendingOpen] = useState(false);
  const [adminStatsOpen, setAdminStatsOpen] = useState(false);
  const [adminStatsMonth, setAdminStatsMonth] = useState(() => new Date());
  const [adminServicesOpen, setAdminServicesOpen] = useState(false);
  const [adminCreateError, setAdminCreateError] = useState("");
  const [adminCreateLoading, setAdminCreateLoading] = useState(false);
  const [adminUpdateError, setAdminUpdateError] = useState("");
  const [serviceForm, setServiceForm] = useState(() => ({
    id: "",
    name: "",
    duration: "",
    price: "",
    availableTimes: defaultAvailableTimes,
    availableDays: defaultAvailableDays,
  }));
  const [isEditingService, setIsEditingService] = useState(false);
  const [newReservation, setNewReservation] = useState(() => ({
    name: "",
    whatsapp: "",
    serviceId: "",
    time: "",
  }));
  const [rescheduleId, setRescheduleId] = useState(null);
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [screen, setScreen] = useState("home");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [contactName, setContactName] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [aliasCopied, setAliasCopied] = useState(false);
  const [reservationId, setReservationId] = useState("");
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const service = services.find((item) => item.id === selectedService) || null;
  const deposit = service ? service.price * 0.5 : 0;
  const transferAlias = "alias.demo.test";
  const whatsappNumber = "5490000000000";
  const whatsappMessage = encodeURIComponent(
    `Hola! Te envio el comprobante de mi reserva.\n\nServicio: ${
      service?.name || "-"
    }\nFecha: ${formatDate(selectedDate)}\nHorario: ${selectedTime}\nNombre: ${contactName}\nWhatsApp: ${contactWhatsapp}\nID de reserva: ${
      reservationId || "-"
    }`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const getBookedTimes = (date, serviceId, serviceName, excludeId) => {
    if (!date || (!serviceId && !serviceName)) return [];
    return reservations
      .filter(
        (reservation) =>
          (reservation.status === "approved" ||
            reservation.status === "pending") &&
          reservation.date === date &&
          (reservation.serviceId
            ? reservation.serviceId === serviceId
            : reservation.service === serviceName) &&
          reservation.id !== excludeId
      )
      .map((reservation) => reservation.time);
  };

  const getServiceAvailability = (serviceId, serviceName) => {
    const currentService = services.find((item) =>
      serviceId ? item.id === serviceId : item.name === serviceName
    );
    if (currentService?.availableTimes?.length) {
      return currentService.availableTimes;
    }
    return defaultAvailableTimes;
  };

  const getServiceDays = (serviceId, serviceName) => {
    const currentService = services.find((item) =>
      serviceId ? item.id === serviceId : item.name === serviceName
    );
    return normalizeAvailableDays(currentService?.availableDays);
  };

  const getAvailableTimes = (date, serviceId, serviceName, excludeId) => {
    const bookedTimes = getBookedTimes(
      date,
      serviceId,
      serviceName,
      excludeId
    );
    const baseTimes = getServiceAvailability(serviceId, serviceName);
    return baseTimes.filter((time) => !bookedTimes.includes(time));
  };

  const navigate = (nextRoute, path) => {
    setRoute(nextRoute);
    window.history.pushState({}, "", path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRouteFromPath(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!useLocalStorage || typeof window === "undefined") return;
    const handleStorage = (event) => {
      if (event.key === "turnos_services") {
        setServices(loadLocalServices());
      }
      if (event.key === "turnos_reservations") {
        setReservations(loadLocalReservations());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (route === "admin" && !adminAuthed) {
      navigate("admin-login", "/login");
    }
    if (route === "admin-login" && adminAuthed) {
      navigate("admin", "/admin");
    }
  }, [route, adminAuthed]);

  useEffect(() => {
    const selected = new Date(`${adminSelectedDate}T00:00:00`);
    if (
      selected.getMonth() !== adminMonth.getMonth() ||
      selected.getFullYear() !== adminMonth.getFullYear()
    ) {
      setAdminSelectedDate(
        toIsoDate(new Date(adminMonth.getFullYear(), adminMonth.getMonth(), 1))
      );
    }
  }, [adminMonth]);

  const fetchServices = useCallback(async () => {
    if (useLocalStorage) {
      setServices(loadLocalServices());
      setServicesLoading(false);
      return;
    }
    setServicesLoading(true);
    setServicesError("");
    try {
      const response = await fetch(servicesEndpoint);
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = await response.json();
      setServices(data);
    } catch (error) {
      setServicesError("No se pudieron cargar los servicios.");
    } finally {
      setServicesLoading(false);
    }
  }, []);

  const fetchReservations = useCallback(async () => {
    if (useLocalStorage) {
      setReservations(loadLocalReservations());
      setReservationsLoading(false);
      return;
    }
    setReservationsLoading(true);
    setReservationsError("");
    try {
      const response = await fetch(reservationsEndpoint);
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      setReservationsError("No se pudieron cargar las reservas.");
    } finally {
      setReservationsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  useEffect(() => {
    if (!useLocalStorage || typeof window === "undefined") return;
    window.localStorage.setItem(
      "turnos_reservations",
      JSON.stringify(reservations)
    );
  }, [reservations]);

  useEffect(() => {
    if (!useLocalStorage || typeof window === "undefined") return;
    window.localStorage.setItem("turnos_services", JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    if (!services.length) return;
    setNewReservation((prev) => {
      if (prev.serviceId && services.some((s) => s.id === prev.serviceId)) {
        return prev;
      }
      return {
        ...prev,
        serviceId: services[0].id,
        time: "",
      };
    });
  }, [services]);

  useEffect(() => {
    if (route !== "admin" || reservations.length === 0) return;
    const hasSelected = reservations.some(
      (reservation) => reservation.date === adminSelectedDate
    );
    if (hasSelected) return;
    const sorted = [...reservations].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    const nextDate = sorted[0].date;
    if (!nextDate) return;
    setAdminSelectedDate(nextDate);
    setAdminMonth(new Date(`${nextDate}T00:00:00`));
  }, [route, reservations]);

  const startBooking = () => {
    setSelectedService(null);
    setSelectedDate("");
    setSelectedTime("");
    setCalendarMonth(new Date());
    setContactName("");
    setContactWhatsapp("");
    setAliasCopied(false);
    setReservationId("");
    setSubmitError("");
    setScreen("services");
  };

  const handleShareApp = async () => {
    if (typeof navigator === "undefined") return;
    const sharePayload = {
      title: "Turnos",
      text: "Reserva tu turno",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(sharePayload);
      } catch (_error) {
      }
      return;
    }
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch (_error) {
      }
    }
  };

  const handleCopyAlias = async () => {
    try {
      await navigator.clipboard.writeText(transferAlias);
      setAliasCopied(true);
      setTimeout(() => setAliasCopied(false), 2000);
    } catch (error) {
      setAliasCopied(false);
    }
  };

  const handleStartReservation = async () => {
    setSubmitError("");
    const newReservationId = reservationId || generateReservationId();

    if (useLocalStorage) {
      const newReservation = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}`,
        name: contactName.trim(),
        whatsapp: contactWhatsapp.trim(),
        service: service?.name || "Servicio",
        serviceId: service?.id || "",
        date: selectedDate,
        time: selectedTime,
        status: "pending",
        reservationId: newReservationId,
      };
      setReservationId(newReservationId);
      setReservations((prev) => [...prev, newReservation]);
      setScreen("thanks");
      return;
    }

    setIsSubmittingReservation(true);
    try {
      const response = await fetch(reservationsEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName.trim(),
          whatsapp: contactWhatsapp.trim(),
          service: service?.name || "Servicio",
          serviceId: service?.id || "",
          date: selectedDate,
          time: selectedTime,
          status: "pending",
          reservationId: newReservationId,
        }),
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const created = await response.json();
      setReservationId(created.reservationId);
      setReservations((prev) => [...prev, created]);
      setScreen("thanks");
    } catch (error) {
      setSubmitError("No se pudo guardar la reserva. Intenta de nuevo.");
    } finally {
      setIsSubmittingReservation(false);
    }
  };

  const handleAdminLogin = (event) => {
    event.preventDefault();
    if (adminUser === ADMIN_USER && adminPass === ADMIN_PASS) {
      setAdminAuthed(true);
      setAdminError("");
      navigate("admin", "/admin");
      return;
    }
    setAdminError("Credenciales incorrectas.");
  };

  const handleAdminLogout = () => {
    setAdminAuthed(false);
    setAdminUser("");
    setAdminPass("");
    setAdminError("");
    navigate("admin-login", "/login");
  };

  const updateReservationStatus = async (id, status) => {
    setAdminUpdateError("");
    if (useLocalStorage) {
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id ? { ...reservation, status } : reservation
        )
      );
      return;
    }

    try {
      const response = await fetch(reservationsEndpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const updated = await response.json();
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id ? updated : reservation
        )
      );
    } catch (error) {
      setAdminUpdateError("No se pudo actualizar la reserva.");
    }
  };

  const openStats = () => {
    setAdminStatsOpen(true);
    setAdminMenuOpen(false);
    setShowCreateReservation(false);
    setAdminPendingOpen(false);
    setAdminServicesOpen(false);
    setAdminCreateError("");
    setAdminUpdateError("");
    setServiceActionError("");
    setAdminStatsMonth(
      new Date(adminMonth.getFullYear(), adminMonth.getMonth(), 1)
    );
  };

  const startCreateReservation = () => {
    setNewReservation({
      name: "",
      whatsapp: "",
      serviceId: services[0]?.id || "",
      time: "",
    });
    setShowCreateReservation(true);
    setAdminMenuOpen(false);
    setAdminServicesOpen(false);
    setAdminStatsOpen(false);
    setAdminCreateError("");
    setAdminUpdateError("");
    setServiceActionError("");
  };

  const openServices = () => {
    setAdminServicesOpen(true);
    setAdminMenuOpen(false);
    setShowCreateReservation(false);
    setAdminPendingOpen(false);
    setAdminStatsOpen(false);
    setAdminCreateError("");
    setAdminUpdateError("");
    setServiceActionError("");
    setServiceForm({
      id: "",
      name: "",
      duration: "",
      price: "",
      availableTimes: defaultAvailableTimes,
      availableDays: defaultAvailableDays,
    });
    setIsEditingService(false);
  };

  const handleCreateReservation = async () => {
    if (
      !newReservation.name.trim() ||
      !newReservation.whatsapp.trim() ||
      !newReservation.serviceId ||
      !newReservation.time
    ) {
      return;
    }
    const selectedServiceForNew = services.find(
      (item) => item.id === newReservation.serviceId
    );
    const reservationId = generateReservationId();

    if (useLocalStorage) {
      const created = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}`,
        name: newReservation.name.trim(),
        whatsapp: newReservation.whatsapp.trim(),
        service: selectedServiceForNew?.name || "Servicio",
        serviceId: newReservation.serviceId,
        date: adminSelectedDate,
        time: newReservation.time,
        status: "pending",
        reservationId,
      };
      setReservations((prev) => [...prev, created]);
      setShowCreateReservation(false);
      return;
    }

    setAdminCreateLoading(true);
    setAdminCreateError("");
    try {
      const response = await fetch(reservationsEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newReservation.name.trim(),
          whatsapp: newReservation.whatsapp.trim(),
          service: selectedServiceForNew?.name || "Servicio",
          serviceId: newReservation.serviceId,
          date: adminSelectedDate,
          time: newReservation.time,
          status: "pending",
          reservationId,
        }),
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const created = await response.json();
      setReservations((prev) => [...prev, created]);
      setShowCreateReservation(false);
    } catch (error) {
      setAdminCreateError("No se pudo guardar la reserva.");
    } finally {
      setAdminCreateLoading(false);
    }
  };

  const startEditService = (serviceItem) => {
    setServiceActionError("");
    setServiceForm({
      id: serviceItem.id,
      name: serviceItem.name,
      duration: serviceItem.duration,
      price: serviceItem.price,
      availableTimes:
        serviceItem.availableTimes && serviceItem.availableTimes.length > 0
          ? serviceItem.availableTimes
          : defaultAvailableTimes,
      availableDays:
        serviceItem.availableDays && serviceItem.availableDays.length > 0
          ? serviceItem.availableDays
          : defaultAvailableDays,
    });
    setIsEditingService(true);
    setAdminServicesOpen(true);
    setAdminMenuOpen(false);
  };

  const deleteService = async (serviceId) => {
    setServiceActionError("");
    if (useLocalStorage) {
      setServices((prev) =>
        prev.filter((serviceItem) => serviceItem.id !== serviceId)
      );
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.serviceId === serviceId
            ? { ...reservation, serviceId: "", service: reservation.service }
            : reservation
        )
      );
      if (selectedService === serviceId) {
        setSelectedService(null);
      }
      return;
    }

    setServiceActionLoading(true);
    try {
      const response = await fetch(`${servicesEndpoint}?id=${serviceId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      setServices((prev) =>
        prev.filter((serviceItem) => serviceItem.id !== serviceId)
      );
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.serviceId === serviceId
            ? { ...reservation, serviceId: "" }
            : reservation
        )
      );
      if (selectedService === serviceId) {
        setSelectedService(null);
      }
    } catch (error) {
      setServiceActionError("No se pudo eliminar el servicio.");
    } finally {
      setServiceActionLoading(false);
    }
  };

  const toggleServiceTime = (time) => {
    setServiceForm((prev) => {
      const hasTime = prev.availableTimes.includes(time);
      const nextTimes = hasTime
        ? prev.availableTimes.filter((item) => item !== time)
        : [...prev.availableTimes, time];
      return { ...prev, availableTimes: nextTimes };
    });
  };

  const toggleServiceDay = (day) => {
    setServiceForm((prev) => {
      const hasDay = prev.availableDays.includes(day);
      const nextDays = hasDay
        ? prev.availableDays.filter((item) => item !== day)
        : [...prev.availableDays, day];
      return { ...prev, availableDays: nextDays };
    });
  };

  const handleSaveService = async () => {
    setServiceActionError("");
    const name = serviceForm.name.trim();
    const duration = serviceForm.duration.trim();
    const price = Number(serviceForm.price);
    if (!name || !duration || Number.isNaN(price)) return;
    const availableTimes = serviceForm.availableTimes.length
      ? serviceForm.availableTimes
      : defaultAvailableTimes;
    const availableDays = serviceForm.availableDays.length
      ? serviceForm.availableDays
      : defaultAvailableDays;

    if (isEditingService) {
      if (useLocalStorage) {
        setServices((prev) =>
          prev.map((serviceItem) =>
            serviceItem.id === serviceForm.id
              ? {
                  ...serviceItem,
                  name,
                  duration,
                  price,
                  availableTimes,
                  availableDays,
                }
              : serviceItem
          )
        );
        setReservations((prev) =>
          prev.map((reservation) =>
            reservation.serviceId === serviceForm.id
              ? { ...reservation, service: name }
              : reservation
          )
        );
      } else {
        setServiceActionLoading(true);
        try {
          const response = await fetch(servicesEndpoint, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: serviceForm.id,
              name,
              duration,
              price,
              availableTimes,
              availableDays,
            }),
          });
          if (!response.ok) {
            throw new Error("Request failed");
          }
          const updated = await response.json();
          setServices((prev) =>
            prev.map((serviceItem) =>
              serviceItem.id === updated.id ? updated : serviceItem
            )
          );
          setReservations((prev) =>
            prev.map((reservation) =>
              reservation.serviceId === updated.id
                ? { ...reservation, service: updated.name }
                : reservation
            )
          );
        } catch (error) {
          setServiceActionError("No se pudo actualizar el servicio.");
          return;
        } finally {
          setServiceActionLoading(false);
        }
      }
    } else {
      if (useLocalStorage) {
        const newService = {
          id:
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `srv-${Date.now()}`,
          name,
          duration,
          price,
          availableTimes,
          availableDays,
        };
        setServices((prev) => [...prev, newService]);
      } else {
        setServiceActionLoading(true);
        try {
          const response = await fetch(servicesEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              duration,
              price,
              availableTimes,
              availableDays,
            }),
          });
          if (!response.ok) {
            throw new Error("Request failed");
          }
          const created = await response.json();
          setServices((prev) => [...prev, created]);
        } catch (error) {
          setServiceActionError("No se pudo crear el servicio.");
          return;
        } finally {
          setServiceActionLoading(false);
        }
      }
    }

    setServiceForm({
      id: "",
      name: "",
      duration: "",
      price: "",
      availableTimes: defaultAvailableTimes,
      availableDays: defaultAvailableDays,
    });
    setIsEditingService(false);
  };

  const startReschedule = (reservation) => {
    setRescheduleId(reservation.id);
    setRescheduleTime(reservation.time);
  };

  const applyReschedule = async () => {
    if (!rescheduleId || !rescheduleTime) return;
    if (useLocalStorage) {
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === rescheduleId
            ? {
                ...reservation,
                time: rescheduleTime,
                date: adminSelectedDate,
              }
            : reservation
        )
      );
      setRescheduleId(null);
      setRescheduleTime("");
      return;
    }

    setAdminUpdateError("");
    try {
      const response = await fetch(reservationsEndpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rescheduleId,
          time: rescheduleTime,
          date: adminSelectedDate,
        }),
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const updated = await response.json();
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === rescheduleId ? updated : reservation
        )
      );
      setRescheduleId(null);
      setRescheduleTime("");
    } catch (error) {
      setAdminUpdateError("No se pudo reprogramar la reserva.");
    }
  };

  if (route === "admin-login") {
    return (
      <main className="admin-screen">
        <section className="admin-panel login-panel" aria-label="Acceso admin">
          <header className="login-header">
            <div className="logo-badge admin-logo">
              <span>Logo</span>
            </div>
            <p className="flow-title">Acceso administrador</p>
            <p className="flow-subtitle">
              Ingresá con tu usuario y contraseña.
            </p>
          </header>

          <form className="login-form" onSubmit={handleAdminLogin}>
            <label className="form-field">
              <span className="field-label">Usuario</span>
              <input
                className="text-input"
                type="text"
                value={adminUser}
                onChange={(event) => setAdminUser(event.target.value)}
                placeholder="admin"
              />
            </label>

            <label className="form-field">
              <span className="field-label">Contraseña</span>
              <input
                className="text-input"
                type="password"
                value={adminPass}
                onChange={(event) => setAdminPass(event.target.value)}
                placeholder="••••••••"
              />
            </label>

            {adminError && <p className="login-error">{adminError}</p>}

            <button className="primary-button" type="submit">
              Ingresar
            </button>
          </form>

          <button
            className="ghost-link"
            type="button"
            onClick={() => {
              setScreen("home");
              navigate("client", "/");
            }}
          >
            Volver al inicio
          </button>
        </section>
      </main>
    );
  }

  if (route === "admin") {
    const reservationsByDate = reservations.reduce((acc, reservation) => {
      acc[reservation.date] = (acc[reservation.date] || 0) + 1;
      return acc;
    }, {});
    const adminCalendarDays = buildAdminCalendarDays(
      adminMonth,
      reservationsByDate
    );
    const dailyReservations = reservations.filter(
      (reservation) => reservation.date === adminSelectedDate
    );
    const filteredReservations = dailyReservations.filter((reservation) =>
      adminFilter === "all" ? true : reservation.status === adminFilter
    );
    const pendingReservations = reservations.filter(
      (reservation) => reservation.status === "pending"
    );
    const pendingCount = pendingReservations.length;

    const statusLabel = (status) => {
      if (status === "approved") return "Aprobada";
      if (status === "rejected") return "Rechazada";
      if (status === "completed") return "Completada";
      return "Pendiente";
    };

    const adminWhatsappLink = (reservation) => {
      const phone = normalizePhone(reservation.whatsapp);
      if (!phone) return "#";
      const message = encodeURIComponent(
        `Hola ${reservation.name}, te escribimos por tu reserva del ${formatDate(
          reservation.date
        )} a las ${reservation.time}.`
      );
      return `https://wa.me/${phone}?text=${message}`;
    };

    const monthLabel = `${months[adminMonth.getMonth()]} ${adminMonth.getFullYear()}`;
    const statsMonthKey = `${adminStatsMonth.getFullYear()}-${String(
      adminStatsMonth.getMonth() + 1
    ).padStart(2, "0")}`;
    const statsLabel = `${months[adminStatsMonth.getMonth()]} ${adminStatsMonth.getFullYear()}`;
    const completedForMonth = reservations.filter(
      (reservation) =>
        reservation.status === "completed" &&
        reservation.date.startsWith(statsMonthKey)
    );
    const servicePriceById = services.reduce((acc, serviceItem) => {
      acc[serviceItem.id] = serviceItem.price;
      return acc;
    }, {});
    const servicePriceByName = services.reduce((acc, serviceItem) => {
      acc[serviceItem.name] = serviceItem.price;
      return acc;
    }, {});

    const statsByService = completedForMonth.reduce((acc, reservation) => {
      const serviceMatch = reservation.serviceId
        ? services.find((item) => item.id === reservation.serviceId)
        : null;
      const resolvedName = serviceMatch ? serviceMatch.name : reservation.service;
      const price =
        reservation.serviceId && servicePriceById[reservation.serviceId]
          ? servicePriceById[reservation.serviceId]
          : servicePriceByName[reservation.service] || 0;
      if (!acc[resolvedName]) {
        acc[resolvedName] = { count: 0, total: 0 };
      }
      acc[resolvedName].count += 1;
      acc[resolvedName].total += price;
      return acc;
    }, {});
    const totalRevenue = Object.values(statsByService).reduce(
      (sum, entry) => sum + entry.total,
      0
    );

    return (
      <main className="admin-screen">
        <section className="admin-panel" aria-label="Panel de reservas">
          <header className="admin-topbar">
            <div>
              <div className="admin-title">
                <div className="logo-badge admin-logo small">
                  <span>Logo</span>
                </div>
                <div className="admin-title-text">
                  <p className="company-name">Su Empresa</p>
                  <p className="flow-title">Reservas</p>
                </div>
              </div>
            </div>
            <div className="admin-actions">
              <button
                className="admin-notify-button"
                type="button"
                aria-label="Ver reservas pendientes"
                onClick={() => setAdminPendingOpen((open) => !open)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true">
                  <path d="M320 64C306.7 64 296 74.7 296 88L296 97.7C214.6 109.3 152 179.4 152 264L152 278.5C152 316.2 142 353.2 123 385.8L101.1 423.2C97.8 429 96 435.5 96 442.2C96 463.1 112.9 480 133.8 480L506.2 480C527.1 480 544 463.1 544 442.2C544 435.5 542.2 428.9 538.9 423.2L517 385.7C498 353.1 488 316.1 488 278.4L488 263.9C488 179.3 425.4 109.2 344 97.6L344 87.9C344 74.6 333.3 63.9 320 63.9zM488.4 432L151.5 432L164.4 409.9C187.7 370 200 324.6 200 278.5L200 264C200 197.7 253.7 144 320 144C386.3 144 440 197.7 440 264L440 278.5C440 324.7 452.3 370 475.5 409.9L488.4 432zM252.1 528C262 556 288.7 576 320 576C351.3 576 378 556 387.9 528L252.1 528z" />
                </svg>
                {pendingCount > 0 && (
                  <span className="notify-badge" aria-hidden="true">
                    {pendingCount}
                  </span>
                )}
              </button>
              <button
                className="secondary-button outline"
                type="button"
                onClick={handleAdminLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </header>

          {reservationsLoading && (
            <p className="helper-text">Cargando reservas...</p>
          )}
          {reservationsError && (
            <p className="inline-error">{reservationsError}</p>
          )}
          {adminUpdateError && (
            <p className="inline-error">{adminUpdateError}</p>
          )}

          {adminPendingOpen && (
            <section className="pending-panel" aria-label="Reservas pendientes">
              <div className="admin-create-header">
                <p className="flow-title">Pendientes de aprobación</p>
                <button
                  className="secondary-button ghost"
                  type="button"
                  onClick={() => setAdminPendingOpen(false)}
                >
                  Cerrar
                </button>
              </div>
              {pendingReservations.length === 0 ? (
                <p className="empty-state">No hay reservas pendientes.</p>
              ) : (
                <div className="pending-list">
                  {pendingReservations.map((reservation) => (
                    <div className="pending-item" key={reservation.id}>
                      <div>
                        <p className="reservation-name">{reservation.name}</p>
                        <p className="reservation-meta">
                          {reservation.service} · {formatDate(reservation.date)} ·{" "}
                          {reservation.time}
                        </p>
                        <p className="reservation-meta">
                          ID:{" "}
                          {reservation.reservationId ||
                            reservation.paymentId ||
                            "-"}
                        </p>
                      </div>
                      <div className="reservation-actions">
                        <button
                          className="secondary-button"
                          type="button"
                          onClick={() =>
                            updateReservationStatus(reservation.id, "approved")
                          }
                        >
                          Aprobar
                        </button>
                        <button
                          className="secondary-button outline"
                          type="button"
                          onClick={() =>
                            updateReservationStatus(reservation.id, "rejected")
                          }
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {adminStatsOpen && (
            <section className="admin-stats-panel" aria-label="Estadísticas">
              <div className="admin-create-header">
                <p className="flow-title">Estadísticas</p>
                <button
                  className="secondary-button ghost"
                  type="button"
                  onClick={() => setAdminStatsOpen(false)}
                >
                  Cerrar
                </button>
              </div>
              <div className="stats-header">
                <button
                  className="icon-button calendar-nav"
                  type="button"
                  aria-label="Mes anterior"
                  onClick={() =>
                    setAdminStatsMonth(
                      (current) =>
                        new Date(
                          current.getFullYear(),
                          current.getMonth() - 1,
                          1
                        )
                    )
                  }
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M15 6l-6 6 6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <p className="calendar-month">{statsLabel}</p>
                <button
                  className="icon-button calendar-nav"
                  type="button"
                  aria-label="Mes siguiente"
                  onClick={() =>
                    setAdminStatsMonth(
                      (current) =>
                        new Date(
                          current.getFullYear(),
                          current.getMonth() + 1,
                          1
                        )
                    )
                  }
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M9 6l6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="stats-total">
                <p className="summary-label">Total recaudado</p>
                <p className="summary-value">{formatMoney(totalRevenue)}</p>
              </div>
              {completedForMonth.length === 0 ? (
                <p className="empty-state">
                  No hay reservas completadas este mes.
                </p>
              ) : (
                <div className="stats-list">
                  {Object.entries(statsByService).map(([serviceName, data]) => (
                    <div className="stats-row" key={serviceName}>
                      <div>
                        <p className="reservation-name">{serviceName}</p>
                        <p className="reservation-meta">
                          {data.count} servicios completados
                        </p>
                      </div>
                      <p className="summary-value">
                        {formatMoney(data.total)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {adminServicesOpen && (
            <section className="admin-services-panel" aria-label="Servicios">
              <div className="admin-create-header">
                <p className="flow-title">Administrar servicios</p>
                <button
                  className="secondary-button ghost"
                  type="button"
                  onClick={() => setAdminServicesOpen(false)}
                >
                  Cerrar
                </button>
              </div>

              {servicesLoading && (
                <p className="helper-text">Cargando servicios...</p>
              )}
              {servicesError && (
                <p className="inline-error">{servicesError}</p>
              )}
              {serviceActionError && (
                <p className="inline-error">{serviceActionError}</p>
              )}

              <div className="services-list">
                {services.length === 0 && !servicesLoading ? (
                  <p className="empty-state">
                    No hay servicios cargados.
                  </p>
                ) : (
                  services.map((serviceItem) => (
                    <div className="service-item" key={serviceItem.id}>
                      <div>
                        <p className="reservation-name">{serviceItem.name}</p>
                        <p className="reservation-meta">
                          {serviceItem.duration} ·{" "}
                          {formatMoney(serviceItem.price)}
                        </p>
                        <p className="reservation-meta">
                          {serviceItem.availableTimes?.length || 0} horarios
                          disponibles
                        </p>
                        <p className="reservation-meta">
                          Días: {formatDayLabels(serviceItem.availableDays)}
                        </p>
                      </div>
                      <div className="reservation-actions">
                        <button
                          className="secondary-button"
                          type="button"
                          onClick={() => startEditService(serviceItem)}
                          disabled={serviceActionLoading}
                        >
                          Editar
                        </button>
                        <button
                          className="secondary-button outline"
                          type="button"
                          onClick={() => deleteService(serviceItem.id)}
                          disabled={serviceActionLoading}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="service-form">
                <p className="summary-label">
                  {isEditingService ? "Editar servicio" : "Nuevo servicio"}
                </p>
                <div className="admin-create-grid">
                  <label className="form-field">
                    <span className="field-label">Nombre</span>
                    <input
                      className="text-input"
                      type="text"
                      value={serviceForm.name}
                      onChange={(event) =>
                        setServiceForm((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Ej: Limpieza facial"
                    />
                  </label>
                  <label className="form-field">
                    <span className="field-label">Duración</span>
                    <input
                      className="text-input"
                      type="text"
                      value={serviceForm.duration}
                      onChange={(event) =>
                        setServiceForm((prev) => ({
                          ...prev,
                          duration: event.target.value,
                        }))
                      }
                      placeholder="Ej: 45 min"
                    />
                  </label>
                  <label className="form-field">
                    <span className="field-label">Precio</span>
                    <input
                      className="text-input"
                      type="number"
                      min="0"
                      value={serviceForm.price}
                      onChange={(event) =>
                        setServiceForm((prev) => ({
                          ...prev,
                          price: event.target.value,
                        }))
                      }
                      placeholder="Ej: 18000"
                    />
                  </label>
                </div>

                <p className="summary-label">Días disponibles</p>
                <div className="service-days-grid">
                  {weekdayOptions.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      className={`day-chip ${
                        serviceForm.availableDays.includes(day.value)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => toggleServiceDay(day.value)}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>

                <p className="summary-label">Horarios disponibles</p>
                <div className="service-times-grid">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`time-slot ${
                        serviceForm.availableTimes.includes(time)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => toggleServiceTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                <div className="service-form-actions">
                  <button
                    className="primary-button"
                    type="button"
                    onClick={handleSaveService}
                    disabled={
                      serviceActionLoading ||
                      !serviceForm.name.trim() ||
                      !serviceForm.duration.trim() ||
                      Number.isNaN(Number(serviceForm.price))
                    }
                  >
                    {serviceActionLoading
                      ? "Guardando..."
                      : isEditingService
                      ? "Guardar cambios"
                      : "Agregar servicio"}
                  </button>
                  {isEditingService && (
                    <button
                      className="secondary-button outline"
                      type="button"
                      onClick={() => {
                        setServiceForm({
                          id: "",
                          name: "",
                          duration: "",
                          price: "",
                          availableTimes: defaultAvailableTimes,
                          availableDays: defaultAvailableDays,
                        });
                        setIsEditingService(false);
                      }}
                    >
                      Cancelar edición
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          <section className="admin-calendar">
            <div className="calendar-header">
              <button
                className="icon-button calendar-nav"
                type="button"
                aria-label="Mes anterior"
                onClick={() =>
                  setAdminMonth(
                    (current) =>
                      new Date(
                        current.getFullYear(),
                        current.getMonth() - 1,
                        1
                      )
                  )
                }
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M15 6l-6 6 6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <p className="calendar-month">{monthLabel}</p>
              <button
                className="icon-button calendar-nav"
                type="button"
                aria-label="Mes siguiente"
                onClick={() =>
                  setAdminMonth(
                    (current) =>
                      new Date(
                        current.getFullYear(),
                        current.getMonth() + 1,
                        1
                      )
                  )
                }
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M9 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="calendar-weekdays">
              {weekdays.map((day) => (
                <span key={day} className="calendar-weekday">
                  {day}
                </span>
              ))}
            </div>

            <div className="calendar-grid">
              {adminCalendarDays.map((cell) => {
                if (cell.empty) {
                  return (
                    <span key={cell.key} className="calendar-cell empty" />
                  );
                }
                return (
                  <button
                    key={cell.key}
                    type="button"
                    className={`calendar-cell admin-cell${
                      adminSelectedDate === cell.iso ? " selected" : ""
                    }`}
                    onClick={() => setAdminSelectedDate(cell.iso)}
                  >
                    <span>{cell.label}</span>
                    {cell.count > 0 && (
                      <span className="calendar-count">{cell.count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="reservation-section">
            <div className="reservation-header">
              <p className="flow-title">
                Reservas del {formatDate(adminSelectedDate)}
              </p>
              <span className="reservation-count">
                {filteredReservations.length} reservas
              </span>
            </div>

            {filteredReservations.length === 0 ? (
              <div className="empty-state">
                <p>No hay reservas para este día.</p>
                {dailyReservations.length > 0 && (
                  <p>Probá con otro filtro de estado.</p>
                )}
                {reservations.length > 0 && dailyReservations.length === 0 && (
                  <p>Seleccioná un día con badge en el calendario.</p>
                )}
              </div>
            ) : (
              <div className="reservation-list">
                {filteredReservations.map((reservation) => (
                  <article className="reservation-card" key={reservation.id}>
                    <div className="reservation-info">
                      <div>
                        <p className="reservation-name">{reservation.name}</p>
                        <p className="reservation-meta">
                          {reservation.service} · {reservation.time}
                        </p>
                        <p className="reservation-meta">
                          ID:{" "}
                          {reservation.reservationId ||
                            reservation.paymentId ||
                            "-"}
                        </p>
                        <p className="reservation-meta">
                          WhatsApp: {reservation.whatsapp}
                        </p>
                      </div>
                      <span className={`status-pill ${reservation.status}`}>
                        {statusLabel(reservation.status)}
                      </span>
                    </div>

                    <div className="reservation-actions">
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() =>
                          updateReservationStatus(reservation.id, "approved")
                        }
                      >
                        Aceptar
                      </button>
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() =>
                          updateReservationStatus(reservation.id, "completed")
                        }
                      >
                        Completar
                      </button>
                      <button
                        className="secondary-button outline"
                        type="button"
                        onClick={() =>
                          updateReservationStatus(reservation.id, "rejected")
                        }
                      >
                        Rechazar
                      </button>
                      <a
                        className="secondary-button ghost"
                        href={adminWhatsappLink(reservation)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        WhatsApp
                      </a>
                      <button
                        className="secondary-button ghost"
                        type="button"
                        onClick={() => startReschedule(reservation)}
                      >
                        Reprogramar
                      </button>
                    </div>

                    {rescheduleId === reservation.id && (
                      <div className="reschedule-panel">
                        <p className="helper-text">
                          Reprogramar para {formatDate(adminSelectedDate)}
                        </p>
                        <div className="reschedule-controls">
                          <select
                            className="select-input"
                            value={rescheduleTime}
                            onChange={(event) =>
                              setRescheduleTime(event.target.value)
                            }
                          >
                            <option value="">Seleccionar horario</option>
                            {getAvailableTimes(
                              adminSelectedDate,
                              reservation.serviceId,
                              reservation.service,
                              reservation.id
                            ).map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                          <button
                            className="secondary-button"
                            type="button"
                            onClick={applyReschedule}
                            disabled={!rescheduleTime}
                          >
                            Guardar
                          </button>
                          <button
                            className="secondary-button ghost"
                            type="button"
                            onClick={() => {
                              setRescheduleId(null);
                              setRescheduleTime("");
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          {showCreateReservation && (
            <section className="admin-create-panel" aria-label="Nueva reserva">
              <div className="admin-create-header">
                <p className="flow-title">Agregar reserva</p>
                <button
                  className="secondary-button ghost"
                  type="button"
                  onClick={() => setShowCreateReservation(false)}
                >
                  Cerrar
                </button>
              </div>
              <p className="helper-text">
                Fecha seleccionada: {formatDate(adminSelectedDate)}
              </p>
              {adminCreateError && (
                <p className="inline-error">{adminCreateError}</p>
              )}
              <div className="admin-create-grid">
                <label className="form-field">
                  <span className="field-label">Nombre</span>
                  <input
                    className="text-input"
                    type="text"
                    value={newReservation.name}
                    onChange={(event) =>
                      setNewReservation((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Nombre y apellido"
                  />
                </label>
                <label className="form-field">
                  <span className="field-label">WhatsApp</span>
                  <input
                    className="text-input"
                    type="tel"
                    value={newReservation.whatsapp}
                    onChange={(event) =>
                      setNewReservation((prev) => ({
                        ...prev,
                        whatsapp: event.target.value,
                      }))
                    }
                    placeholder="+54 9 11 1234 5678"
                  />
                </label>
                <label className="form-field">
                  <span className="field-label">Servicio</span>
                  <select
                    className="select-input"
                    value={newReservation.serviceId}
                    onChange={(event) =>
                      setNewReservation((prev) => ({
                        ...prev,
                        serviceId: event.target.value,
                        time: "",
                      }))
                    }
                  >
                    {services.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="form-field">
                  <span className="field-label">Horario</span>
                  <select
                    className="select-input"
                    value={newReservation.time}
                    onChange={(event) =>
                      setNewReservation((prev) => ({
                        ...prev,
                        time: event.target.value,
                      }))
                    }
                  >
                    <option value="">Seleccionar horario</option>
                    {getAvailableTimes(
                      adminSelectedDate,
                      newReservation.serviceId,
                      services.find((item) => item.id === newReservation.serviceId)
                        ?.name
                    ).map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button
                className="primary-button"
                type="button"
                onClick={handleCreateReservation}
                disabled={
                  adminCreateLoading ||
                  !newReservation.name.trim() ||
                  !newReservation.whatsapp.trim() ||
                  !newReservation.serviceId ||
                  !newReservation.time
                }
              >
                {adminCreateLoading ? "Guardando..." : "Guardar reserva"}
              </button>
            </section>
          )}

          <button
            className={`admin-menu-toggle ${adminMenuOpen ? "is-open" : ""}`}
            type="button"
            aria-label={adminMenuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setAdminMenuOpen((open) => !open)}
          >
            <span
              className={`menu-icon ${adminMenuOpen ? "" : "visible"}`}
              aria-hidden="true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="M64 160C64 142.3 78.3 128 96 128L480 128C497.7 128 512 142.3 512 160C512 177.7 497.7 192 480 192L96 192C78.3 192 64 177.7 64 160zM128 320C128 302.3 142.3 288 160 288L544 288C561.7 288 576 302.3 576 320C576 337.7 561.7 352 544 352L160 352C142.3 352 128 337.7 128 320zM512 480C512 497.7 497.7 512 480 512L96 512C78.3 512 64 497.7 64 480C64 462.3 78.3 448 96 448L480 448C497.7 448 512 462.3 512 480z" />
              </svg>
            </span>
            <span
              className={`menu-icon ${adminMenuOpen ? "visible" : ""}`}
              aria-hidden="true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="M504.6 148.5C515.9 134.9 514.1 114.7 500.5 103.4C486.9 92.1 466.7 93.9 455.4 107.5L320 270L184.6 107.5C173.3 93.9 153.1 92.1 139.5 103.4C125.9 114.7 124.1 134.9 135.4 148.5L278.3 320L135.4 491.5C124.1 505.1 125.9 525.3 139.5 536.6C153.1 547.9 173.3 546.1 184.6 532.5L320 370L455.4 532.5C466.7 546.1 486.9 547.9 500.5 536.6C514.1 525.3 515.9 505.1 504.6 491.5L361.7 320L504.6 148.5z" />
              </svg>
            </span>
          </button>

          {adminMenuOpen && (
            <div className="admin-menu-panel" role="menu">
              <button className="filter-chip" type="button" onClick={openStats}>
                Estadísticas
              </button>
              <button className="filter-chip" type="button" onClick={openServices}>
                Administrar servicios
              </button>
              <button
                className={`filter-chip ${
                  adminFilter === "all" ? "active" : ""
                }`}
                type="button"
                onClick={() => setAdminFilter("all")}
              >
                Todas
              </button>
              <button
                className={`filter-chip ${
                  adminFilter === "pending" ? "active" : ""
                }`}
                type="button"
                onClick={() => setAdminFilter("pending")}
              >
                Pendientes
              </button>
              <button
                className={`filter-chip ${
                  adminFilter === "approved" ? "active" : ""
                }`}
                type="button"
                onClick={() => setAdminFilter("approved")}
              >
                Aprobadas
              </button>
              <button
                className={`filter-chip ${
                  adminFilter === "rejected" ? "active" : ""
                }`}
                type="button"
                onClick={() => setAdminFilter("rejected")}
              >
                Rechazadas
              </button>
              <button
                className={`filter-chip ${
                  adminFilter === "completed" ? "active" : ""
                }`}
                type="button"
                onClick={() => setAdminFilter("completed")}
              >
                Completadas
              </button>
              <button
                className="add-chip"
                type="button"
                onClick={startCreateReservation}
              >
                + Agregar
              </button>
            </div>
          )}
        </section>
      </main>
    );
  }

  if (screen === "home") {
    return (
      <main className="landing-screen">
        <section className="landing-panel" aria-label="Inicio">
          <header className="landing-header">
            <button
              className="share-button"
              type="button"
              onClick={handleShareApp}
            >
              Compartir App
            </button>
            <button
              className="share-icon"
              type="button"
              aria-label="Compartir app"
              onClick={handleShareApp}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true">
                <path d="M448 256C501 256 544 213 544 160C544 107 501 64 448 64C395 64 352 107 352 160C352 165.4 352.5 170.8 353.3 176L223.6 248.1C206.7 233.1 184.4 224 160 224C107 224 64 267 64 320C64 373 107 416 160 416C184.4 416 206.6 406.9 223.6 391.9L353.3 464C352.4 469.2 352 474.5 352 480C352 533 395 576 448 576C501 576 544 533 544 480C544 427 501 384 448 384C423.6 384 401.4 393.1 384.4 408.1L254.7 336C255.6 330.8 256 325.5 256 320C256 314.5 255.5 309.2 254.7 304L384.4 231.9C401.3 246.9 423.6 256 448 256z" />
              </svg>
            </button>
          </header>
          <div className="landing-profile">
            <div className="logo-badge landing-logo">
              <span>Logo</span>
            </div>
            <div className="landing-title">
              <p className="company-name">Nombre Empresa</p>
              <p className="landing-subtitle">Nombre de servicios prestados</p>
            </div>
            <div className="landing-socials">
              {socialLinks.map((link) => {
                const Icon = socialIconByLabel[link.label];
                return (
                  <a
                    key={link.label}
                    className="social-pill"
                    href={link.href}
                    aria-label={link.label}
                  >
                    {Icon ? <Icon /> : null}
                  </a>
                );
              })}
            </div>
          </div>
          <div className="landing-actions">
            <button
              className="landing-pill"
              type="button"
              onClick={startBooking}
            >
              <span className="pill-icon" aria-hidden="true">
                <CalendarIcon />
              </span>
              <span>Reservar Turno</span>
            </button>
            {actionLinks.map((link) => {
              const Icon = link.Icon;
              return (
                <a key={link.label} className="landing-pill" href={link.href}>
                  <span className="pill-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>
          <div className="landing-footer">
            <a className="landing-pill" href={whatsappAction.href}>
              <span className="pill-icon" aria-hidden="true">
                <WhatsappButtonIcon />
              </span>
              <span>{whatsappAction.label}</span>
            </a>
          </div>
        </section>
      </main>
    );
  }

  if (screen === "services") {
    return (
      <main className="booking-screen">
        <section className="booking-panel" aria-label="Servicios disponibles">
          <Stepper current={getStepIndex("services")} />
          <header className="flow-header">
            <button
              className="icon-button"
              type="button"
              aria-label="Volver"
              onClick={() => setScreen("home")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M15 6l-6 6 6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div>
              <p className="flow-title">Servicios de estética</p>
              <p className="flow-subtitle">
                Elegí el servicio que querés reservar.
              </p>
            </div>
          </header>

          {servicesLoading && (
            <p className="helper-text">Cargando servicios...</p>
          )}
          {servicesError && <p className="inline-error">{servicesError}</p>}
          {!servicesLoading && services.length === 0 ? (
            <p className="empty-state">No hay servicios disponibles.</p>
          ) : (
            <div className="service-list">
              {services.map((item) => {
                const isSelected = item.id === selectedService;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`service-card${isSelected ? " selected" : ""}`}
                    onClick={() => {
                      setSelectedService(item.id);
                      setSelectedDate("");
                      setSelectedTime("");
                    }}
                  >
                    <div>
                      <p className="service-name">{item.name}</p>
                      <p className="service-meta">{item.duration}</p>
                    </div>
                    <span className="service-price">
                      {formatMoney(item.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <button
            className="primary-button"
            type="button"
            disabled={!selectedService}
            onClick={() => setScreen("date")}
          >
            Continuar
          </button>
        </section>
      </main>
    );
  }

  if (screen === "date") {
    const monthStart = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      1
    );
    const today = new Date();
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const isPrevDisabled = monthStart <= minMonth;
    const allowedDays = getServiceDays(service?.id, service?.name);

    return (
      <main className="booking-screen">
        <section className="booking-panel" aria-label="Seleccionar fecha">
          <Stepper current={getStepIndex("date")} />
          <header className="flow-header">
            <button
              className="icon-button"
              type="button"
              aria-label="Volver"
              onClick={() => setScreen("services")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M15 6l-6 6 6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div>
              <p className="flow-title">Seleccioná fecha</p>
              <p className="flow-subtitle">
                Servicio: <strong>{service?.name}</strong>
              </p>
            </div>
          </header>

          <div className="date-field">
            <span className="field-label">Elegí un día disponible</span>
            <div className="calendar">
              <div className="calendar-header">
                <button
                  className="icon-button calendar-nav"
                  type="button"
                  aria-label="Mes anterior"
                  disabled={isPrevDisabled}
                  onClick={() =>
                    setCalendarMonth(
                      (current) =>
                        new Date(
                          current.getFullYear(),
                          current.getMonth() - 1,
                          1
                        )
                    )
                  }
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M15 6l-6 6 6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <p className="calendar-month">
                  {months[calendarMonth.getMonth()]}{" "}
                  {calendarMonth.getFullYear()}
                </p>
                <button
                  className="icon-button calendar-nav"
                  type="button"
                  aria-label="Mes siguiente"
                  onClick={() =>
                    setCalendarMonth(
                      (current) =>
                        new Date(
                          current.getFullYear(),
                          current.getMonth() + 1,
                          1
                        )
                    )
                  }
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M9 6l6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="calendar-weekdays">
                {weekdays.map((day) => (
                  <span key={day} className="calendar-weekday">
                    {day}
                  </span>
                ))}
              </div>
              <div className="calendar-grid">
                {buildCalendarDays(calendarMonth, allowedDays).map((cell) => {
                  if (cell.empty) {
                    return (
                      <span key={cell.key} className="calendar-cell empty" />
                    );
                  }
                  return (
                    <button
                      key={cell.key}
                      type="button"
                      className={`calendar-cell${
                        selectedDate === cell.iso ? " selected" : ""
                      }`}
                      disabled={cell.disabled}
                      onClick={() => {
                        setSelectedDate(cell.iso);
                        setSelectedTime("");
                      }}
                    >
                      {cell.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="helper-text">
            Días disponibles: {formatDayLabels(allowedDays)} · 10:00 a 20:00.
          </p>

          <button
            className="primary-button"
            type="button"
            disabled={!selectedDate}
            onClick={() => setScreen("time")}
          >
            Continuar
          </button>
        </section>
      </main>
    );
  }

  if (screen === "time") {
    const bookedTimes = getBookedTimes(
      selectedDate,
      service?.id,
      service?.name
    );
    const visibleTimes = getServiceAvailability(service?.id, service?.name);

    return (
      <main className="booking-screen">
        <section className="booking-panel" aria-label="Seleccionar horario">
          <Stepper current={getStepIndex("time")} />
          <header className="flow-header">
            <button
              className="icon-button"
              type="button"
              aria-label="Volver"
              onClick={() => setScreen("date")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M15 6l-6 6 6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div>
              <p className="flow-title">Elegí un horario</p>
              <p className="flow-subtitle">
                {formatDate(selectedDate)} · <strong>{service?.name}</strong>
              </p>
            </div>
          </header>

          <div className="time-grid">
            {visibleTimes.map((time) => (
              <button
                key={time}
                type="button"
                className={`time-slot${
                  selectedTime === time ? " selected" : ""
                }`}
                disabled={bookedTimes.includes(time)}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>

          <button
            className="primary-button"
            type="button"
            disabled={!selectedTime}
            onClick={() => setScreen("contact")}
          >
            Continuar
          </button>
        </section>
      </main>
    );
  }

  if (screen === "contact") {
    return (
      <main className="booking-screen">
        <section
          className="booking-panel contact-panel"
          aria-label="Datos de contacto"
        >
          <Stepper current={getStepIndex("contact")} />
          <header className="flow-header">
            <button
              className="icon-button"
              type="button"
              aria-label="Volver"
              onClick={() => setScreen("time")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M15 6l-6 6 6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div>
              <p className="flow-title">Datos de contacto</p>
              <p className="flow-subtitle">
                El administrador se comunicará por WhatsApp.
              </p>
            </div>
          </header>

          <div className="contact-card">
            <label className="form-field">
              <span className="field-label">Nombre y apellido</span>
              <input
                className="text-input"
                type="text"
                placeholder="Ej: Martina Gomez"
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
              />
            </label>

            <label className="form-field">
              <span className="field-label">WhatsApp</span>
              <input
                className="text-input"
                type="tel"
                placeholder="+54 9 11 1234 5678"
                value={contactWhatsapp}
                onChange={(event) => setContactWhatsapp(event.target.value)}
              />
            </label>
          </div>

          <button
            className="primary-button"
            type="button"
            disabled={!contactName || !contactWhatsapp}
            onClick={() => setScreen("payment")}
          >
            Continuar a pago
          </button>
        </section>
      </main>
    );
  }

  if (screen === "thanks") {
    return (
      <main className="booking-screen">
        <section className="booking-panel" aria-label="Reserva confirmada">
          <Stepper current={getStepIndex("thanks")} />
          <header className="flow-header">
            <button
              className="icon-button"
              type="button"
              aria-label="Volver"
              onClick={() => setScreen("payment")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M15 6l-6 6 6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div>
              <p className="flow-title">Gracias por reservar</p>
              <p className="flow-subtitle">
                Te esperamos. Si pagás por transferencia, compartí el
                comprobante.
              </p>
            </div>
          </header>

          <div className="summary-card">
            <div>
              <p className="summary-label">Servicio</p>
              <p className="summary-value">{service?.name}</p>
            </div>
            <div>
              <p className="summary-label">Fecha</p>
              <p className="summary-value">{formatDate(selectedDate)}</p>
            </div>
            <div>
              <p className="summary-label">Horario</p>
              <p className="summary-value">{selectedTime}</p>
            </div>
            <div>
              <p className="summary-label">ID de reserva</p>
              <p className="summary-value">{reservationId || "-"}</p>
            </div>
          </div>

          <div className="payment-card">
            <p className="summary-label">Medios de pago</p>
            <button className="mp-button" type="button">
              <span className="mp-logo" aria-hidden="true">
                MP
              </span>
              <span>Mercado Pago</span>
            </button>
            <p className="payment-note">
              Te redirigimos a la app de Mercado Pago para completar el pago.
            </p>
            <div className="alias-block">
              <p className="summary-label">Alias para transferencia</p>
              <div className="alias-row">
                <span className="alias-text">{transferAlias}</span>
                <button
                  className="copy-button"
                  type="button"
                  onClick={handleCopyAlias}
                >
                  {aliasCopied ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>
          </div>

          <a
            className="primary-button"
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
          >
            Compartir comprobante por WhatsApp
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="booking-screen">
      <section className="booking-panel" aria-label="Pago de seña">
        <Stepper current={getStepIndex("payment")} />
        <header className="flow-header">
          <button
            className="icon-button"
            type="button"
            aria-label="Volver"
            onClick={() => setScreen("contact")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 6l-6 6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div>
            <p className="flow-title">Pago de seña</p>
            <p className="flow-subtitle">Confirmá tu turno y pagá el 50%.</p>
          </div>
        </header>

        <div className="summary-card">
          <div>
            <p className="summary-label">Servicio</p>
            <p className="summary-value">{service?.name}</p>
          </div>
          <div>
            <p className="summary-label">Fecha</p>
            <p className="summary-value">{formatDate(selectedDate)}</p>
          </div>
          <div>
            <p className="summary-label">Horario</p>
            <p className="summary-value">{selectedTime}</p>
          </div>
          <div>
            <p className="summary-label">Seña 50%</p>
            <p className="summary-value">{formatMoney(deposit)}</p>
          </div>
          <div>
            <p className="summary-label">Contacto</p>
            <p className="summary-value">
              {contactName} · {contactWhatsapp}
            </p>
          </div>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={handleStartReservation}
          disabled={isSubmittingReservation}
        >
          {isSubmittingReservation ? "Guardando..." : "Iniciar reserva"}
        </button>
        {submitError && <p className="inline-error">{submitError}</p>}
      </section>
    </main>
  );
}

export default App;
