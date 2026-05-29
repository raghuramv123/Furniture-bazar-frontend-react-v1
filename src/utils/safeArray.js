// extracts array safely from both plain list and Spring Page response
const safeArray = (data) => {
  if (Array.isArray(data)) return data
  if (data?.content && Array.isArray(data.content)) return data.content
  return []
}

export default safeArray