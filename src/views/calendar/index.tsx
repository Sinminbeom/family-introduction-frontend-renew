import React from 'react';

// material-ui
import { Button, Dialog, Theme, useMediaQuery } from '@mui/material';

// third-party
import _ from 'lodash';
import FullCalendar, { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import CalendarStyled from './CalendarStyled';
import Toolbar from './Toolbar';
import AddEventForm from './AddEventForm';
import { DateRange } from 'types';
import useAuth from 'hooks/useAuth';

// assets
import AddAlarmTwoToneIcon from '@mui/icons-material/AddAlarmTwoTone';
import { FormikValues } from 'formik';

// ==============================|| APPLICATION CALENDAR ||============================== //

const Calendar = () => {
    const calendarRef = React.useRef<FullCalendar>(null);
    const matchSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const { user: myUser } = useAuth();

    // fetch events data
    const [events, setEvents] = React.useState<FormikValues[]>([]);
    const getEvents = async () => {
        const getCalendars = await fetch(`${process.env.REACT_APP_API_URL}/calendar/${myUser?.id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const results = await getCalendars.json();
        if (results.status === 200) {
            setEvents(results.data);
        } else if (results.status !== 200) {
            console.log('실패');
        }
    };

    React.useEffect(() => {
        getEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [date, setDate] = React.useState(new Date());
    const [view, setView] = React.useState(matchSm ? 'listWeek' : 'dayGridMonth');

    // calendar toolbar events
    const handleDateToday = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.today();
            setDate(calendarApi.getDate());
        }
    };

    const handleViewChange = (newView: string) => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.changeView(newView);
            setView(newView);
        }
    };

    const handleDatePrev = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.prev();
            setDate(calendarApi.getDate());
        }
    };

    const handleDateNext = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.next();
            setDate(calendarApi.getDate());
        }
    };

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedRange, setSelectedRange] = React.useState<DateRange | null>(null);
    const [selectedEvent, setSelectedEvent] = React.useState<FormikValues | null>(null);

    // calendar event select/add/edit/delete
    const handleRangeSelect = (arg: DateSelectArg) => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.unselect();
        }

        setSelectedRange({
            start: arg.start,
            end: arg.end
        });
        setIsModalOpen(true);
    };

    const handleEventSelect = (arg: EventClickArg) => {
        if (arg.event.id) {
            const selectEvent = events.find((_event: FormikValues) => _event.id === Number(arg.event.id));
            setSelectedEvent(selectEvent as FormikValues[]);
        } else {
            setSelectedEvent(null);
        }
        setIsModalOpen(true);
    };

    const handleEventUpdate = async ({ event }: EventResizeDoneArg | EventDropArg) => {
        try {
            const newEvent1 = events.find((_event) => _event.id === Number(event.id));
            const newEvent2 = {
                id: event.id,
                title: newEvent1?.title,
                description: newEvent1?.description,
                start: event.start,
                end: event.end,
                allDay: event.allDay,
                color: newEvent1?.color,
                textColor: newEvent1?.textColor,
                updateUserId: myUser?.id
            };
            console.log(newEvent2);
            const updateBoard = await fetch(`${process.env.REACT_APP_API_URL}/calendar/${event.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEvent2)
            });
            const results = await updateBoard.json();
            if (results.status === 200) {
                const newEvents = events.map((_event) =>
                    Number(_event.id) === results.data.id
                        ? {
                              id: _event.id,
                              title: results.data.title,
                              description: results.data.description,
                              start: results.data.start,
                              end: results.data.end,
                              allDay: results.data.allDay,
                              color: results.data.color,
                              textColor: results.data.textColor,
                              updateUserId: myUser?.id
                          }
                        : _event
                );
                setEvents(newEvents);
            } else if (results.status !== 200) {
                console.log('실패');
            }
            // const response = await axios.post('/api/calendar/events/update', {
            //     eventId: event.id,
            //     update: {
            //         allDay: event.allDay,
            //         start: event.start,
            //         end: event.end
            //     }
            // });
            // setEvents(response.data.events);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEventCreate = async (data: FormikValues) => {
        const createCalendar = await fetch(`${process.env.REACT_APP_API_URL}/calendar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: data.title,
                description: data.description,
                color: data.color,
                textColor: data.textColor,
                allDay: data.allDay,
                start: data.start,
                end: data.end,
                createUserId: myUser?.id,
                updateUserId: myUser?.id
            })
        });
        const results = await createCalendar.json();
        if (results.status === 200) {
            setEvents([...events, results.data]);
        } else if (results.status !== 200) {
            console.log('실패');
        }
        // const response = await axios.post('/api/calendar/events/new', data);

        // setEvents([...events, response.data.event]);
        handleModalClose();
    };

    const handleUpdateEvent = async (eventId: string, update: FormikValues) => {
        const updateBoard = await fetch(`${process.env.REACT_APP_API_URL}/calendar/${eventId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update)
        });
        const results = await updateBoard.json();
        if (results.status === 200) {
            const newEvents = events.map((event) =>
                Number(event.id) === results.data.id
                    ? {
                          id: event.id,
                          title: results.data.title,
                          description: results.data.description,
                          start: results.data.start,
                          end: results.data.end,
                          allDay: results.data.allDay,
                          color: results.data.color,
                          textColor: results.data.textColor,
                          updateUserId: myUser?.id
                      }
                    : event
            );
            setEvents(newEvents);
        } else if (results.status !== 200) {
            console.log('실패');
        }
        // const response = await axios.post('/api/calendar/events/update', {
        //     eventId,
        //     update
        // });
        // setEvents(response.data.events);
        handleModalClose();
    };

    const handleEventDelete = async (id: string) => {
        try {
            const deleteCalendar = await fetch(`${process.env.REACT_APP_API_URL}/calendar/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            const results = await deleteCalendar.json();
            if (results.status !== 200) {
                console.log('실패');
            }

            const newEvent = _.reject(events, { id });
            setEvents(newEvent);
            handleModalClose();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        setSelectedRange(null);
    };

    return (
        <MainCard
            title="캘린더"
            secondary={
                <Button color="secondary" variant="contained" onClick={handleAddClick}>
                    <AddAlarmTwoToneIcon fontSize="small" sx={{ mr: 0.75 }} />
                    일정 추가
                </Button>
            }
        >
            <CalendarStyled>
                <Toolbar
                    date={date}
                    view={view}
                    onClickNext={handleDateNext}
                    onClickPrev={handleDatePrev}
                    onClickToday={handleDateToday}
                    onChangeView={handleViewChange}
                />
                <SubCard>
                    <FullCalendar
                        weekends
                        editable
                        droppable
                        selectable
                        events={events}
                        ref={calendarRef}
                        rerenderDelay={10}
                        initialDate={date}
                        initialView={view}
                        dayMaxEventRows={3}
                        eventDisplay="block"
                        headerToolbar={false}
                        allDayMaintainDuration
                        eventResizableFromStart
                        select={handleRangeSelect}
                        eventDrop={handleEventUpdate}
                        eventClick={handleEventSelect}
                        eventResize={handleEventUpdate}
                        height={matchSm ? 'auto' : 720}
                        plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                    />
                </SubCard>
            </CalendarStyled>

            {/* Dialog renders its body even if not open */}
            <Dialog maxWidth="sm" fullWidth onClose={handleModalClose} open={isModalOpen} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
                {isModalOpen && (
                    <AddEventForm
                        event={selectedEvent}
                        range={selectedRange}
                        onCancel={handleModalClose}
                        handleDelete={handleEventDelete}
                        handleCreate={handleEventCreate}
                        handleUpdate={handleUpdateEvent}
                        userId={myUser?.id!}
                    />
                )}
            </Dialog>
        </MainCard>
    );
};

export default Calendar;
