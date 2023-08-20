const canvas = document.getElementById("solarSystemCanvas");
const ctx = canvas.getContext("2d");
const generateButton = document.getElementById("generateButton");
const saveButton = document.getElementById("saveButton");
const tooltip = document.getElementById("tooltip");

canvas.width = 800;
canvas.height = 600;

const SUN_RADIUS = 30;
const PLANET_MIN_RADIUS = 10;
const PLANET_MAX_RADIUS = 40;
const PLANET_MIN_DISTANCE = 120;
const PLANET_MAX_DISTANCE = 300;
const MOON_MIN_RADIUS = 3;
const MOON_MAX_RADIUS = 10;
const MOON_MIN_DISTANCE = 20;
const MOON_MAX_DISTANCE = 60;
const COLORS = [
  "#FF5733",
  "#E8D38E",
  "#56A3A6",
  "#A65ECE",
  "#51A039",
];

const PLANET_NAMES = [
  "Aeloria", "Verdon", "Lunara", "Zephyrion", "Solstis", "Lyrius", "Nexara", "Terra", "Celestia", "Orion", "Astoria"
];

const SOLAR_SYSTEM_NAMES = [
  "Solaris", "Stellara", "Cosmostrum", "Galaxia", "Astralis", "Nebulon", "Astrovia", "Celestius", "Orbitalis", "Stellaris",
  "Nova", "Voyager", "Infinity", "Nebula", "Eclipse", "Andromeda", "Pulsar", "Supernova", "Quasar", "Sentinel"
];

function generateRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function generateRandomName(namesArray) {
  return namesArray[Math.floor(Math.random() * namesArray.length)];
}

function generateRandomSolarSystemName() {
  return generateRandomName(SOLAR_SYSTEM_NAMES);
}

function generateRandomMass() {
  const minMass = 1;
  const maxMass = 1000;
  const mass = Math.random() * (maxMass - minMass) + minMass;
  return mass.toFixed(2) + " Earth masses";
}

function generateRandomComposition() {
  const compositions = ["Rocky", "Gas Giant", "Ice Giant"];
  return generateRandomName(compositions);
}

function generateRandomAtmosphere() {
  const atmospheres = ["Nitrogen-Oxygen", "Hydrogen-Helium", "Carbon Dioxide"];
  return generateRandomName(atmospheres);
}

let planets = []; // Store planet information

function generateRandomSolarSystem() {
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  planets = []; // Reset planets array
  const solarSystemName = generateRandomSolarSystemName();
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, SUN_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  const numPlanets = Math.floor(Math.random() * 10) + 2;
  const usedNames = new Set();
  const minPlanetSpacing = PLANET_MAX_RADIUS * 2.5;

  for (let i = 0; i < numPlanets; i++) {
    const distance = PLANET_MIN_DISTANCE + i * (PLANET_MAX_DISTANCE - PLANET_MIN_DISTANCE) / numPlanets;
    const angle = Math.random() * Math.PI * 2;
    const x = width / 2 + distance * Math.cos(angle);
    const y = height / 2 + distance * Math.sin(angle);
    const radius = Math.random() * (PLANET_MAX_RADIUS - PLANET_MIN_RADIUS) + PLANET_MIN_RADIUS;
    const color = generateRandomColor();
    let name = generateRandomName(PLANET_NAMES);

    while (usedNames.has(name)) {
      name = generateRandomName(PLANET_NAMES);
    }
    usedNames.add(name);

    let overlapping = false;
    for (const planet of planets) {
      const distanceBetweenCenters = Math.sqrt((x - planet.x) ** 2 + (y - planet.y) ** 2);
      if (distanceBetweenCenters < radius + planet.radius + minPlanetSpacing) {
        overlapping = true;
        break;
      }
    }

    if (!overlapping) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2, distance, distance, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.font = "12px Arial";
      ctx.fillText(name, x - radius, y + radius + 15);

      planets.push({ x, y, radius, name });
    }
  }

  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText(`Solar System: ${solarSystemName}`, 20, 30);
}

generateButton.addEventListener("click", generateRandomSolarSystem);
generateRandomSolarSystem();

saveButton.addEventListener("click", () => {
  const dataURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "solar_system.png";
  link.click();
});

canvas.addEventListener("mousemove", (event) => {
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;

  for (const planet of planets) {
    const distance = Math.sqrt((x - planet.x) ** 2 + (y - planet.y) ** 2);
    if (distance <= planet.radius) {
      tooltip.style.left = event.clientX + "px";
      tooltip.style.top = event.clientY + "px";
      tooltip.innerHTML = `
        <strong>${planet.name}</strong><br>
        Mass: ${generateRandomMass()}<br>
        Composition: ${generateRandomComposition()}<br>
        Atmosphere: ${generateRandomAtmosphere()}
      `;
      tooltip.style.display = "block";
      return;
    }
  }
setInterval(() => {
  updatePlanetsOrbit();
  generateRandomSolarSystem();
}, 1000 / 30); // Update the orbit and regenerate the solar system 30 times per second
  tooltip.style.display = "none";
});

canvas.addEventListener("mouseout", () => {
  tooltip.style.display = "none";
});
