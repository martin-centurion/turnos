import { useState } from "react";
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

function App() {
  const [screen, setScreen] = useState("home");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [contactName, setContactName] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [aliasCopied, setAliasCopied] = useState(false);

  const service = services.find((item) => item.id === selectedService) || null;
  const deposit = service ? service.price * 0.5 : 0;
  const transferAlias = "alias.demo.test";
  const whatsappNumber = "5490000000000";
  const whatsappMessage = encodeURIComponent(
    `Hola! Te envio el comprobante de mi reserva.\n\nServicio: ${
      service?.name || "-"
    }\nFecha: ${formatDate(selectedDate)}\nHorario: ${selectedTime}\nNombre: ${contactName}\nWhatsApp: ${contactWhatsapp}`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const startBooking = () => {
    setSelectedService(null);
    setSelectedDate("");
    setSelectedTime("");
    setCalendarMonth(new Date());
    setContactName("");
    setContactWhatsapp("");
    setAliasCopied(false);
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
    return (
      <main className="booking-screen">
        <section className="booking-panel" aria-label="Seleccionar horario">
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
                disabled={!slot.available}
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
          </div>

          <div className="payment-card">
            <p className="summary-label">Medios de pago</p>
            <a
              className="mp-button"
              href="https://www.mercadopago.com.ar/"
              target="_blank"
              rel="noreferrer"
            >
              <span className="mp-logo" aria-hidden="true">
                MP
              </span>
              <span>Mercado Pago</span>
            </a>
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
          onClick={() => setScreen("thanks")}
        >
          Iniciar reserva
        </button>
      </section>
    </main>
  );
}

export default App;
