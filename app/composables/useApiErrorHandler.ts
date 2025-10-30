interface ErrorMapping {
    [key: string]: {
        title: string
        message: string
        color: 'error' | 'warning' | 'info'
        duration?: number
    }
}

export const useApiErrorHandler = () => {
    const authUser = useAuthUser()
    const toast = useToast()

    // Map common error patterns to user-friendly messages (using functions to get translations)
    const getErrorMappings = (): ErrorMapping => {
        const { t } = useI18n()

        return {
            // Network errors
            'NETWORK_ERROR': {
                title: t('api-errors.network-error.title'),
                message: t('api-errors.network-error.message'),
                color: 'warning',
                duration: 8000
            },
            'TIMEOUT': {
                title: t('api-errors.timeout.title'),
                message: t('api-errors.timeout.message'),
                color: 'warning',
                duration: 6000
            },
            '400': {
                title: t('api-errors.bad-request.title'),
                message: t('api-errors.bad-request.message'),
                color: 'error'
            },
            '404': {
                title: t('api-errors.not-found.title'),
                message: t('api-errors.not-found.message'),
                color: 'warning'
            },
            '429': {
                title: t('api-errors.too-many-requests.title'),
                message: t('api-errors.too-many-requests.message'),
                color: 'warning',
                duration: 8000
            },

            // Server errors
            '500': {
                title: t('api-errors.server-error.title'),
                message: t('api-errors.server-error.message'),
                color: 'error',
                duration: 10000
            },
            '503': {
                title: t('api-errors.service-unavailable.title'),
                message: t('api-errors.service-unavailable.message'),
                color: 'warning',
                duration: 10000
            },

            // Business logic errors (from our API)
        }
    }

    const handleAuthError = (error: any, context: string = 'operation'): boolean => {
        const isAuthError =
            error?.statusCode === 401 ||
            error?.statusCode === 403 ||
            error?.data?.code === 401 ||
            error?.response?.code === 401 ||
            error?.message?.includes('auth') ||
            error?.message?.includes('unauthorized') ||
            error?.message?.includes('unauthenticated') ||
            error?.message?.includes('token') ||
            error?.message?.includes('session')

        if (isAuthError) {
            console.error(`🔐 Auth error in ${context}:`, error)
            // Clear user state
            authUser.value = null

            const { t } = useI18n()

            // Show appropriate message based on error type
            if (error?.statusCode === 403) {
                toast.add({
                    title: t('api-errors.access-denied.title'),
                    description: t('api-errors.access-denied.message'),
                    color: 'error',
                    duration: 6000
                })
            } else {
                toast.add({
                    title: t('api-errors.session-expired.title'),
                    description: t('api-errors.session-expired.message'),
                    color: 'error',
                    duration: 5000
                })
                navigateTo('/login', { replace: true })
            }

            return true
        }

        return false
    }

    const handleApiError = (error: any, context: string = 'operation') => {
        // Don't show toast for auth errors (already handled)
        if (handleAuthError(error, context)) {
            return
        }

        console.error(`🚨 API error in ${context}:`, error)

        const { t } = useI18n()

        // Extract error information
        const statusCode = error?.statusCode
        const errorMessage = error?.statusMessage || error?.message || 'An error occurred'
        const data = error?.data || error?.response?.data

        // Get error mappings
        const errorMappings = getErrorMappings()

        // Try to find a specific error mapping
        let mappedError = findErrorMapping(statusCode, errorMessage, data)

        // If no specific mapping found, use generic one based on status code
        if (!mappedError) {
            mappedError = errorMappings[statusCode?.toString()] || {
                title: t('api-errors.generic.title'),
                message: errorMessage,
                color: 'error'
            }
        }

        // Show toast notification
        toast.add({
            title: mappedError.title,
            description: mappedError.message,
            color: mappedError.color,
            duration: mappedError.duration || 5000
        })
    }

    const findErrorMapping = (statusCode: number, errorMessage: string, data: any) => {
        // Get error mappings
        const errorMappings = getErrorMappings()

        // Check for specific error patterns in the message
        const lowerMessage = errorMessage.toLowerCase()

        if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
            return errorMappings.NETWORK_ERROR
        }

        if (lowerMessage.includes('timeout')) {
            return errorMappings.TIMEOUT
        }

        // Check data for specific error codes from our API
        if (data?.code) {
            const code = data.code.toUpperCase()
            if (errorMappings[code]) {
                return errorMappings[code]
            }
        }

        return null
    }

    // Helper to extract validation errors from response
    const getValidationErrors = (error: any): Record<string, string> => {
        if (error?.data?.data) {
            // PocketBase validation errors
            return error.data.data
        }

        if (error?.data?.errors) {
            // Custom validation errors
            return error.data.errors
        }

        return {}
    }

    // Helper to check if error is a validation error
    const isValidationError = (error: any): boolean => {
        const statusCode = error?.statusCode
        const data = error?.data

        return statusCode === 400 && (
            data?.data || // PocketBase format
            data?.errors // Custom format
        )
    }

    return {
        handleAuthError,
        handleApiError,
        getValidationErrors,
        isValidationError
    }
}
