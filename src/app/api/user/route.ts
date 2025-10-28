import { NextResponse } from "next/server";
import { connectDB } from "../lib/mongodb";
import { Question } from "../lib/models/QuestionModel";
import { Test } from "../lib/models/TestModel";
import { User } from "../lib/models/UserModel";
import { Result } from "../lib/models/ResultModel";

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { action, userID } = body;
        if (action === "get-tests") {
            const user = await User.findById(userID)

            if (user?.assignedTests?.length) {
                await user.populate("assignedTests");
            }

            return NextResponse.json({ tests: user.assignedTests, username: user.name, email: user.email });
        } else if (action === "logout") {
            const response = NextResponse.json({ message: 'Logged out' });

            console.log("hansdsbndj")

            response.cookies.set('token', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                expires: new Date(0), // Expire immediately
            });

            return response;
        }
        // Find test and its questions
        else {
            return NextResponse.json({ message: "failure and shi" });
        }
    } catch (error: any) {
        console.error("Error in fetching user details:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}