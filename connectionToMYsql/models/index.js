import Students from "./studentsModel.js";
import IdentityCard from "./identityCard.js";
import department from "./department.js";

// One to one
Students.hasOne(IdentityCard)
IdentityCard.belongsTo(Students)


// one to many
department.hasMany(Students)
Students.belongsTo(department)


export default {
    Students,
    IdentityCard
}