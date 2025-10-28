import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import { Question } from "../../lib/models/QuestionModel";
import { Test } from "../../lib/models/TestModel";
import { Result } from "../../lib/models/ResultModel";

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { testId, answers, userId } = body;

        // Find test and its questions
        const test = await Test.findById(testId).populate("questionRef");
        if (!test) {
            return NextResponse.json({ error: "Test not found" }, { status: 404 });
        }

        // Calculate score
        let correctAnswers = 0;
        const wrongQuestions: any[] = [];

        test.questionRef.forEach((question: any) => {
            const userAnswer = answers[question._id];
            if (userAnswer === Number(question.correctAnswer)) {
                correctAnswers++;
            } else {
                wrongQuestions.push(question._id);
            }
        });

        const percentage = (correctAnswers / test.questionRef.length) * 100;

        // Create result record
        const result = await Result.create({
            student: userId,
            test: testId,
            totalQuestions: test.questionRef.length,
            correctAnswers,
            wrongQuestions,
            percentage,
        });

        return NextResponse.json({
            score: {
                total: test.questionRef.length,
                correct: correctAnswers,
                percentage,
            },
            correctAnswers: test.questionRef.map((q: any) => ({
                questionId: q._id,
                correctAnswer: Number(q.correctAnswer)
            }))
        });

    } catch (error: any) {
        console.error("Quiz submission error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}