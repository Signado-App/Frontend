import React from "react";
import styles from "./FloatingContainer.module.scss";

interface FloatingContainerProps {
    padding?: number;
    children: React.ReactNode;
}

function FloatingContainer({ children, padding = 10 }: FloatingContainerProps) {
    return (
        <div className={styles.floatingContainer} style={{ padding: `${padding}px` }}>

        </div>
    );
}

export default FloatingContainer;