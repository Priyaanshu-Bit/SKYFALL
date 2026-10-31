import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SKYFALL database seeding...");

  // 1. Seed Supported Game Modes
  const clashSquad = await prisma.gameMode.upsert({
    where: { name: "Clash Squad" },
    update: {},
    create: {
      name: "Clash Squad",
      game: "Free Fire India",
      playersPerTeam: 4,
      minPlayers: 4,
      maxPlayers: 4,
      description: "Fast-paced 4v4 round-based combat format.",
      rules:
        "Standard Free Fire Clash Squad competitive rules. No emulators allowed. Gun attributes according to official tournament settings.",
      isActive: true,
    },
  });

  const battleRoyale = await prisma.gameMode.upsert({
    where: { name: "Battle Royale" },
    update: {},
    create: {
      name: "Battle Royale",
      game: "Free Fire India",
      playersPerTeam: 4,
      minPlayers: 4,
      maxPlayers: 4,
      description: "Competitive Free Fire India Battle Royale squad format.",
      rules:
        "Standard competitive survival and kill points system. All team members must join room within 10 minutes of schedule.",
      isActive: true,
    },
  });

  console.log(`✅ Seeded Game Modes: ${clashSquad.name}, ${battleRoyale.name}`);

  // 2. Seed Default Platform Settings
  await prisma.platformSetting.upsert({
    where: { key: "ORGANIZER_BRANDING" },
    update: {},
    create: {
      key: "ORGANIZER_BRANDING",
      value: "SKYFALL",
      description: "Official platform and tournament organizer branding.",
    },
  });

  await prisma.platformSetting.upsert({
    where: { key: "FAMPAY_QR_IMAGE_URL" },
    update: {},
    create: {
      key: "FAMPAY_QR_IMAGE_URL",
      value: "/images/placeholder-fampay-qr.png",
      description: "Current active FamPay UPI QR code for manual payment collection.",
    },
  });

  console.log("✅ Seeded default platform settings.");
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
