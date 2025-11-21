import styles from "@/app/page.module.css";
import FloatingContainer from "@/components/FloatingContainer/FloatingContainer";

export default function RegisterPage() {
  return (
    <main>
        <FloatingContainer>
            <h1 className={styles.intro}>Registrace</h1>
        </FloatingContainer>
    </main>
  );
}
