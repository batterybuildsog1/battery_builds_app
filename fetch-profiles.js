import { supabase } from './supabaseClient.js';

async function fetchProfiles() {
  try {
    const { data, error, count } = await supabase
      .from('profiles')
      .select('created_at, id', { count: 'exact' });

    if (error) {
      console.error("Error fetching profiles:", error);
    } else {
      console.log("Total profiles:", count);
      console.log("Profiles data:", data);
      if (data && data.length > 0) {
        console.log("First profile:", data[0]);
      } else {
        console.log("No profiles found.");
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

// Execute the function
fetchProfiles()
  .then(() => console.log("Fetch operation completed."))
  .catch(error => console.error("Error in fetchProfiles:", error));

// Add a timeout to ensure the script doesn't hang indefinitely
setTimeout(() => {
  console.log("Script timed out. Check your Supabase connection.");
  process.exit(1);
}, 10000); // 10 seconds timeout





