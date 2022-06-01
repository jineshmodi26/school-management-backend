const express = require('express');
const app = express();
require("dotenv").config();
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const PORT = 3003 || process.env.PORT
// const MONGO_URL = "mongodb://127.0.0.1:27017/SchoolManagement" || process.env.MONGO_URL
const MONGO_URL = process.env.MONGO_URL
const superadminRouter = require('./routes/superAdmin.router')
const adminRouter = require('./routes/admin.router');
const studentRouter = require('./routes/student.router');
const teacherRouter = require('./routes/teacher.router');
const classRouter = require('./routes/class.router');
const subjectRouter = require('./routes/subject.router');
const noticeRouter = require('./routes/notice.router');
const timeTableRouter = require('./routes/timeTable.router');
const slotRouter = require('./routes/slot.router');
const financeRouter = require('./routes/finances.router');
const examRouter = require('./routes/exam.router');
const materialRouter = require('./routes/material.router');
const resultRouter = require('./routes/result.router')
const assignmentRouter = require('./routes/assignment.router');

mongoose.connect(MONGO_URL);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/classes", classRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/notices", noticeRouter);
app.use("/api/v1/timetables", timeTableRouter);
app.use("/api/v1/slots", slotRouter);
app.use("/api/v1/finances", financeRouter);
app.use("/api/v1/exams", examRouter);
app.use("/api/v1/materials", materialRouter);
app.use("/api/v1/results",resultRouter);
app.use("/api/v1/assignments", assignmentRouter);
app.use("/api/v1/superAdmin",superadminRouter);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});