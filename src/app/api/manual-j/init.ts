import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../supabaseClient";
import { runManualJChain } from "@/lib/manualJChain";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { loggingService } from "@/lib/services/LoggingService";

/**
 * Initializes a Manual J calculation process using Gemini AI models:
 * - Uses gemini-2.0-flash-thinking-exp for reasoning and calculations
 * - Uses gemini-2.0-vision for PDF data extraction and analysis
 * 
 * The process includes:
 * 1. Input validation and sanitization
 * 2. PDF processing and data extraction
 * 3. Generation of climate-specific assumptions
 * 4. Manual J load calculations
 * 5. Visualization data generation
 * 6. Project and version creation in database
 * 
 * Version Control:
 * - Creates initial project entry
 * - Automatically creates version 1 in project_versions table
 * - Supports future version updates through separate endpoints
 * 
 * @param req NextRequest containing form data with PDF file and location
 * @returns NextResponse with calculation results or detailed error message
 */
export async function POST(req: NextRequest) {
  try {
    let formData;
    try {
      formData = await req.formData();
    } catch (formError: any) {
      console.error("FormData parsing failed:", {
        error: formError.message,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json({
        error: "Invalid form data submitted",
        code: "INVALID_FORM_DATA",
        details: formError.message
      }, {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const location = formData.get("location")?.toString().trim() || "";
    const pdfFile = formData.get("pdf") as File | null;

    // Enhanced input validation with detailed logging
    if (!pdfFile) {
      console.error("Input validation failed: Missing PDF file", {
        location,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json({ 
        error: "No PDF file uploaded.",
        code: "MISSING_PDF"
      }, { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    if (!location) {
      console.error("Input validation failed: Missing location", {
        pdfFileName: pdfFile?.name,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json({ 
        error: "Location is required.",
        code: "MISSING_LOCATION"
      }, { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    if (!pdfFile.type.includes('pdf')) {
      console.error("Input validation failed: Invalid file type", {
        providedType: pdfFile.type,
        fileName: pdfFile.name,
        fileSize: pdfFile.size,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json({ 
        error: "Uploaded file must be a PDF.",
        code: "INVALID_FILE_TYPE",
        provided: pdfFile.type
      }, { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (pdfFile.size > MAX_FILE_SIZE) {
      console.error("File size validation failed", {
        fileName: pdfFile.name,
        fileSize: pdfFile.size,
        maxSize: MAX_FILE_SIZE,
        exceededBy: pdfFile.size - MAX_FILE_SIZE,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json({ 
        error: "PDF file size exceeds 10MB limit.",
        code: "FILE_TOO_LARGE",
        size: pdfFile.size,
        maxSize: MAX_FILE_SIZE
      }, { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Convert PDF file to buffer for processing
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get and validate current session
    let session;
    try {
      session = await getServerSession(authOptions);
      
      if (!session || !session.user) {
        console.error("Session validation failed", {
          hasSession: !!session,
          hasUser: !!session?.user,
          timestamp: new Date().toISOString()
        });
        return NextResponse.json({ 
          error: "Authentication required",
          code: "AUTH_REQUIRED",
          details: "Valid session and user required"
        }, { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (sessionError: any) {
      console.error("Session retrieval failed", {
        error: sessionError.message,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json({ 
        error: "Authentication error",
        code: "AUTH_ERROR",
        details: sessionError.message
      }, { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Get user from validated session
    const user = session.user;

    // Process PDF through Gemini AI pipeline:
    // 1. Extract static data using gemini-2.0-vision
    // 2. Generate assumptions and calculations using gemini-2.0-flash-thinking-exp
    console.log("Starting Manual J calculation", {
      location,
      pdfSize: buffer.length,
      timestamp: new Date().toISOString()
    });

    const startTime = Date.now();
    const results = await runManualJChain(buffer, location);
    const processingTime = Date.now() - startTime;

    // Log successful LLM interaction
    loggingService.logLLMInteraction(
      'MANUAL_J_CALCULATION',
      JSON.stringify({ location, pdfSize: buffer.length }),
      JSON.stringify(results),
      processingTime,
      'SUCCESS'
    );

    console.log("Manual J calculation completed successfully", {
      location,
      hasStaticData: !!results.staticData,
      hasResults: !!results.manualJResults,
      processingTime,
      timestamp: new Date().toISOString()
    });
    
    // Start a Supabase transaction for atomic project and version creation
    const { data: projectData, error: projectError } = await supabase.from("projects").insert([
      {
        user_id: session.user.id!,
        name: `Manual J Calculation - ${location}`,
        location,
        static_data: results.staticData,
        dynamic_assumptions: results.dynamicAssumptions,
        manual_j_results: results.manualJResults,
        chart_data: results.chartData,
        csv_data: results.csvData,
        status: 'completed'
      },
    ]).select();
    
    if (projectError) {
      console.error("Project creation failed", {
        userId: user.id,
        location,
        error: projectError,
        timestamp: new Date().toISOString()
      });
      throw projectError;
    }

    // Create initial version (version 1)
    const { error: versionError } = await supabase.from("project_versions").insert([
      {
        project_id: projectData[0].id,
        version_number: 1,
        static_data: results.staticData,
        dynamic_assumptions: results.dynamicAssumptions,
        manual_j_results: results.manualJResults,
        change_reason: "Initial calculation",
        is_active: true
      }
    ]);

    if (versionError) {
      console.error("Version creation failed - attempting cleanup", {
        projectId: projectData[0].id,
        userId: user.id,
        error: versionError,
        timestamp: new Date().toISOString()
      });
      // If version creation fails, we should clean up the project
      const { error: cleanupError } = await supabase.from("projects").delete().match({ id: projectData[0].id });
      if (cleanupError) {
        console.error("Project cleanup failed after version creation error", {
          projectId: projectData[0].id,
          cleanupError,
          timestamp: new Date().toISOString()
        });
      }
      throw versionError;
    }
    
    return NextResponse.json({ 
      projectId: projectData[0].id,
      versionNumber: 1,
      ...results 
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error("Error in init API:", error);
    const errorMessage = error.message || 'Unknown error occurred';
    const statusCode = error.status || 500;
    
    // Enhanced error handling for version-related and auth errors
    const errorCode = error.code === '23503' ? 'VERSION_CREATION_FAILED' : 
                     error.code === '23505' ? 'DUPLICATE_VERSION' :
                     error.code === 'UNAUTHORIZED' ? 'AUTH_ERROR' :
                     error.code || 'UNKNOWN_ERROR';

    // Log failed LLM interaction if it's an LLM-related error
    if (error.code !== '23503' && error.code !== '23505') {
      loggingService.logLLMInteraction(
        'MANUAL_J_CALCULATION',
        JSON.stringify({ location: formData?.get("location")?.toString() || 'unknown' }),
        JSON.stringify({ error: errorMessage }),
        0, // Processing time unknown for errors
        'ERROR',
        errorMessage
      );
    }

    // Log additional authentication context if available
    if (error.code === 'UNAUTHORIZED' || error.code === 'AUTH_ERROR') {
      console.error('Authentication context:', {
        errorType: 'AuthError',
        timestamp: new Date().toISOString(),
        details: error.details || null,
        sessionState: error.session ? {
          expired: error.session.expires_at < Date.now() / 1000,
          expiresAt: new Date(error.session.expires_at * 1000).toISOString()
        } : 'No session'
      });
    }
    
    return NextResponse.json({ 
      error: `Failed to run initial Manual J: ${errorMessage}`,
      code: errorCode,
      details: error.details || null,
      timestamp: new Date().toISOString(),
      version_affected: error.code?.includes('23') ? true : false
    }, { 
      status: statusCode,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
