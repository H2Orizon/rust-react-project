import type { AxiosInstance } from "axios";

export const imageService = {
    upload: ( api: AxiosInstance, resourceId: number, file: File ) => {
        const formData = new FormData()

        formData.append("file", file)

        return api.post(
            `/resources/${resourceId}/image`, formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        )
    },

    delete: (api: AxiosInstance, resourceId: number, imageId: number) =>
        api.delete(`/resources/${resourceId}/image/${imageId}`)
}