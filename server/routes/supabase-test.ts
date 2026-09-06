import { RequestHandler } from "express";
import { supabase } from "../config/supabase";

export const handleSupabaseTest: RequestHandler = async (req, res) => {
  try {
    // Attempt to query a non-existent table to verify database communication.
    // We expect a Postgres error (42P01: undefined_table) if the connection is successful,
    // rather than a network error or fetch failure.
    const { data, error } = await supabase
      .from("_connection_test_table")
      .select("*")
      .limit(1);

    if (error) {
      // PGRST205 or 42P01 means the relation doesn't exist, which confirms we reached the database!
      if (error.code === '42P01' || error.code === 'PGRST205' || error.code === 'PGRST116') {
        res.json({
          success: true,
          message: "Successfully connected to Supabase!",
          details: "Client initialized and communicated with the project (verified via database response)."
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Communicated with Supabase, but received unexpected error",
          error: error.message
        });
      }
    } else {
      res.json({
        success: true,
        message: "Successfully connected to Supabase!",
        details: "Query executed successfully."
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Server error during Supabase connection test",
      error: err.message
    });
  }
};
