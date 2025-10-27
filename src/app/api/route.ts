import { NextResponse } from "next/server";
import { connectDB } from "./lib/mongodb";
import { User } from "./lib/models/UserModel";
const jwt = require("jsonwebtoken")
import 

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { email, password, action } = body;
        if (action === "signup") {
            const name = "Saad";
            const role = "admin";
            const newUser = await User.create({ name, email, password, role })
            const id = newUser.id
            const jwt_auth = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 * 60 })
            return NextResponse.json({ token: jwt_auth })
        } else {
            const user = await User.findOne({ email, password })
            console.log(user)
            console.log('admin-login found user:', !!user);
            // if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                console.log("Pass mathedc")
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
                return res;
            } else {
                return NextResponse.json({ message: "not Real" })
            }
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
