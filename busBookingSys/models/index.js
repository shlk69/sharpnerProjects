// models/index.js
import User from "./usersModel.js";
import Booking from "./bookingModel.js";
import Bus from "./busesModel.js";

User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Bus.hasMany(Booking, { foreignKey: 'busId' });
Booking.belongsTo(Bus, { foreignKey: 'busId' });

export { User, Bus, Booking };