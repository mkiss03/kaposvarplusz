// Web Worker for simulating live parking occupancy data
let occupancyData = [
  { id: 'oszlop-01', lat: 46.3598, lng: 17.7916, total: 40, occupied: 28, zone: 'Z1' },
  { id: 'oszlop-02', lat: 46.3612, lng: 17.7985, total: 60, occupied: 50, zone: 'Z1' },
  { id: 'oszlop-03', lat: 46.3546, lng: 17.8062, total: 30, occupied: 10, zone: 'Z2' },
  { id: 'oszlop-04', lat: 46.3524, lng: 17.8050, total: 20, occupied: 18, zone: 'Z2' },
  { id: 'oszlop-05', lat: 46.3618, lng: 17.8085, total: 25, occupied: 22, zone: 'Z3' },
  { id: 'oszlop-06', lat: 46.3593, lng: 17.8055, total: 40, occupied: 12, zone: 'Z3' },
]

function randomizeOccupancy() {
  return occupancyData.map((spot) => {
    const change = Math.floor(Math.random() * 7) - 3 // -3 to +3
    const newOccupied = Math.max(0, Math.min(spot.total, spot.occupied + change))
    return { ...spot, occupied: newOccupied }
  })
}

// Send initial data
postMessage(occupancyData)

// Update every 3 seconds
setInterval(() => {
  occupancyData = randomizeOccupancy()
  postMessage(occupancyData)
}, 3000)
