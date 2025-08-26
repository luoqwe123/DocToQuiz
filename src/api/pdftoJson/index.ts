

import { request } from "@/utils/request";
import type { JsonData, JsonIds } from "./type";
export * from "./type";

const baseUrl = "pdfFile/";

enum API {
    GETJSON_URL = baseUrl + "find",

}


export function getJson(id?: string) {
    const suffix = `?id=${id}`;
    return request.get<any, JsonData>(API.GETJSON_URL + suffix);

}

export function getAllId() {
    return request.get<any, JsonIds>(API.GETJSON_URL);
}