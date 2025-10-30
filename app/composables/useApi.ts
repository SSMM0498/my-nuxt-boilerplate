interface ApiError {
    statusCode: number
    statusMessage: string
    data?: any
    message?: string
}

export const useApi = () => {
    const { handleAuthError, handleApiError } = useApiErrorHandler()

    const apiFetch = async <T>(url: string, options: any = {}): Promise<T> => {
        try {
            return await $fetch(url, options) as unknown as T
        } catch (error: any) {
            if (handleAuthError(error, `API call to ${url}`)) {
                throw error
            }

            handleApiError(error, `API call to ${url}`)
            throw error
        }
    }

    const apiFetchWithRetry = async <T>(
        url: string,
        options: any = {},
        maxRetries: number = 2
    ): Promise<T> => {
        let lastError: any

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await apiFetch<T>(url, options)
            } catch (error: any) {
                lastError = error

                const shouldRetry =
                    !error.statusCode ||
                    (error.statusCode >= 500 && error.statusCode < 600) ||
                    error.message?.includes('Network') ||
                    error.message?.includes('timeout')

                if (!shouldRetry || attempt === maxRetries) break

                const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
                console.warn(`API call failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`)
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }

        throw lastError
    }

    return { apiFetch, apiFetchWithRetry }
}
