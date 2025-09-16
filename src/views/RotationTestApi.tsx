import React, { useState } from "react";
import { Rotation } from "../domain/Rotation";
import * as rotationService from "../service/RotationService";

const RotationTestApi: React.FC = () => {
    const [angle, setAngle] = useState(0);

    const handleCreateRotation = async () => {
        try {
            const newRotation: Rotation = { angle };
            const created = await rotationService.createRotation(newRotation);
            console.log("Created Rotation:", created);
            alert(`Rotation created with ID: ${created.rotationId}`);
        } catch (err) {
            console.error(err);
            alert("Error creating Rotation");
        }
    };

    const handleGetAll = async () => {
        try {
            const list = await rotationService.getAllRotations();
            console.log("All Rotations:", list);
            alert(`Fetched ${list.length} rotations`);
        } catch (err) {
            console.error(err);
            alert("Error fetching rotations");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Rotation Test</h1>
            <input
                type="number"
                placeholder="Angle"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
            />
            <div style={{ marginTop: "1rem" }}>
                <button onClick={handleCreateRotation}>Create Rotation</button>
                <button onClick={handleGetAll}>Get All Rotations</button>
            </div>
        </div>
    );
};

export default RotationTestApi;
