import Students from "./studentsModel.js";
import IdentityCard from "./identityCard.js";
import department from "./department.js";
import Course from "./courses.js";
import StudentCourse from "./junction.js";


// One to one
Students.hasOne(IdentityCard)
IdentityCard.belongsTo(Students)


// one to many
department.hasMany(Students)
Students.belongsTo(department)


//many to many
Students.belongsToMany(Course, { through: StudentCourse })
Course.belongsToMany(Students,{through:StudentCourse})

export default {
    Students,
    IdentityCard,
    StudentCourse,
    Course
}