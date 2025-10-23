// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{command, Manager};
use std::fs;
use serde::{Deserialize, Serialize};

// Note structure matching the JavaScript frontend
#[derive(Serialize, Deserialize, Debug, Clone)]
struct Note {
    id: String,
    title: String,
    content: String,
    tags: Vec<String>,
    #[serde(rename = "createdAt")]
    created_at: String,
    #[serde(rename = "updatedAt")]
    updated_at: String,
}

/// Load notes from the app data directory
/// Returns a vector of notes or an empty vector if the file doesn't exist
#[command]
fn load_notes(app_handle: tauri::AppHandle) -> Result<Vec<Note>, String> {
    // Get the app data directory path (Tauri 2.x API)
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    let notes_path = app_dir.join("notes.json");
    
    // If the file doesn't exist, return an empty vector
    if !notes_path.exists() {
        return Ok(Vec::new());
    }
    
    // Read the file contents
    let data = fs::read_to_string(&notes_path)
        .map_err(|e| format!("Failed to read notes file: {}", e))?;
    
    // Parse JSON to Vec<Note>
    let notes: Vec<Note> = serde_json::from_str(&data)
        .map_err(|e| format!("Failed to parse notes JSON: {}", e))?;
    
    Ok(notes)
}

/// Save notes to the app data directory
/// Creates the directory if it doesn't exist
#[command]
fn save_notes(app_handle: tauri::AppHandle, notes: Vec<Note>) -> Result<(), String> {
    // Get the app data directory path (Tauri 2.x API)
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    // Create the directory if it doesn't exist
    fs::create_dir_all(&app_dir)
        .map_err(|e| format!("Failed to create app data directory: {}", e))?;
    
    let notes_path = app_dir.join("notes.json");
    
    // Serialize notes to pretty JSON
    let json = serde_json::to_string_pretty(&notes)
        .map_err(|e| format!("Failed to serialize notes: {}", e))?;
    
    // Write to file
    fs::write(&notes_path, json)
        .map_err(|e| format!("Failed to write notes file: {}", e))?;
    
    Ok(())
}

/// Get an environment variable by key
/// Returns None if the variable doesn't exist
#[command]
fn get_env(key: String) -> Option<String> {
    std::env::var(key).ok()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            load_notes,
            save_notes,
            get_env
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
