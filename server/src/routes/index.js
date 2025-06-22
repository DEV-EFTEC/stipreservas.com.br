import userRoutes from './user.routes.js';
import bookingRoutes from './booking.routes.js';
import roomRoutes from './room.routes.js';
import childrenRoutes from './children.routes.js';
import dependentsRoutes from './dependents.routes.js';
import guestsRoutes from './guests.routes.js';
import paymentsRoutes from './payment.routes.js';
import storageRoutes from './storage.routes.js';
import periodsRoutes from './periods.routes.js';
import auth from '#middlewares/auth.js';

export default (app) => {
    app.use('/users', userRoutes);
    app.use('/bookings', auth, bookingRoutes);
    app.use('/rooms', auth, roomRoutes);
    app.use('/children', auth, childrenRoutes);
    app.use('/dependents', auth, dependentsRoutes);
    app.use('/guests', auth, guestsRoutes);
    app.use('/payments', paymentsRoutes);
    app.use('/storage', auth, storageRoutes);
    app.use('/periods', auth, periodsRoutes);
}