#!/usr/bin/env node

// Script to create test users for different roles
const users = [
  // Patients (2 users)
  {
    email: "patient1@nvhealth.com",
    password: "patient123",
    firstName: "John",
    lastName: "Patient",
    phone: "+1234567890",
    role: "patient"
  },
  {
    email: "patient2@nvhealth.com", 
    password: "patient456",
    firstName: "Jane",
    lastName: "Smith",
    phone: "+1234567891",
    role: "patient"
  },
  
  // Platform Admin (1 user)
  {
    email: "admin@nvhealth.com",
    password: "admin123secure",
    firstName: "Platform",
    lastName: "Administrator", 
    phone: "+1234567892",
    role: "platform_admin"
  },
  
  // Center Admin (1 user)
  {
    email: "center.admin@nvhealth.com",
    password: "center123secure", 
    firstName: "Center",
    lastName: "Manager",
    phone: "+1234567893", 
    role: "center_admin"
  }
];

async function createUser(userData) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Created ${userData.role}: ${userData.email} (${userData.firstName} ${userData.lastName})`);
      return { success: true, userId: result.userId };
    } else {
      console.log(`❌ Failed to create ${userData.email}: ${result.error}`);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.log(`❌ Error creating ${userData.email}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function updateUserRole(userId, role) {
  // Since the register endpoint doesn't set roles, we'll need to update manually
  // For now, we'll use a direct database approach
  console.log(`ℹ️  Note: You'll need to manually update role for user ${userId} to ${role}`);
}

async function main() {
  console.log('🚀 Starting user creation...\n');
  
  // Check if server is running
  try {
    const healthCheck = await fetch('http://localhost:3000/api/debug/users');
    if (!healthCheck.ok) {
      console.log('❌ Server not running. Please start with: npm run dev');
      process.exit(1);
    }
  } catch (error) {
    console.log('❌ Cannot connect to server. Please start with: npm run dev');
    process.exit(1);
  }
  
  const results = [];
  
  for (const userData of users) {
    const result = await createUser(userData);
    results.push({ ...userData, ...result });
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Successfully created: ${results.filter(r => r.success).length} users`);
  console.log(`❌ Failed to create: ${results.filter(r => !r.success).length} users`);
  
  if (results.some(r => !r.success)) {
    console.log('\n❌ Failed users:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   ${r.email}: ${r.error}`);
    });
  }
  
  console.log('\n⚠️  Important: The registered users have default "patient" role.');
  console.log('   You need to manually update roles in the database for admin users.');
}

main().catch(console.error);
