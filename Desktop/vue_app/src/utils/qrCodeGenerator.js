export const generateQRCode = async (document) => {
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <rect x="10" y="10" width="180" height="180" fill="none" stroke="black" stroke-width="2"/>
      <text x="100" y="100" font-family="Arial" font-size="12" text-anchor="middle" fill="black">
        QR Code
      </text>
      <text x="100" y="120" font-family="Arial" font-size="10" text-anchor="middle" fill="gray">
        ${document.id}
      </text>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}
