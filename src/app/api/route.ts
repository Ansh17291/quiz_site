import { NextResponse } from "next/server";
import { connectDB } from "./lib/mongodb";
import { User } from "./lib/models/UserModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || "dev-secret";

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { email, password, action } = body;
        if (action === "signup") {
            const name = "Saad";
            const role = "student";
            const newUser = await User.create({ name, email, password, role });
            const id = newUser.id;
            const jwt_auth = jwt.sign({ id }, JWT_SECRET, { expiresIn: '24h' });
            return NextResponse.json({ token: jwt_auth });
        } else if (action === "admin-login") {
            console.log({ email, role: "admin" })
            const user = await User.findOne({ email, role: "admin" });
            console.log(user)
            console.log('admin-login found user:', !!user);
            // if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const jwt_auth = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
                const res = NextResponse.json({ token: jwt_auth, message: "Real", user: { email: user.email, role: user.role } });
                // set httpOnly cookie from the server
                res.cookies.set("token", jwt_auth, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
                    maxAge: 60 * 60 * 24, // 1 day
                });
                console.log(res)
                return res;
            } else {
                return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
            }
        } else if (action === "teacher-login") {
            const user = await User.findOne({ email, role: "teacher" });
            console.log('teacher-login found user:', !!user);
            if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const jwt_auth = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
                const res = NextResponse.json({ token: jwt_auth, message: "Real", user: { email: user.email, role: user.role } });
                res.cookies.set("token", jwt_auth, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
                    maxAge: 60 * 60 * 24,
                });
                return res;
            } else {
                return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
            }
        } else if (action === "student-login") {
            const user = await User.findOne({ email, role: "student" });
            console.log('student-login found user:', !!user);
            if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const jwt_auth = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
                const res = NextResponse.json({ token: jwt_auth, message: "Real", user: { id: user._id, email: user.email, role: user.role } });
                res.cookies.set("token", jwt_auth, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
                    maxAge: 60 * 60 * 24,
                });
                return res;
            } else {
                return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
            }
        } else if (action === "signup") {
            console.log("hello")
            const newUser = await User.create({ email, password, role: "student" });
            if (newUser) {
                return NextResponse.json({ message: "User created successfully" });
            } else {
                return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
            }
        }
        // If action is missing or unrecognized
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}