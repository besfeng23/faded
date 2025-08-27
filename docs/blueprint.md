# **App Name**: Faded

## Core Features:

- Authentication and Global State: Use Firebase Auth (Phone + Google + Apple). App state: shopId, userId, role, authToken, activeBookingId. The backend base URL is an environment variable API_BASE_URL.
- LandingPage: Landing Page with Hero section ('Book your fade in 3 taps') and buttons: Book Now, View Services, Sign In
- ServicesPage: List services from /mock/services (for now). Each item shows name, duration, price, 'Select' -> BarberSelectPage
- BarberSelectPage: Grid of barbers with avatar, skills, rating. Selecting one goes to SlotPickerPage with serviceId + barberId
- SlotPickerPage: Calendar + timeslots (fetch via API_BASE_URL /v1/slots/query). Disable past times, gray out held/booked. Selecting a time -> SummaryPage
- SummaryPage: Show service, barber, time, price. TextArea notes. Button 'Confirm Booking' -> POST /v1/bookings/confirm. On success -> BookingSuccessPage
- BookingSuccessPage: QR code for check-in (bookingId payload). Buttons: Add to Calendar, Share, Rebook
- MyBookingsPage: My Bookings Page (Customer): Upcoming & Past tabs. Actions: Cancel (with policy), Rebook, 'I’m here' check-in trigger
- BarberDashboard: Today’s queue (cards: customer name, service, start time, status). Buttons: Start, Complete, No-Show. Quick Rebook last customer
- OwnerDashboard: Owner Dashboard: KPIs: revenue, utilization, tips. Barber leaderboard. Manage Services (CRUD). Manage Barbers (CRUD + schedule templates). Toggle Waitlist On/Off
- KioskCheckInPage: Kiosk Check-In Page: Scan QR or enter phone number. If booking in next 60 min -> Check in. Else prompt to join waitlist.
- WaitlistPage: Waitlist Page: Join form: service, preferred time window, phone. Status view: your position (approximate)
- SettingsPage: Settings Page: Notifications toggle, Saved payment methods (placeholder), Language
- Hairwax Products: Hairwax Products Page: List hairwax and styling products with details and purchase options.
- AI Brain: An active chat assistant who is an expert on faded barbershop who speaks Taglish or Tagalog with a friendly personality. Details from https://www.facebook.com/FadedBarbershopBfHomes/

## Style Guidelines:

- Clean cards, large tap targets, 16px base, 24px headings
- Primary actions sticky at bottom on mobile
- Dark mode support
- Color scheme: Black with green