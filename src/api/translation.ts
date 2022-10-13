
interface TranslationDto {
    id: string,
    words: WordDto[]
}
interface WordDto {
    translation: string,
    language: string
}
interface TranslationRequest {
    words: WordDto[]
}

export type {
    TranslationDto,
    WordDto,
    TranslationRequest
}
