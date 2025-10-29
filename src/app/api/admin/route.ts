import { NextResponse } from "next/server";
import { connectDB } from "../lib/mongodb";
import { Question } from "../lib/models/QuestionModel"
import { Test } from "../lib/models/TestModel"
import { User } from "../lib/models/UserModel"


export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { userID, action } = body;
        if (action === "fetch-admin") {
            const admin = await User.findById(userID)
            return NextResponse.json({ admin: { username: admin.name, email: admin.email } }, { status: 200 });
        } else if (action === "fetch-users") {
            const [students, teachers] = await Promise.all([
                User.find({ role: "student" }),
                User.find({ role: "teacher" })
            ]);

            const filteredStudents = students.map(stud => ({ name: stud.name, email: stud.email, id: stud._id }))
            const filteredTeachers = teachers.map(teach => ({
                name: teach.name,
                email: teach.email,
                id: teach._id
            }))

            return NextResponse.json({
                message: "Okay",
                students: filteredStudents,
                teachers: filteredTeachers
            }, { status: 200 });
        }
        return NextResponse.json({ message: "Saved" }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}