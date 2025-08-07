#!/usr/bin/env node

// Script to update user roles directly in the database
const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

const roleUpdates = [
  {
    email: "admin@nvhealth.com",
    role: "platform_admin"
  },
  {
    email: "center.admin@nvhealth.com", 
    role: "center_admin"
  }
];

async function updateUserRole(email, role) {
  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });
    
    console.log(`✅ Updated ${email} to role: ${role}`);
    return { success: true, user: updatedUser };
  } catch (error) {
    console.log(`❌ Failed to update ${email}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🔧 Updating user roles...\n');
  
  for (const { email, role } of roleUpdates) {
    await updateUserRole(email, role);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📋 Verifying all users:');
  
  const allUsers = await prisma.user.findMany({
    select: {
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      isVerified: true
    },
    orderBy: { role: 'asc' }
  });
  
  allUsers.forEach(user => {
    console.log(`${user.role.padEnd(15)} | ${user.email.padEnd(30)} | ${user.firstName} ${user.lastName}`);
  });
  
  await prisma.$disconnect();
}

main().catch(console.error);
