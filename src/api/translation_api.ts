import axios from "axios"
import { TranslationDto, TranslationRequest, WordDto } from "./translation"

const URL = "http://localhost:8000/api"

async function get_translations(): Promise<Array<TranslationDto>> {

    const res = await axios.get(`${URL}/translation`)

    if (res.status === 200) {
        return res.data
    }

    throw new Error("Unable to get data")
}


async function get_translation_by_word(word: WordDto): Promise<TranslationDto[]> {

    const res = await axios.post(`${URL}/translation/search`, word)

    if (res.status == 200) {
        return res.data
    }

    throw new Error("Unable to get data")

}

async function add_translation(slovak: string, english: string, german: string): Promise<TranslationDto> {

    let slovakWord: WordDto = { language: "SLOVAK", translation: slovak }
    let englishWord: WordDto = { language: "ENGLISH", translation: english }
    let germanWord: WordDto = { language: "GERMAN", translation: german }

    let requestData: TranslationRequest = {
        words: [
            slovakWord,
            englishWord,
            germanWord
        ]
    }

    const res = await axios.put(`${URL}/translation`, requestData)

    if (res.status == 200) {
        return res.data
    }

    throw new Error("Unable to get data")

}
// This is object Object for some reason
async function delete_translation(id: string): Promise<boolean> {

    console.log("Deleting translation with id: " + id)

    const res = await axios.delete(`${URL}/translation?id=${id}`)

    if (res.status === 200) {
        return res.data
    }
    throw new Error("Unable to delete translation")
}

async function edit_translation(id: string, new_translation: TranslationRequest): Promise<TranslationDto> {

    const res = await axios.patch(`${URL}/translation/edit?id=${id}`, new_translation)

    if (res.status === 200) {
        return res.data
    }

    throw new Error("Unable to edit translation")
}

async function test_backend(): Promise<TranslationDto> {
    const res = await axios.get(`${URL}/translation/test`)

    if (res.status == 200) {
        return res.data
    }

    throw new Error("Unable to get data")
}

export { get_translations, test_backend, get_translation_by_word, add_translation, delete_translation, edit_translation }