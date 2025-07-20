export interface QuestionInfo {
    "id": string,
    "questionNum": string,
    "question": string,
    "select":
    {
        "A": string,
        "B": string,
        "C": string,
        "D": string
    },
    "answer": string,
    "type": string,
    "chooseRight": boolean,
    "userAnswer": string
}

export interface Chapter {
    name: string,
    content: Content


}
 interface Content {
    Achoice: QuestionInfo[],
    ManyChoice: QuestionInfo[]
}