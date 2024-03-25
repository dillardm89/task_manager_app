import { useCallback } from 'react'


/**
 * Function for custom useDbClient hook to handle sending requests to the database
 * used in TaskList.tsx and context-providers.tsx
 * @returns {sendRequest} callback function for interacting with the backend api
 */
export function useDbClient() {
    /**
     * Callback function for interacting with the backend api
     * @param {string} url string of api url
     * @param {string} method string for api call method (GET, POST, PATCH, DELETE)
     * @param {BodyInit | null} body object containing request body
     * @param {Object} headers object containing request headers
     * @returns {Object} responseData
     */
    const sendRequest = useCallback(
        async (url: string, method: string = 'GET', body: BodyInit | null = null, headers = {}) => {
            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                })

                const responseData = await response.json()

                if (!response.ok) {
                    throw new Error(responseData.message)
                }

                return responseData
            } catch (error) {
                console.log(`useDbClient failed / ${error}`)
                throw error
            }
        }, [])

    return { sendRequest }
}
