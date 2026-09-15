interface QuizzAI {
    contentType: "quizz" | "code",
    weekConcept: string,
    message: string,
    rewardType: "XP",
    topics: {
        id: number,
        question: string,
        code: string | null,
        options: string[],
        correctAnswer: "A" | "B" | "C" | "D",
        explanation: string
    }[]
}