// src/views/PlacementDataTestApi.tsx
import React, { useState } from "react";
import { PlacementData } from "../domain/PlacementData";
import * as placementDataService from "../service/PlacementDataService";
import * as positionService from "../service/PositionService";
import * as rotationService from "../service/RotationService";
import * as scaleService from "../service/ScaleService";

const PlacementDataTestApi: React.FC = () => {
    const [positionId, setPositionId] = useState<number>(0);
    const [rotationId, setRotationId] = useState<number>(0);
    const [scaleId, setScaleId] = useState<number>(0);

    const handleCreate = async () => {
    if (!positionId || !rotationId || !scaleId) {
        alert("Please fill in all fields");
        return;
    }

    try {
        // Fetch full objects from backend first
        const position = await positionService.getPositionById(positionId);
        const rotation = await rotationService.getRotationById(rotationId);
        const scale = await scaleService.getScaleById(scaleId);

        if (!position || !rotation || !scale) {
            alert("One of the selected IDs does not exist.");
            return;
        }

        // Build PlacementData with full objects
        const newPlacementData: PlacementData = { position, rotation, scale };

        const created = await placementDataService.createPlacementData(newPlacementData);
        console.log("Created PlacementData:", created);
        alert(`PlacementData created! ID: ${created.placementDataId}`);

    } catch (err) {
        console.error(err);
        alert("Error creating PlacementData. Ensure the IDs exist in the database.");
    }
};

    const handleGetAll = async () => {
        try {
            const allData = await placementDataService.getAllPlacementData();
            console.log("All PlacementData:", allData);
            alert(`Fetched ${allData.length} PlacementData records. Check console for details.`);
        } catch (err) {
            console.error(err);
            alert("Error fetching PlacementData.");
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "600px" }}>
            <h1>PlacementData Test API</h1>

            <input
                type="number"
                placeholder="Position ID"
                value={positionId}
                onChange={e => setPositionId(Number(e.target.value))}
                style={{ marginRight: "1rem", marginBottom: "0.5rem" }}
            />
            <input
                type="number"
                placeholder="Rotation ID"
                value={rotationId}
                onChange={e => setRotationId(Number(e.target.value))}
                style={{ marginRight: "1rem", marginBottom: "0.5rem" }}
            />
            <input
                type="number"
                placeholder="Scale ID"
                value={scaleId}
                onChange={e => setScaleId(Number(e.target.value))}
                style={{ marginBottom: "1rem" }}
            />

            <div>
                <button onClick={handleCreate} style={{ marginRight: "1rem" }}>
                    Create PlacementData
                </button>
                <button onClick={handleGetAll}>
                    Get All PlacementData
                </button>
            </div>
        </div>
    );
};

export default PlacementDataTestApi;
