export interface ApiImageModel{
    next_page:string
    page: number
    per_page: number
    photos: PhotosModel[]
    total_results: number
}

export interface PhotosModel {
    height: number
    id: number
    photographer: string
    src:srcModel
    width: number
}

export interface srcModel {
    original:string
    large:string
    medium:string
    small:string
}