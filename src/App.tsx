import { useState, useMemo } from 'react';
import { MonthSelector } from './components/MonthSelector';
import { EventList } from './components/EventList';
import { AddEventModal } from './components/AddEventModal';
import { StatusLabelSettings } from './components/StatusLabelSettings';
import { ThemeToggle } from './components/ThemeToggle';
import { Event, EventFormData, StatusLabel } from './types';
import { PlusCircle, Calculator, Settings, LogOut } from 'lucide-react';
import { useEvents } from './hooks/useEvents';
import { Toast, ToastMessage, ToastType } from './components/Toast';
import { useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { YearSelector } from './components/YearSelector';

export default function App() {
  const { user, logout } = useAuth();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showEarnings, setShowEarnings] = useState(false);
  const [statusLabels, setStatusLabels] = useState<StatusLabel[]>([
    { value: 'OK', label: 'OK' },
    { value: 'NOT_OK', label: 'NOT OK' },
    { value: 'OUTDOOR', label: 'OUTDOOR' },
    { value: 'OK_OUTDOOR', label: 'OK Outdoor' }
  ]);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const { events, loading, error, addEvent, updateEvent, deleteEvent } = useEvents(selectedYear, selectedMonth);

  const filteredEvents = useMemo(() => {
    // Events are already filtered by month/year from the hook
    let filtered = events;

    if (selectedStatus) {
      filtered = filtered.filter(event => event.status === selectedStatus);
    }

    return filtered;
  }, [selectedStatus, events]);

  if (!user) {
    return <Login />;
  }

  const calculateMonthSummary = (events: Event[]) => {
    // Events are already filtered by month/year
    const monthEvents = events;

    // Filter OK events (including OK_OUTDOOR)
    const okEvents = monthEvents.filter(
      event => event.status === 'OK' || event.status === 'OK_OUTDOOR'
    );

    const totalIncome = okEvents.reduce((sum, event) => sum + (event.price || 0), 0);
    const totalAdvance = okEvents.reduce((sum, event) => sum + (event.advancePayment || 0), 0);
    const totalPending = okEvents.reduce(
      (sum, event) => sum + ((event.price || 0) - (event.advancePayment || 0)),
      0
    );

    const totalMarketingCosts = okEvents.reduce((sum, event) => sum + (event.marketingCosts || 0), 0);
    const totalMaterialsCosts = okEvents.reduce(
      (sum, event) => sum + (event.otherCosts?.materials || 0),
      0
    );
    const totalTravelCosts = okEvents.reduce(
      (sum, event) => sum + (event.otherCosts?.travel || 0),
      0
    );
    const totalMiscCosts = okEvents.reduce(
      (sum, event) => sum + (event.otherCosts?.misc || 0),
      0
    );

    const totalCosts = totalMarketingCosts + totalMaterialsCosts + totalTravelCosts + totalMiscCosts;
    const netIncome = totalIncome - totalCosts;

    return {
      totalEvents: okEvents.length,
      totalIncome,
      totalAdvance,
      totalPending,
      totalMarketingCosts,
      totalMaterialsCosts,
      totalTravelCosts,
      totalMiscCosts,
      totalCosts,
      netIncome,
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  const handleSaveEvent = async (eventData: EventFormData) => {
    try {
      if (eventData.instagramId) {
        const existingEvent = events.find(
          e => e.instagramId === eventData.instagramId &&
            (!editingEvent || e.id !== editingEvent.id)
        );

        if (existingEvent) {
          showToast('An event with this Instagram ID already exists!', 'error');
          return;
        }
      }

      // Prepare the event data
      const preparedEventData = {
        ...eventData,
        status: eventData.status || 'OK',
        otherCosts: {
          materials: eventData.otherCosts?.materials || 0,
          travel: eventData.otherCosts?.travel || 0,
          misc: eventData.otherCosts?.misc || 0,
        },
      };

      if (eventData.date) {
        const dateObj = new Date(eventData.date);
        if (!editingEvent) {
          const selectedMonthDate = new Date(selectedYear,
            new Date(new Date().getFullYear(), monthNameToNumber(selectedMonth)).getMonth(),
            dateObj.getDate());
          preparedEventData.date = selectedMonthDate.toISOString();
        } else {
          preparedEventData.date = dateObj.toISOString();
        }
      }

      if (editingEvent) {
        await updateEvent(editingEvent.id, {
          ...editingEvent,
          ...preparedEventData,
        });
        showToast('Event updated successfully');
      } else {
        await addEvent(preparedEventData);
        showToast('Event added successfully');
      }

      setEditingEvent(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving event:', err);
      showToast('Error saving event. Please try again.', 'error');
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        if (selectedEvent?.id === eventId) {
          setSelectedEvent(null);
        }
        showToast('Event deleted successfully');
      } catch (err) {
        console.error('Error deleting event:', err);
        showToast('Error deleting event. Please try again.', 'error');
      }
    }
  };

  const handleSaveStatusLabels = (newLabels: StatusLabel[]) => {
    setStatusLabels(newLabels);
  };

  const monthNameToNumber = (monthName: string) => {
    return new Date(Date.parse(monthName + " 1, 2000")).getMonth();
  };

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mr-4">RealTime Caricatures</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Status settings"
                >
                  <Settings size={20} />
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => setShowEarnings(!showEarnings)}
                    className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-800/30 transition-colors"
                    aria-label="Calculate earnings"
                  >
                    <Calculator size={20} />
                  </button>
                )}
                <ThemeToggle />
                <button
                  onClick={logout}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
                  aria-label="Log out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <YearSelector
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
              />
              <MonthSelector
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
              />
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle size={20} className="mr-2" />
                Add Event
              </button>
            </div>
          </div>
          {showEarnings && user.role === 'admin' && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {selectedMonth} {statusLabels.find(l => l.value === 'OK')?.label} Events Summary
              </h2>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Price:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(calculateMonthSummary(events).totalIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Advance Payment:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(calculateMonthSummary(events).totalAdvance)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Pending Payment:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        {formatCurrency(calculateMonthSummary(events).totalPending)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Marketing Costs:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(calculateMonthSummary(events).totalMarketingCosts)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Materials:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(calculateMonthSummary(events).totalMaterialsCosts)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Travel:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(calculateMonthSummary(events).totalTravelCosts)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Miscellaneous:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(calculateMonthSummary(events).totalMiscCosts)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Net Revenue:</span>
                      <span className={`font-bold ${calculateMonthSummary(events).netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(calculateMonthSummary(events).netIncome)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <EventList
            events={filteredEvents}
            selectedEvent={selectedEvent}
            onEventSelect={setSelectedEvent}
            selectedStatus={selectedStatus}
            onStatusSelect={handleStatusSelect}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            statusLabels={statusLabels}
          />
        </div>
      </main>

      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        initialData={editingEvent || undefined}
        isEditing={!!editingEvent}
        statusLabels={statusLabels}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      <StatusLabelSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        statusLabels={statusLabels}
        onSave={handleSaveStatusLabels}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}