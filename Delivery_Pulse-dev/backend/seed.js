// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import Employee from './src/models/Employee.js';
// import Project from './src/models/Project.js';

// dotenv.config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('✅ MongoDB Connected');
//   } catch (error) {
//     console.error('❌ Error connecting to MongoDB:', error.message);
//     process.exit(1);
//   }
// };

// const seedData = async () => {
//   try {
//     await connectDB();

//     await Employee.deleteMany({});
//     await Project.deleteMany({});
//     console.log('🗑️  Cleared existing data');

//     const employees = await Employee.insertMany([
//       {
//         name: 'Alex Rivers',
//         email: 'alex.rivers@company.com',
//         designation: 'Senior Developer',
//         department: 'Engineering'
//       },
//       {
//         name: 'John Doe',
//         email: 'john.doe@company.com',
//         designation: 'Frontend Developer',
//         department: 'Engineering'
//       },
//       {
//         name: 'Jane Smith',
//         email: 'jane.smith@company.com',
//         designation: 'Backend Developer',
//         department: 'Engineering'
//       },
//       {
//         name: 'Mike Johnson',
//         email: 'mike.johnson@company.com',
//         designation: 'Full Stack Developer',
//         department: 'Engineering'
//       }
//     ]);

//     console.log(`✅ ${employees.length} employees created`);

//     const projects = await Project.insertMany([
//       {
//         name: 'Internal Infrastructure',
//         code: 'INFRA',
//         description: 'Internal infrastructure modernization',
//         status: 'active',
//         startDate: new Date('2024-01-01')
//       },
//       {
//         name: 'Client Portal Redesign',
//         code: 'PORTAL',
//         description: 'Complete redesign of client portal',
//         status: 'active',
//         startDate: new Date('2024-02-15')
//       },
//       {
//         name: 'API Optimization',
//         code: 'APIOPT',
//         description: 'API performance optimization project',
//         status: 'active',
//         startDate: new Date('2024-03-01')
//       },
//       {
//         name: 'E-Commerce Platform',
//         code: 'ECOM',
//         description: 'Building scalable e-commerce platform',
//         status: 'active',
//         startDate: new Date('2024-01-20')
//       },
//       {
//         name: 'Analytics Dashboard',
//         code: 'ANLY',
//         description: 'Real-time analytics dashboard',
//         status: 'active',
//         startDate: new Date('2024-04-01')
//       }
//     ]);

//     console.log(`✅ ${projects.length} projects created`);
//     console.log('🎉 Seed data created successfully!');
//     process.exit(0);

//   } catch (error) {
//     console.error('❌ Error seeding data:', error);
//     process.exit(1);
//   }
// };

// seedData();
