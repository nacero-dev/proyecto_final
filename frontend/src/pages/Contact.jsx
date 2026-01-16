// Página de Contacto
// Permite a usuarios (visores o admin) contactar a ventas

import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Email del administrador que recibirá los mensajes Email (mailto) 
const ADMIN_EMAIL = "nicolas.acero91@alumnos.cei.es";

// WhatsApp del administrador WhatsApp (wa.me)
const ADMIN_WHATSAPP = "34645474963";

const Contact = () => {
  const navigate = useNavigate();

  // useSearchParams permite leer query strings de la URL (ej. /contact?vehicle=Ferrari%20Enzo&id=123)
  const [searchParams] = useSearchParams();

  // Los query params son pares clave=valor que van después del signo "?" y sirven para enviar datos extra en la ruta
  // sin cambiar el path Ej: /contact?vehicle=Ferrari%20Enzo&id=123  es vehicle="Ferrari Enzo", id="123"ç
  // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams


  // Datos del vehículo (vienen desde ProductsList/ProductDetail) 
  const vehicleName = searchParams.get("vehicle") || "";
  const vehicleId = searchParams.get("id") || "";

  // Email del usuario guardado al iniciar sesión
  const savedUserEmail = localStorage.getItem("userEmail") || "";

  // Estado del formulario (inputs controlados)
  // El email se precarga desde localStorage para no pedirlo otra vez (el usuario lo podrá editar en su caso)
  const [form, setForm] = useState({
    name: "",
    email: savedUserEmail,
    message: "",
  });

  // Construcción del texto base del mensaje (se usa para email y WhatsApp)
  // Texto con saltos de línea \n para que se vea ordenado en email o WhatsApp
  // https://support.wati.io/en/articles/11462980-how-to-create-whatsapp-click-to-chat-links
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent

  const messageText = useMemo(() => {
    return (
      `Hola,\n\n` +
      `Estoy interesado en el siguiente vehículo:\n` +
      `- Vehículo: ${vehicleName || "-"}\n` +
      `- ID: ${vehicleId || "-"}\n\n` +
      `Datos de contacto:\n` +
      `- Nombre: ${form.name || "-"}\n` +
      `- Email: ${form.email || "-"}\n\n` +
      `Mensaje:\n${form.message || "-"}\n\n` +
      `Gracias`
    );
  }, [vehicleName, vehicleId, form.name, form.email, form.message]); // en caso de no poner info se pone "-"

  // Enlace mailto, se traen los datos del vehiculo en cuestion vehicleName, vehicleId
  const mailtoHref = useMemo(() => {
    const subject = `Interés en vehículo: ${vehicleName || "SuperAutos"}${vehicleId ? ` (ID: ${vehicleId})` : ""
      }`;

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(messageText);

    //encodeURIComponent() sirve para convertir texto normal a un formato “seguro” para ponerlo dentro de una URL (como mailto: o https://wa.me/...). 
    // Si no se usa los caracteres especiales pueden romper la URL o hacer que el mensaje llegue mal interpretado

    return `mailto:${ADMIN_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;
  }, [vehicleName, vehicleId, messageText]);

  //? indica el comienzo de los parametros
  //& separa parametros (subject y body)

  // Enlace WhatsApp (wa.me) 
  const whatsappHref = useMemo(() => {
    const encodedText = encodeURIComponent(messageText);
    return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedText}`;
  }, [messageText]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // Formulario de contacto

  return (

    <div className="container mt-4">
      <h2 className="mb-3 text-center">Contacto</h2>
      <div className="card mx-auto" style={{ maxWidth: "720px" }}>
        <div className="card-body">
          <p className="text-muted mb-3">
            Agradecemos tu interés en el vehículo que se menciona a continuación, te pedimos llenar el formulario y en breve nos pondremos en contacto contigo.

          </p>

          {/* Detalle del vehiculo de interés */}

          {(vehicleName || vehicleId) && (
            <div className="alert alert-secondary">
              <strong>Vehículo:</strong> {vehicleName || "-"}
              {vehicleId && (
                <>
                  <br />
                  <strong>ID:</strong> {vehicleId}
                </>
              )}
            </div>
          )}

          {/* Campo Nombre*/}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Tu nombre</label>
              <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="Ej: Juan Perez" required />
            </div>

            {/* Campo Email*/}
            {/* El email se precarga desde localStorage (login) pero se deja editable por si se quiere dar mas informacion lo cual ayuda a campañas de marketing, o tener mas informacion del usuario*/}
            <div className="mb-3">
              <label className="form-label">Tu email</label>
              <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} placeholder="Ej: juan@email.com" required />
            </div>

            {/* Campo de Texto*/}
            <div className="mb-3">
              <label className="form-label">Mensaje</label>
              <textarea className="form-control" name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Ej: Me interesa este vehículo, ¿podemos agendar una visita?" required />
            </div>

            {/* Envio Correo (abre aplicacion de correo al dar click*/}

            <div className="d-flex gap-2 flex-wrap">
              <a href={mailtoHref} className="btn btn-primary">
                Enviar email
              </a>

              {/* Envio Whatsapp (abre página de Whatsapp en otra pagina*/}
              <a
                href={whatsappHref} className="btn btn-success" target="_blank" rel="noreferrer"
              >
                WhatsApp
              </a>

              {/* Boton de regreso a página anterior "-1"*/}
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}
              >
                Volver
              </button>

              <p className="text-muted mb-3">

                Nota: En caso de correo se abrirá aplicación de tu correo en caso de WhatsApp abrirá portal de WhatsApp.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;