export interface Slide {
    id: string,
    title: string
}

export function createSlide(): Slide{
    return {
        id: crypto.randomUUID(),
        title: 'Новый слайд'
    }
}