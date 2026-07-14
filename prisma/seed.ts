import {
  PrismaClient,
  UserRole,
  UserStatus,
  Visibility,
  VerificationStatus,
  SkillLevel,
  SocialPlatform,
} from "@prisma/client";

const prisma = new PrismaClient();

const MOCK_USERS = [
  {
    walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F".toLowerCase(),
    username: "alice_dev",
    email: "alice@didprofile.xyz",
    ensName: "alice.eth",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    profile: {
      displayName: "Alice Vance",
      headline: "Senior Web3 Frontend Engineer",
      bio: "Crafting beautiful decentralized user interfaces using React, Next.js, and TypeScript. Passionate about accessibility and performance.",
      location: "San Francisco, CA",
      website: "https://alicevance.dev",
      profileScore: 92,
      verificationStatus: VerificationStatus.VERIFIED,
      visibility: Visibility.PUBLIC,
      isComplete: true,
      skills: [
        { name: "TypeScript", level: SkillLevel.EXPERT },
        { name: "Next.js", level: SkillLevel.EXPERT },
        { name: "Tailwind CSS", level: SkillLevel.EXPERT },
        { name: "React v19", level: SkillLevel.ADVANCED },
        { name: "Viem / Wagmi", level: SkillLevel.ADVANCED },
      ],
      education: [
        {
          institution: "University of California, Berkeley",
          degree: "Bachelor of Science",
          fieldOfStudy: "Computer Science",
          startYear: 2018,
          endYear: 2022,
        },
      ],
      experience: [
        {
          company: "Decentralized Labs",
          role: "Senior Frontend Developer",
          description:
            "Engineered next-generation Web3 dashboards. Led migration to Next.js App Router.",
          startDate: new Date("2023-01-01"),
          endDate: null,
        },
        {
          company: "SaaS Solutions",
          role: "Frontend Engineer",
          description:
            "Developed user authentication flows and UI design library component packages.",
          startDate: new Date("2022-06-01"),
          endDate: new Date("2022-12-31"),
        },
      ],
      certificates: [
        {
          title: "Certified Solidity Developer",
          issuer: "Ethereum Foundation",
          issueDate: new Date("2024-03-15"),
          cid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        },
      ],
      socialLinks: [
        { platform: SocialPlatform.GITHUB, url: "https://github.com/alice-dev" },
        { platform: SocialPlatform.LINKEDIN, url: "https://linkedin.com/in/alice-vance" },
      ],
    },
  },
  {
    walletAddress: "0x250279025eA549e3bfdf069a349C24564c7406a6".toLowerCase(),
    username: "bob_smart",
    email: "bob@didprofile.xyz",
    ensName: "bobsmith.eth",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    profile: {
      displayName: "Bob Smith",
      headline: "Smart Contract Auditor",
      bio: "Securing Ethereum protocols. Core auditor with experience finding high-severity vulnerabilities in DeFi lending pools.",
      location: "London, UK",
      website: "https://bobsmith.eth.limo",
      profileScore: 85,
      verificationStatus: VerificationStatus.VERIFIED,
      visibility: Visibility.PUBLIC,
      isComplete: true,
      skills: [
        { name: "Solidity", level: SkillLevel.EXPERT },
        { name: "Foundry Testing", level: SkillLevel.EXPERT },
        { name: "Security Audit", level: SkillLevel.ADVANCED },
        { name: "Yul / EVM", level: SkillLevel.INTERMEDIATE },
      ],
      education: [
        {
          institution: "Imperial College London",
          degree: "Master of Science",
          fieldOfStudy: "Software Engineering",
          startYear: 2019,
          endYear: 2020,
        },
      ],
      experience: [
        {
          company: "ConsenSys Diligence",
          role: "Smart Contract Auditor",
          description:
            "Conducted security audits for DeFi projects. Evaluated ERC-20, ERC-721, and complex staking protocols.",
          startDate: new Date("2021-02-01"),
          endDate: null,
        },
      ],
      certificates: [
        {
          title: "Certified Smart Contract Security Auditor",
          issuer: "ConsenSys",
          issueDate: new Date("2021-08-10"),
          cid: "QmYwAPJth4r2eCR4t67ajS1FfP17822vedxjQkDDP9mYWo",
        },
      ],
      socialLinks: [
        { platform: SocialPlatform.GITHUB, url: "https://github.com/bob-smith" },
        { platform: SocialPlatform.TWITTER, url: "https://twitter.com/bob_contracts" },
      ],
    },
  },
];

async function main() {
  console.log("🌱 Starting seed database run...");

  for (const mockUser of MOCK_USERS) {
    const { profile, ...userData } = mockUser;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress: userData.walletAddress },
    });

    if (existingUser) {
      console.log(`User for wallet ${userData.walletAddress} already exists, skipping...`);
      continue;
    }

    // Create user and profile in a single atomic query transaction
    await prisma.user.create({
      data: {
        ...userData,
        profile: {
          create: {
            displayName: profile.displayName,
            headline: profile.headline,
            bio: profile.bio,
            location: profile.location,
            website: profile.website,
            profileScore: profile.profileScore,
            verificationStatus: profile.verificationStatus,
            visibility: profile.visibility,
            isComplete: profile.isComplete,
            skills: {
              create: profile.skills,
            },
            education: {
              create: profile.education,
            },
            experience: {
              create: profile.experience,
            },
            certificates: {
              create: profile.certificates,
            },
            socialLinks: {
              create: profile.socialLinks,
            },
          },
        },
      },
    });

    console.log(`Created user ${userData.username} with profile details successfully.`);
  }

  console.log("✅ Seed execution completed.");
}

main()
  .catch((e) => {
    console.error("❌ Seed run failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
