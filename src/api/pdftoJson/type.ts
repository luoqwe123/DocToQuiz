


export interface JsonIds {
    data: {
        data: baseInfo[]
    }
}


export interface baseInfo {
    id: string,
    title: string,
    describe: string
}
export interface JsonData {
    data: {
        id: string,
        data: fullInfo
    }
}

export interface fullInfo {
    id: number;
    title: string;
    result:string;
    descript:string;
    status:string;

}