import { useEffect, useState } from "react";
import "./App.css";

const contactLinks = [
  { label: "Sitio Web", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "WhatsApp", href: "#" },
];

const services = [
  { id: "limpieza", name: "Limpieza facial", duration: "45 min", price: 18000 },
  {
    id: "masajes",
    name: "Masajes relajantes",
    duration: "60 min",
    price: 22000,
  },
  { id: "cejas", name: "Diseño de cejas", duration: "30 min", price: 12000 },
  { id: "manos", name: "Manicura spa", duration: "50 min", price: 15000 },
];

const buildTimeSlots = () => {
  const slots = [];
  for (let hour = 10; hour <= 20; hour += 1) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
  }
  return slots;
};

const timeSlots = buildTimeSlots().map((time, index) => ({
  time,
  available: index % 5 !== 0,
}));

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

const isBusinessDay = (value) => {
  if (!value) return false;
  const day = new Date(`${value}T00:00:00`).getDay();
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

const buildCalendarDays = (monthDate) => {
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
    const disabled = date < today || !isBusinessDay(iso);
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

const loadReservations = () => {
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
  const [reservations, setReservations] = useState(() => loadReservations());
  const [adminFilter, setAdminFilter] = useState("all");
  const [showCreateReservation, setShowCreateReservation] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [newReservation, setNewReservation] = useState(() => ({
    name: "",
    whatsapp: "",
    service: services[0]?.name || "",
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

  const getBookedTimes = (date, serviceName, excludeId) => {
    if (!date || !serviceName) return [];
    return reservations
      .filter(
        (reservation) =>
          (reservation.status === "approved" ||
            reservation.status === "pending") &&
          reservation.date === date &&
          reservation.service === serviceName &&
          reservation.id !== excludeId
      )
      .map((reservation) => reservation.time);
  };

  const getAvailableTimes = (date, serviceName, excludeId) => {
    const bookedTimes = getBookedTimes(date, serviceName, excludeId);
    return timeSlots
      .filter((slot) => slot.available && !bookedTimes.includes(slot.time))
      .map((slot) => slot.time);
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      "turnos_reservations",
      JSON.stringify(reservations)
    );
  }, [reservations]);

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
    setScreen("services");
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

  const handleStartReservation = () => {
    const newReservationId = reservationId || generateReservationId();
    const newReservation = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}`,
      name: contactName.trim(),
      whatsapp: contactWhatsapp.trim(),
      service: service?.name || "Servicio",
      date: selectedDate,
      time: selectedTime,
      status: "pending",
      reservationId: newReservationId,
    };
    setReservationId(newReservationId);
    setReservations((prev) => [...prev, newReservation]);
    setScreen("thanks");
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

  const updateReservationStatus = (id, status) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === id ? { ...reservation, status } : reservation
      )
    );
  };

  const startCreateReservation = () => {
    setNewReservation({
      name: "",
      whatsapp: "",
      service: services[0]?.name || "",
      time: "",
    });
    setShowCreateReservation(true);
  };

  const handleCreateReservation = () => {
    if (
      !newReservation.name.trim() ||
      !newReservation.whatsapp.trim() ||
      !newReservation.service ||
      !newReservation.time
    ) {
      return;
    }
    const reservationId = generateReservationId();
    const created = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}`,
      name: newReservation.name.trim(),
      whatsapp: newReservation.whatsapp.trim(),
      service: newReservation.service,
      date: adminSelectedDate,
      time: newReservation.time,
      status: "pending",
      reservationId,
    };
    setReservations((prev) => [...prev, created]);
    setShowCreateReservation(false);
  };

  const startReschedule = (reservation) => {
    setRescheduleId(reservation.id);
    setRescheduleTime(reservation.time);
  };

  const applyReschedule = () => {
    if (!rescheduleId || !rescheduleTime) return;
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
    const pendingCount = reservations.filter(
      (reservation) => reservation.status === "pending"
    ).length;

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

    return (
      <main className="admin-screen">
        <section className="admin-panel" aria-label="Panel de reservas">
          <header className="admin-topbar">
            <div>
              <p className="flow-title">Reservas</p>
              <p className="flow-subtitle">
                Pendientes: <strong>{pendingCount}</strong>
              </p>
            </div>
            <button
              className="secondary-button outline"
              type="button"
              onClick={handleAdminLogout}
            >
              Cerrar sesión
            </button>
          </header>

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
                    value={newReservation.service}
                    onChange={(event) =>
                      setNewReservation((prev) => ({
                        ...prev,
                        service: event.target.value,
                        time: "",
                      }))
                    }
                  >
                    {services.map((item) => (
                      <option key={item.id} value={item.name}>
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
                      newReservation.service
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
                  !newReservation.name.trim() ||
                  !newReservation.whatsapp.trim() ||
                  !newReservation.service ||
                  !newReservation.time
                }
              >
                Guardar reserva
              </button>
            </section>
          )}

          <button
            className="admin-menu-toggle"
            type="button"
            aria-label="Abrir menú"
            onClick={() => setAdminMenuOpen((open) => !open)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true">
              <path d="M64 160C64 142.3 78.3 128 96 128L480 128C497.7 128 512 142.3 512 160C512 177.7 497.7 192 480 192L96 192C78.3 192 64 177.7 64 160zM128 320C128 302.3 142.3 288 160 288L544 288C561.7 288 576 302.3 576 320C576 337.7 561.7 352 544 352L160 352C142.3 352 128 337.7 128 320zM512 480C512 497.7 497.7 512 480 512L96 512C78.3 512 64 497.7 64 480C64 462.3 78.3 448 96 448L480 448C497.7 448 512 462.3 512 480z" />
            </svg>
          </button>

          {adminMenuOpen && (
            <div className="admin-menu-panel" role="menu">
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
          <div className="logo-badge">
            <span>Logo</span>
          </div>
          <div className="landing-actions">
            <button
              className="landing-pill"
              type="button"
              onClick={startBooking}
            >
              Reservar Turno
            </button>
            {contactLinks.map((link) => (
              <a key={link.label} className="landing-pill" href={link.href}>
                {link.label}
              </a>
            ))}
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
                {buildCalendarDays(calendarMonth).map((cell) => {
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
            Horarios disponibles de lunes a sábado, 10:00 a 20:00.
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
    const bookedTimes = getBookedTimes(selectedDate, service?.name);

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
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                className={`time-slot${
                  selectedTime === slot.time ? " selected" : ""
                }`}
                disabled={!slot.available || bookedTimes.includes(slot.time)}
                onClick={() => setSelectedTime(slot.time)}
              >
                {slot.time}
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
        >
          Iniciar reserva
        </button>
      </section>
    </main>
  );
}

export default App;
