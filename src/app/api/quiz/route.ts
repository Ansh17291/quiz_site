import { NextResponse } from "next/server";
import { connectDB } from "../lib/mongodb";
import { Question } from "../lib/models/QuestionModel"
import { Test } from "../lib/models/TestModel"
import { User } from "../lib/models/UserModel"


export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { testName, totalTime, action } = body;
        if (action === "create-quiz") {
            console.log(testName);
            // const teacher = "Saad" // id of the teacher
            const newTest = await Test.create({ testName, totalQuestions: body.questions.length, totalTime });

            const questionPromises = body.questions.map(
                (individualQuestion: { mainQuestion: String, options: String[], correctAnswer: Number, expanded: Boolean }) => {
                    return Question.create({
                        test: newTest._id,
                        questionText: individualQuestion.mainQuestion,
                        options: individualQuestion.options,
                        correctAnswer: individualQuestion.correctAnswer,
                    });
                }
            );
            const newQuestions = await Promise.all(questionPromises);

            newQuestions.forEach((newQuestion) => {
                newTest.questionRef.push(newQuestion._id);
            });

            // Save the updated newTest document with all the question IDs
            await newTest.save();
        } else if (action === "get-data") {
            //Ideally we'll be getting the id of the quiz to look for
            const test = await Test.findOne({ testName: "sabsja" }).populate("questionRef");
            console.log(test.testName)
            return NextResponse.json({ values: test });
        }
        return NextResponse.json({ message: "Saved" }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}