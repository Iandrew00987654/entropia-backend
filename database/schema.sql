CREATE DATABASE IF NOT EXISTS entropia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE entropia_db;

-- 1. Tabla Maestra: Registro de la Simulación y su Entorno
CREATE TABLE IF NOT EXISTS simulations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    simulation_time FLOAT DEFAULT 0.0,
    current_day INT DEFAULT 1,
    clock VARCHAR(10) DEFAULT '00:00',
    is_night BOOLEAN DEFAULT FALSE,
    total_entities INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabla Dependiente: Organismos vivos en la simulación
CREATE TABLE IF NOT EXISTS simulation_entities (
    id VARCHAR(36) PRIMARY KEY, -- UUID generado por Entity.ts
    simulation_id INT NOT NULL,
    species_name VARCHAR(50) NOT NULL, -- 'Conejo', 'Zorro', 'Hierba silvestre', 'Árbol'
    entity_type ENUM('ANIMAL', 'PLANT') NOT NULL,
    is_alive BOOLEAN DEFAULT TRUE,
    age FLOAT DEFAULT 0.0,
    pos_x FLOAT NOT NULL,
    pos_y FLOAT NOT NULL,
    radius FLOAT NOT NULL,
    
    -- Atributos específicos de Animales (NULL si es Planta)
    health FLOAT NULL,
    max_health FLOAT NULL,
    energy FLOAT NULL,
    max_energy FLOAT NULL,
    speed FLOAT NULL,
    state_name VARCHAR(50) NULL, -- 'WANDERING', 'EATING', 'CHASING', etc.

    -- Atributos específicos de Plantas (NULL si es Animal)
    growth FLOAT NULL,
    max_radius FLOAT NULL,

    FOREIGN KEY (simulation_id) 
        REFERENCES simulations(id) 
        ON DELETE CASCADE
);