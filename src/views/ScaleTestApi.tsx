import React, { useState } from "react";
import { Scale } from "../domain/Scale";
import * as scaleService from "../service/ScaleService";

const ScaleTestApi: React.FC = () => {
    const [value, setValue] = useState(1);

    const handleCreateScale = async () => {
        try {
            const newScale: Scale = { value };
            const created = await scaleService.createScale(newScale);
            console.log("Created Scale:", created);
            alert(`Scale created with ID: ${created.scaleId}`);
        } catch (err) {
            console.error(err);
            alert("Error creating Scale");
        }
    };

    const handleGetAll = async () => {
        try {
            const list = await scaleService.getAllScales();
            console.log("All Scales:", list);
            alert(`Fetched ${list.length} scales`);
        } catch (err) {
            console.error(err);
            alert("Error fetching scales");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Scale Test</h1>
            <input
                type="number"
                placeholder="Value"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
            />
            <div style={{ marginTop: "1rem" }}>
                <button onClick={handleCreateScale}>Create Scale</button>
                <button onClick={handleGetAll}>Get All Scales</button>
            </div>
        </div>
    );
};

export default ScaleTestApi;
