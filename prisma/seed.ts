import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.admin.upsert({
    where: { email: "admin@brightcore.com" },
    update: {},
    create: { email: "admin@brightcore.com", passwordHash },
  });

  const jobs = [
    {
      title: "Full Stack Software Developer",
      location: "Kigali, Rwanda",
      employmentType: "Full-time",
      closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      summary: "Build and maintain scalable web applications for our SACCO platform.",
      description: "We are looking for a talented Full Stack Developer to join our growing team at BrightCore. You will work on our digital financial services platform serving thousands of SACCO members across Rwanda.",
      responsibilities: "- Design and implement new features across the full stack\n- Write clean, testable code with proper documentation\n- Collaborate with product and design teams\n- Participate in code reviews and technical discussions\n- Maintain and improve existing systems",
      requirements: "- 3+ years of experience with React/Next.js and Node.js or Java Spring Boot\n- Strong understanding of REST APIs and databases (PostgreSQL/MySQL)\n- Experience with Git and CI/CD pipelines\n- Good communication skills\n- Bachelor's degree in Computer Science or equivalent experience",
    },
    {
      title: "UI/UX Designer",
      location: "Kigali, Rwanda (Hybrid)",
      employmentType: "Full-time",
      closingDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      summary: "Design intuitive user experiences for our web and mobile applications.",
      description: "BrightCore is seeking a creative UI/UX Designer to craft beautiful and functional interfaces for our financial technology products. You will work closely with developers and stakeholders to deliver exceptional user experiences.",
      responsibilities: "- Create wireframes, prototypes and high-fidelity designs\n- Conduct user research and usability testing\n- Maintain and evolve our design system\n- Collaborate with developers to ensure accurate implementation\n- Advocate for user-centred design across the organisation",
      requirements: "- 2+ years of UI/UX design experience\n- Proficiency in Figma or similar tools\n- Portfolio demonstrating web and mobile design work\n- Understanding of accessibility standards\n- Experience designing for financial or enterprise applications is a plus",
    },
    {
      title: "Data Analyst",
      location: "Remote",
      employmentType: "Contract",
      closingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      summary: "Analyse financial data and generate insights to support business decisions.",
      description: "We are looking for a Data Analyst to help us make sense of our growing data assets. You will build dashboards, run analyses and work with stakeholders to answer key business questions about our SACCO network.",
      responsibilities: "- Analyse large datasets to identify trends and patterns\n- Build and maintain dashboards and reports\n- Work with engineering to improve data pipelines\n- Present findings to non-technical stakeholders\n- Support data-driven decision making across the business",
      requirements: "- 2+ years of experience in data analysis\n- Proficiency in SQL and Python or R\n- Experience with BI tools (Metabase, Tableau or similar)\n- Strong analytical and problem-solving skills\n- Experience in fintech or financial services is an advantage",
    },
  ];

  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }

  console.log("Seed complete. Admin: admin@brightcore.com / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
