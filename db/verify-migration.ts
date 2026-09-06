import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log("=== PATHNOVA: Running incidents table migration ===\n");

  // Step 1: Check if table already exists by trying to query it
  console.log("Step 1: Checking if 'incidents' table already exists...");
  const { error: checkError } = await supabase.from("incidents").select("id").limit(1);

  if (!checkError) {
    console.log("✅ Table 'incidents' already exists!");
    await verifyTable();
    return;
  }

  if (checkError.code === "PGRST205" || checkError.code === "42P01") {
    console.log("Table does not exist yet. Need to create it.\n");
    console.log("❌ Cannot create tables via the Supabase JS client (PostgREST limitation).");
    console.log("");
    console.log("Please run the SQL manually in the Supabase SQL Editor:");
    console.log("  https://supabase.com/dashboard/project/itogtfswphepapksobsa/sql/new");
    console.log("");
    console.log("Copy-paste the contents of: db/migrations/001_create_incidents_table.sql");
    process.exit(1);
  } else {
    console.log(`Unexpected error: ${checkError.code} - ${checkError.message}`);
    process.exit(1);
  }
}

async function verifyTable() {
  console.log("\n=== Verifying incidents table structure ===\n");

  const testIncident = {
    incident_type: "pothole",
    description: "Migration verification test - safe to delete",
    latitude: 28.4595,
    longitude: 77.0266,
    location_name: "Test Location",
    severity: "low",
    status: "reported",
  };

  console.log("Step 2: Inserting test incident...");
  const { data: insertData, error: insertError } = await supabase
    .from("incidents")
    .insert(testIncident)
    .select();

  if (insertError) {
    console.log(`❌ Insert failed: ${insertError.message}`);
    process.exit(1);
  }

  console.log("✅ Insert succeeded!");
  console.log(`   ID: ${insertData[0].id}`);
  console.log(`   Type: ${insertData[0].incident_type}`);
  console.log(`   Severity: ${insertData[0].severity}`);
  console.log(`   Status: ${insertData[0].status}`);
  console.log(`   Location: (${insertData[0].latitude}, ${insertData[0].longitude})`);
  console.log(`   Created: ${insertData[0].created_at}\n`);

  console.log("Step 3: Reading back the test incident...");
  const { data: readData, error: readError } = await supabase
    .from("incidents")
    .select("*")
    .eq("id", insertData[0].id)
    .single();

  if (readError) {
    console.log(`❌ Read failed: ${readError.message}`);
    process.exit(1);
  }
  console.log("✅ Read succeeded! All columns present:");
  console.log(`   Columns: ${Object.keys(readData).join(", ")}\n`);

  console.log("Step 4: Cleaning up test incident...");
  const { error: deleteError } = await supabase
    .from("incidents")
    .delete()
    .eq("id", insertData[0].id);

  if (deleteError) {
    console.log(`⚠️  Cleanup note: ${deleteError.message}`);
    console.log("   (Expected if no DELETE policy exists yet)\n");
  } else {
    console.log("✅ Test row cleaned up.\n");
  }

  console.log("===========================================");
  console.log("✅ MIGRATION VERIFIED SUCCESSFULLY!");
  console.log("   The 'incidents' table is ready to use.");
  console.log("===========================================");
}

runMigration();
