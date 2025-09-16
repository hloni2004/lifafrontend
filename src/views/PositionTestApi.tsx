import React, { useState } from "react";
import { Position } from "../domain/Position";
import * as positionService from "../service/PositionService";

const PositionTestApi: React.FC = () => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const handleCreatePosition = async () => {
        try {
            const newPosition: Position = { x, y };
            const created = await positionService.createPosition(newPosition);
            console.log("Created Position:", created);
            alert(`Position created with ID: ${created.positionId}`);
        } catch (err) {
            console.error(err);
            alert("Error creating Position");
        }
    };

    const handleGetAll = async () => {
        try {
            const list = await positionService.getAllPositions();
            console.log("All Positions:", list);
            alert(`Fetched ${list.length} positions`);
        } catch (err) {
            console.error(err);
            alert("Error fetching positions");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Position Test</h1>
            <input type="number" placeholder="X" value={x} onChange={(e) => setX(Number(e.target.value))} />
            <input type="number" placeholder="Y" value={y} onChange={(e) => setY(Number(e.target.value))} />
            <div style={{ marginTop: "1rem" }}>
                <button onClick={handleCreatePosition}>Create Position</button>
                <button onClick={handleGetAll}>Get All Positions</button>
            </div>
        </div>
    );
};

export default PositionTestApi;
