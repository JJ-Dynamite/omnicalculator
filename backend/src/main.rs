use axum::{Router, Json, extract::Path};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Deserialize)]
struct CalcRequest { values: HashMap<String, f64> }
#[derive(Serialize)]
struct Calculator { id: String, name: String, category: String, description: String }
#[derive(Serialize)]
struct CalcResult { result: f64, formula: String, steps: Vec<String> }

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let app = Router::new()
        .route("/", axum::routing::get(root))
        .route("/health", axum::routing::get(health))
        .route("/calculators", axum::routing::get(list_calculators))
        .route("/calculators/:type", axum::routing::get(get_calculator))
        .route("/calculate", axum::routing::post(calculate))
        .layer(tower_http::cors::CorsLayer::permissive());
    let port = std::env::var("PORT").unwrap_or_else(|_| "3001".into());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await.unwrap();
    tracing::info!("omnicalculator backend running on :{}", port);
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> Json<serde_json::Value> { Json(serde_json::json!({"service": "omnicalculator", "status": "running"})) }
async fn health() -> Json<serde_json::Value> { Json(serde_json::json!({"status": "healthy"})) }

async fn list_calculators() -> Json<serde_json::Value> {
    let calcs = vec![
        Calculator { id: "1".into(), name: "BMI Calculator".into(), category: "Health".into(), description: "Calculate Body Mass Index".into() },
        Calculator { id: "2".into(), name: "Mortgage Calculator".into(), category: "Finance".into(), description: "Calculate mortgage payments".into() },
        Calculator { id: "3".into(), name: "Tip Calculator".into(), category: "Finance".into(), description: "Calculate tips".into() },
    ];
    Json(serde_json::json!({ "calculators": calcs }))
}

async fn get_calculator(Path(calc_type): Path<String>) -> Json<serde_json::Value> {
    Json(serde_json::json!({ "id": calc_type, "name": format!("{} Calculator", calc_type), "category": "General", "description": format!("Calculate {}", calc_type) }))
}

async fn calculate(Json(req): Json<CalcRequest>) -> Json<serde_json::Value> {
    let result: f64 = req.values.values().sum();
    Json(serde_json::json!({ "result": result, "formula": "Sum of inputs", "steps": vec!["Add all values".into()] }))
}
