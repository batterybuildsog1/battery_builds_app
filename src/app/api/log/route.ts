import { NextResponse } from 'next/server';

// Simple in-memory storage for logs (for development purposes)
let logs: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const timestamp = new Date().toISOString();
    const logEntry = {
      ...body,
      timestamp,
      id: `log_${Date.now()}`
    };
    
    logs.push(logEntry);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Log entry stored successfully',
      logEntry 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to store log entry' 
    }, { status: 400 });
  }
}

export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      logs 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to retrieve logs' 
    }, { status: 500 });
  }
}