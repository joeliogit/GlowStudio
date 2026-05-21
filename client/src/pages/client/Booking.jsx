import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar } from 'lucide-react';
import BookingForm from '../../components/booking/BookingForm.jsx';
import Button from '../../components/common/Button.jsx';

export default function Booking() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="page-wrapper">
        <section className="section">
          <div className="container-app max-w-md mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-gray-800 mb-2">¡Cita agendada!</h2>
                <p className="text-gray-500">
                  Recibirás un correo de confirmación y un recordatorio el día anterior.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button onClick={() => navigate('/my-bookings')}>Ver mis citas</Button>
                <Button variant="ghost" onClick={() => setSuccess(false)}>
                  Agendar otra cita
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section className="bg-gradient-hero py-12 md:py-16">
        <div className="container-app text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 text-pink-600 mb-3">
              <Calendar className="w-5 h-5" />
              <span className="font-medium text-sm">Nueva cita</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-800">
              Agenda tu Cita
            </h1>
            <p className="text-gray-500 mt-2">Elige tu servicio, estilista y el horario que más te convenga.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container-app max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-pink-100 shadow-card p-6 md:p-8"
          >
            <BookingForm onSuccess={() => setSuccess(true)} />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
