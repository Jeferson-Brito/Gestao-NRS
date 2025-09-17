import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import EventoForm from './EventoForm';
import EventDetailsModal from './EventDetailsModal';
import AllEventsModal from './AllEventsModal';

const CalendarComponent = ({ analistas, eventos, feriados, onAddEvent, onEditEvent, onDeleteEvent, user, showToastMessage }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEventoFormOpen, setIsEventoFormOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAllEventsModalOpen, setIsAllEventsModalOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  
  const isUserAdmin = user && user.role === 'admin';

  useEffect(() => {
    renderCalendar();
  }, [currentDate, eventos]);

  const renderCalendar = () => {
    const MESES_PT = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const lastDay = lastDayOfMonth.getDate();
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    const today = new Date();

    const days = [];

    // Dias do mês anterior
    for (let i = firstDayOfWeek; i > 0; i--) {
      days.push({
        day: prevMonthLastDay - i + 1,
        isOtherMonth: true,
      });
    }

    // Dias do mês atual
    for (let i = 1; i <= lastDay; i++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const eventosDoDia = eventos.filter(evento => evento.data === dateString);
      const isToday = i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      const isHoliday = feriados.find(f => f.mes === currentMonth && f.dia === i);

      days.push({
        day: i,
        isOtherMonth: false,
        isToday,
        isHoliday,
        events: eventosDoDia,
        date: dateString,
      });
    }

    // Dias do próximo mês
    const totalCells = days.length;
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        isOtherMonth: true,
      });
    }
    
    return (
        <>
            <div className="page-header">
                <h1 className="page-title"><i className="fa-solid fa-calendar-check"></i> Calendário</h1>
                <div className="page-controls">
                    <div className="calendar-nav">
                        <button id="prev-month" className="btn" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}><i className="fa-solid fa-chevron-left"></i></button>
                        <h2 id="month-year" className="month-year">{MESES_PT[currentMonth]} {currentYear}</h2>
                        <button id="next-month" className="btn" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}><i className="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>
                <div className="page-actions">
                    <button id="btn-all-events" className="btn" onClick={() => setIsAllEventsModalOpen(true)}><i className="fa-solid fa-list-ul"></i></button>
                    <button id="btn-add-event" className="btn primary" onClick={() => setIsEventoFormOpen(true)}><i className="fa-solid fa-plus-circle"></i></button>
                </div>
            </div>
            <div className="calendar-container">
                <div className="weekdays">
                    <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
                </div>
                <div className="calendar-grid">
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={`day-cell ${day.isOtherMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''}`}
                            onClick={() => {
                                if (!day.isOtherMonth) {
                                    if (day.events.length > 0) {
                                        setSelectedDateEvents(day.events);
                                        setIsDetailsModalOpen(true);
                                    } else {
                                        onAddEvent({ data: day.date });
                                    }
                                }
                            }}
                        >
                            <span className="day-number">{day.day}</span>
                            {day.isHoliday && <span className="holiday-name">{day.isHoliday.nome}</span>}
                            {day.events && (
                                <div className="event-list">
                                    {day.events.map((event, eventIndex) => (
                                        <div key={eventIndex} className="event-card-small">
                                            <i className="fa-solid fa-bell"></i> {event.horaInicio} - {event.analistaOutros || (analistas.find(a => a.id === event.analistaId)?.nome || 'Desconhecido')}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Modal show={isEventoFormOpen} onClose={() => setIsEventoFormOpen(false)}>
                <EventoForm 
                    analistas={analistas}
                    onSave={onAddEvent}
                    onCancel={() => setIsEventoFormOpen(false)}
                />
            </Modal>

            <Modal show={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}>
                <EventDetailsModal events={selectedDateEvents} analistas={analistas} onEdit={onEditEvent} onDelete={onDeleteEvent} user={user} />
            </Modal>

            <Modal show={isAllEventsModalOpen} onClose={() => setIsAllEventsModalOpen(false)}>
                <AllEventsModal events={eventos} analistas={analistas} onEdit={isUserAdmin ? onEditEvent : null} onDelete={isUserAdmin ? onDeleteEvent : null} />
            </Modal>
        </>
    );
  };

  return renderCalendar();
};

export default CalendarComponent;