import "dotenv/config";
import { handleCreateIncident, handleGetIncidents } from "../server/routes/incidents.js";

// Minimal mock for Express req/res
function mockReq(body: any = {}) {
  return { body } as any;
}

function mockRes() {
  let statusCode = 200;
  let jsonData: any = null;
  const res: any = {
    status(code: number) { statusCode = code; return res; },
    json(data: any) { jsonData = data; return res; },
    getStatus() { return statusCode; },
    getData() { return jsonData; },
  };
  return res;
}

async function runTests() {
  console.log("=== PATHNOVA: Incident Reporting API Tests ===\n");
  let passed = 0;
  let failed = 0;

  // ---------- TEST 1: Validation - missing fields ----------
  console.log("TEST 1: POST with missing required fields");
  const res1 = mockRes();
  await handleCreateIncident(mockReq({}), res1, () => {});
  if (res1.getStatus() === 400 && !res1.getData().success) {
    console.log(`  ✅ PASS — Status ${res1.getStatus()}, errors: ${res1.getData().errors.join("; ")}\n`);
    passed++;
  } else {
    console.log(`  ❌ FAIL — Expected 400, got ${res1.getStatus()}\n`);
    failed++;
  }

  // ---------- TEST 2: Validation - invalid incident_type ----------
  console.log("TEST 2: POST with invalid incident_type");
  const res2 = mockRes();
  await handleCreateIncident(mockReq({
    incident_type: "alien_invasion",
    latitude: 28.45, longitude: 77.02, severity: "low"
  }), res2, () => {});
  if (res2.getStatus() === 400 && res2.getData().errors.some((e: string) => e.includes("incident_type"))) {
    console.log(`  ✅ PASS — Rejected invalid type\n`);
    passed++;
  } else {
    console.log(`  ❌ FAIL\n`);
    failed++;
  }

  // ---------- TEST 3: Validation - invalid latitude ----------
  console.log("TEST 3: POST with out-of-range latitude");
  const res3 = mockRes();
  await handleCreateIncident(mockReq({
    incident_type: "pothole",
    latitude: 999, longitude: 77.02, severity: "medium"
  }), res3, () => {});
  if (res3.getStatus() === 400 && res3.getData().errors.some((e: string) => e.includes("latitude"))) {
    console.log(`  ✅ PASS — Rejected invalid latitude\n`);
    passed++;
  } else {
    console.log(`  ❌ FAIL\n`);
    failed++;
  }

  // ---------- TEST 4: Successful POST ----------
  console.log("TEST 4: POST valid incident");
  const res4 = mockRes();
  await handleCreateIncident(mockReq({
    incident_type: "pothole",
    description: "API test — large pothole near toll plaza",
    latitude: 28.4595,
    longitude: 77.0266,
    location_name: "NH-48, Manesar",
    severity: "high",
  }), res4, () => {});
  const createdId = res4.getData()?.incident?.id;
  if (res4.getStatus() === 201 && res4.getData().success && createdId) {
    console.log(`  ✅ PASS — Created incident ${createdId}`);
    console.log(`     Type: ${res4.getData().incident.incident_type}`);
    console.log(`     Severity: ${res4.getData().incident.severity}`);
    console.log(`     Status: ${res4.getData().incident.status}`);
    console.log(`     Location: (${res4.getData().incident.latitude}, ${res4.getData().incident.longitude})\n`);
    passed++;
  } else {
    console.log(`  ❌ FAIL — Status ${res4.getStatus()}, data: ${JSON.stringify(res4.getData())}\n`);
    failed++;
  }

  // ---------- TEST 5: GET incidents ----------
  console.log("TEST 5: GET /api/incidents");
  const res5 = mockRes();
  await handleGetIncidents({} as any, res5, () => {});
  if (res5.getStatus() === 200 && res5.getData().success && res5.getData().count >= 1) {
    console.log(`  ✅ PASS — Fetched ${res5.getData().count} incident(s)`);
    console.log(`     Columns: ${Object.keys(res5.getData().incidents[0]).join(", ")}\n`);
    passed++;
  } else {
    console.log(`  ❌ FAIL — Status ${res5.getStatus()}, data: ${JSON.stringify(res5.getData())}\n`);
    failed++;
  }

  // ---------- CLEANUP ----------
  if (createdId) {
    console.log("CLEANUP: Deleting test incident...");
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    const { error } = await supabase.from("incidents").delete().eq("id", createdId);
    if (error) {
      console.log(`  ⚠️  Could not delete: ${error.message} (may need DELETE RLS policy)\n`);
    } else {
      console.log(`  ✅ Test incident cleaned up.\n`);
    }
  }

  // ---------- SUMMARY ----------
  console.log("===========================================");
  console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
  if (failed === 0) {
    console.log("✅ ALL TESTS PASSED!");
  } else {
    console.log("❌ SOME TESTS FAILED");
  }
  console.log("===========================================");
}

runTests();
