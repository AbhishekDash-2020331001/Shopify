const formattedError = (error) => {
  return (
    error.response
      ?
      {
        statusCode: error.response.status,
        statusText: error.response.statusText,
        message: error.response.data.message
      }
      :
      {
        message: error.message
      }
  )
}


export { formattedError };