import { NextResponse } from 'next/server';

// Access or initialize the global in-memory store for users
if (!(global as any).InMemoryUsers) {
  (global as any).InMemoryUsers = [];
}
const users: any[] = (global as any).InMemoryUsers;

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Mock user creation (replace with hashing password and database insertion)
    const newUser = { id: String(users.length + 1), name, email, password }; // Store password plaintext (BAD PRACTICE!)
    users.push(newUser);

    console.log('New user registered (in-memory):', { id: newUser.id, name: newUser.name, email: newUser.email }); // Don't log password
    console.log('Total users (in-memory):', users.length);


    return NextResponse.json({ message: 'User registered successfully', userId: newUser.id }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 });
  }
}
