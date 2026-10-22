export function generatePropertyId() {
  const randomNum = Math.floor(100 + Math.random() * 900)
  return `PV-${randomNum}`
}
