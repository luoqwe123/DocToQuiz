


export interface Pdfdata {
    name: string,
    content: {
        Achoice:Achoice[],
        ManyChoice:ManyChoice[],
    }
}

interface Achoice {
    id: string,
    question: string,
    select: {
        "A": string
        "B": string
        "C": string
        "D": string
    },
    type:string,
    answer?:string
}
interface ManyChoice {
    id: string,
    question: string,
    select: {
        "A": string
        "B": string
        "C": string
        "D": string
    },
    type:string,
    answer?:string
}