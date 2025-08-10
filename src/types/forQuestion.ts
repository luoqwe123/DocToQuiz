export interface ViewInfo {
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
    Achoice: ViewInfo[],
    ManyChoice: ViewInfo[]
}
interface  RawInfo{
    "id": string,
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
}
interface RawContent{
    Achoice: RawInfo[],
    ManyChoice: RawInfo[]
}
export interface RawChapter {
    name: string,
    content: RawContent


}