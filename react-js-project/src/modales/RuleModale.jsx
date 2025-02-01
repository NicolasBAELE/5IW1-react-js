import { Modale } from "../components/Modale";

const explainationStyles = { display: "flex", alignItems: "center", justifyContent: "space-between" }

export function RuleModale({ isOpen, onClose }) {
    return <Modale isOpen={isOpen} onClose={onClose} title={"Règles du combat"}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: "1.2rem", fontWeight: "bold" }}>
            <div style={explainationStyles}><img src="/multiple_punchs.jpg" /> bat <img src="/punch.jpg" /></div>
            <div style={explainationStyles}><img src="/punch.jpg" /> bat <img src="/leg_kick.jpg" /></div>
            <div style={explainationStyles}><img src="/leg_kick.jpg" /> bat <img src="/multiple_punchs.jpg" /></div>
        </div>
    </Modale>
}