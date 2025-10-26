import { NextResponse } from "next/server";
import { connectDB } from "./lib/mongodb";
import { User } from "./lib/models/UserModel";
const jwt = require("jsonwebtoken")

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

            if (user) {
                return NextResponse.json({ message: "Real" })
            } else {
                return NextResponse.json({ message: "not Real" })
            }
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
